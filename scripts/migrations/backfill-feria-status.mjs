/**
 * One-time backfill for the new `feria.status` field.
 *
 * Existing feria documents predate the `status` schema field, so they have
 * no value for it yet. The frontend now groups /ferias into three sections
 * ("Futuras" / "Presentes" / "Pasadas") by `status`, so until this backfill
 * runs, existing ferias have no group to sort into and won't appear under
 * any header on the page.
 *
 * `status` is a MANUAL field going forward — nothing in the app computes it
 * automatically. This script only proposes a ONE-TIME starting value per
 * feria, using a simple rule:
 *
 *   - isCurrent: true                     -> "Presente"
 *   - dateRange (combined with year) is in the past   -> "Pasada"
 *   - dateRange (combined with year) is in the future  -> "Futura"
 *   - today falls inside the date range but isCurrent is false
 *       -> proposes "Presente" but flags it (⚠ RUNNING NOW) since this is
 *          exactly the kind of edge case (e.g. a multi-day fair currently
 *          running) simple date math gets wrong — review it by hand.
 *   - dateRange doesn't parse (missing/malformed, or missing year)
 *       -> no proposal; flagged (⚠ CANNOT PROPOSE) for manual entry.
 *
 * This is a proposed DEFAULT ONLY. Review every line of dry-run output
 * before running with --execute — correct any status the simple date logic
 * got wrong. Nothing is written until you explicitly confirm.
 *
 * Usage:
 *   Dry run (default, no writes, safe to run anytime):
 *     node --env-file=.env.local scripts/migrations/backfill-feria-status.mjs
 *
 *   Actual write (only after reviewing the dry-run output AND taking a
 *   dataset backup — see the reminder printed below):
 *     node --env-file=.env.local scripts/migrations/backfill-feria-status.mjs --execute --confirm-backup-taken
 *
 *   Both --execute and --confirm-backup-taken are required to write. This is
 *   deliberate friction — do not script around it.
 *
 * Requires a Sanity API token with write access in SANITY_API_TOKEN (not
 * needed for the dry run, only for --execute). Create one at
 * https://www.sanity.io/manage → your project → API → Tokens.
 */

import { createClient } from '@sanity/client'
import { parseFeriaDateRange } from '../../src/lib/parseFeriaDateRange.js'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2tdxdzhg'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'mueve'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-09-30'

const args = process.argv.slice(2)
const isExecute = args.includes('--execute')
const hasBackupConfirmation = args.includes('--confirm-backup-taken')

function proposeStatus(feria, now) {
  if (feria.isCurrent === true) {
    return { status: 'Presente', flag: null }
  }

  const parsed = parseFeriaDateRange(feria.dateRange, feria.year)
  if (!parsed) {
    return {
      status: null,
      flag: 'CANNOT PROPOSE — dateRange/year missing or malformed, review manually',
    }
  }

  const { start, end } = parsed
  if (now < start) return { status: 'Futura', flag: null }
  if (now > end) return { status: 'Pasada', flag: null }

  // today falls inside [start, end] but isCurrent is false
  return {
    status: 'Presente',
    flag: 'RUNNING NOW per dates but isCurrent=false — double-check this one',
  }
}

async function main() {
  console.log(`Sanity project: ${projectId} / dataset: ${dataset}\n`)

  const readClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  })

  const ferias = await readClient.fetch(
    `*[_type == "feria"] | order(year desc, order asc){
      _id, title, year, dateRange, isCurrent, status
    }`
  )

  if (ferias.length === 0) {
    console.log('No feria documents found. Nothing to migrate.')
    return
  }

  const now = new Date()
  const plan = ferias.map((f) => {
    const { status, flag } = proposeStatus(f, now)
    return { ...f, proposedStatus: status, flag }
  })

  console.log(`${ferias.length} feria document(s) found. Proposed status values:\n`)

  for (const p of plan) {
    const overwriteNote = p.status
      ? ` (⚠ overwriting existing status: ${p.status})`
      : ''
    const flagNote = p.flag ? `\n        ⚠ ${p.flag}` : ''
    console.log(
      `  "${p.title}"  year=${p.year}  dateRange="${p.dateRange}"  isCurrent=${p.isCurrent === true}\n` +
        `        -> proposed status: ${p.proposedStatus ?? '(none — needs manual entry)'}${overwriteNote}${flagNote}`
    )
  }

  const needsReview = plan.filter((p) => p.flag)

  if (!isExecute) {
    console.log(
      '\nDRY RUN ONLY — nothing was written.\n' +
        (needsReview.length > 0
          ? `${needsReview.length} feria(s) above are flagged (⚠) — review and correct those by hand before executing.\n`
          : '') +
        '\nReview EVERY proposed status above yourself — this is a one-time starting\n' +
        'point from simple date math, not authoritative. Correct any that are wrong\n' +
        '(e.g. a multi-day fair currently running that the date math miscategorized)\n' +
        'before running with --execute.\n\n' +
        'Before re-running with --execute, take a full dataset backup:\n' +
        `  npx sanity dataset export ${dataset} ./backups/${dataset}-$(date +%Y%m%d-%H%M%S).tar.gz\n\n` +
        'Once you have the backup and the plan above looks correct, re-run with:\n' +
        '  node --env-file=.env.local scripts/migrations/backfill-feria-status.mjs --execute --confirm-backup-taken'
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

  const missingStatus = plan.filter((p) => !p.proposedStatus)
  if (missingStatus.length > 0) {
    console.error(
      `\nRefusing to write: ${missingStatus.length} feria(s) have no proposed status ` +
        '(malformed/missing dateRange or year) and would be left unset.\n' +
        'Fix the underlying dateRange/year in Sanity Studio, or set status by hand, then re-run.'
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

  console.log('\nWriting status to all ferias...')
  const tx = writeClient.transaction()
  for (const p of plan) {
    tx.patch(p._id, (patch) => patch.set({ status: p.proposedStatus }))
  }
  await tx.commit()
  console.log('Done. Ferias now have status values matching the plan above.')
}

main().catch((err) => {
  console.error('\nMigration failed:', err.message)
  process.exitCode = 1
})
