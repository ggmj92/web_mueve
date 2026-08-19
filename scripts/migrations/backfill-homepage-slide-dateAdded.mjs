/**
 * One-time backfill for the new `homepage.slides[].dateAdded` field.
 *
 * Existing homepage slides predate the `dateAdded` schema field, so they have
 * no value for it yet. The frontend now sorts slides by `dateAdded desc`
 * (see src/app/page.js), so until this backfill runs, existing slides have no
 * sort key and their on-site order is not guaranteed to match today's array
 * order.
 *
 * This script assigns each existing slide a `dateAdded` timestamp that
 * PRESERVES the current visual order: it walks `slides[]` top to bottom and
 * assigns descending timestamps, one minute apart, starting from "now" — so
 * slide 0 (first in the array today) gets the most recent timestamp and
 * therefore still sorts first after the migration. Nothing reshuffles.
 *
 * Usage:
 *   Dry run (default, no writes, safe to run anytime):
 *     node --env-file=.env.local scripts/migrations/backfill-homepage-slide-dateAdded.mjs
 *
 *   Actual write (only after reviewing the dry-run output AND taking a
 *   dataset backup — see the reminder printed below):
 *     node --env-file=.env.local scripts/migrations/backfill-homepage-slide-dateAdded.mjs --execute --confirm-backup-taken
 *
 *   Both --execute and --confirm-backup-taken are required to write. This is
 *   deliberate friction — do not script around it.
 *
 * Requires a Sanity API token with write access in SANITY_API_TOKEN (not
 * needed for the dry run, only for --execute). Create one at
 * https://www.sanity.io/manage → your project → API → Tokens.
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2tdxdzhg'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'mueve'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-09-30'

const args = process.argv.slice(2)
const isExecute = args.includes('--execute')
const hasBackupConfirmation = args.includes('--confirm-backup-taken')

const MINUTE_MS = 60 * 1000

function describeSlide(slide) {
  if (slide.caption) return `"${slide.caption}"`
  const alt = slide.image?.alt
  if (alt) return `(no caption, alt: "${alt}")`
  return '(no caption, no alt text)'
}

async function main() {
  console.log(`Sanity project: ${projectId} / dataset: ${dataset}\n`)

  const readClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  })

  const homepageId = await readClient.fetch(
    `*[_type == "homepage"][0]._id`
  )

  if (!homepageId) {
    console.error('No homepage document found. Nothing to migrate.')
    process.exitCode = 1
    return
  }

  // Raw, undereferenced document — preserves every existing field on each
  // slide (image asset refs, crop, hotspot, caption, durationMs, any
  // already-set dateAdded, and each slide's _key) exactly as stored.
  const doc = await readClient.getDocument(homepageId)
  const slides = Array.isArray(doc.slides) ? doc.slides : []

  if (slides.length === 0) {
    console.log('Homepage document has no slides. Nothing to migrate.')
    return
  }

  const now = new Date()
  const plan = slides.map((slide, i) => {
    const newDateAdded = new Date(now.getTime() - i * MINUTE_MS).toISOString()
    return {
      _key: slide._key,
      index: i,
      description: describeSlide(slide),
      currentDateAdded: slide.dateAdded || null,
      newDateAdded,
    }
  })

  console.log(`Homepage document: ${homepageId}`)
  console.log(`${slides.length} slide(s) found. Backfill plan (preserves current array order):\n`)

  for (const p of plan) {
    const overwriteNote = p.currentDateAdded
      ? ` (⚠ overwriting existing dateAdded: ${p.currentDateAdded})`
      : ''
    console.log(
      `  [${p.index}] key=${p._key}  ${p.description}\n` +
        `        -> dateAdded: ${p.newDateAdded}${overwriteNote}`
    )
  }

  if (!isExecute) {
    console.log(
      '\nDRY RUN ONLY — nothing was written. Review the plan above.\n' +
        'Before re-running with --execute, take a full dataset backup:\n' +
        `  npx sanity dataset export ${dataset} ./backups/${dataset}-$(date +%Y%m%d-%H%M%S).tar.gz\n\n` +
        'Once you have the backup and the plan above looks correct, re-run with:\n' +
        '  node --env-file=.env.local scripts/migrations/backfill-homepage-slide-dateAdded.mjs --execute --confirm-backup-taken'
    )
    return
  }

  // --execute was passed. Still refuse to write without explicit backup
  // confirmation and a write token.
  if (!hasBackupConfirmation) {
    console.error(
      '\nRefusing to write: --execute was passed without --confirm-backup-taken.\n' +
        'Take a full dataset backup first:\n' +
        `  npx sanity dataset export ${dataset} ./backups/${dataset}-$(date +%Y%m%d-%H%M%S).tar.gz\n` +
        'Then re-run with both --execute and --confirm-backup-taken.'
    )
    process.exitCode = 1
    return
  }

  const token = process.env.SANITY_API_TOKEN
  if (!token) {
    console.error(
      '\nRefusing to write: SANITY_API_TOKEN is not set.\n' +
        'Add a write-capable token to .env.local (see script header for where to create one).'
    )
    process.exitCode = 1
    return
  }

  const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  })

  const updatedSlides = slides.map((slide, i) => ({
    ...slide,
    dateAdded: plan[i].newDateAdded,
  }))

  console.log('\nWriting dateAdded to all slides...')
  await writeClient.patch(homepageId).set({ slides: updatedSlides }).commit()
  console.log('Done. Homepage slides now have dateAdded values matching the plan above.')
}

main().catch((err) => {
  console.error('\nMigration failed:', err.message)
  process.exitCode = 1
})
