'use client'

import { client } from '@/sanity/lib/client'
import { Fragment, useState, useEffect } from 'react'
import NewsletterModal from '@/components/NewsletterModal'
import styles from './ferias.module.css'
import { parseFeriaDateRange } from '@/lib/parseFeriaDateRange'

async function getFerias() {
  try {
    const query = `*[_type == "feria" && defined(slug.current)]{
        _id,
        title,
        "slug": slug.current,
        year,
        dateRange,
        isCurrent,
        status,
        order
      }`
    return await client.fetch(query)
  } catch (error) {
    console.error('Error fetching ferias:', error)
    return []
  }
}

const STATUS_GROUPS = [
  { status: 'Futura', header: 'Futuras' },
  { status: 'Presente', header: 'Presentes' },
  { status: 'Pasada', header: 'Pasadas' },
]

// `dateRange` is a free-text string with no year embedded ("Dec 2 to 6"),
// so it can't be sorted directly — GROQ's order(dateRange desc) would sort
// lexicographically and ignore year entirely. Sort by the parsed start
// date instead; ferias with a malformed/missing dateRange are flagged
// (not silently mis-sorted) and fall back to year/order so they still
// land somewhere sane.
function sortByDateRangeDesc(ferias) {
  const withKeys = ferias.map((f) => {
    const parsed = parseFeriaDateRange(f.dateRange, f.year)
    if (!parsed) {
      console.warn(
        `[ferias] "${f.title}" has a missing/malformed dateRange ("${f.dateRange}") ` +
          `for year ${f.year} — falling back to year/order for sorting. Fix this feria's ` +
          `dateRange in Sanity Studio.`
      )
    }
    const fallback = new Date((f.year || 0) * 10000 - (f.order || 0), 0, 1)
    return { feria: f, sortDate: parsed ? parsed.start : fallback }
  })

  withKeys.sort((a, b) => b.sortDate - a.sortDate)
  return withKeys.map((w) => w.feria)
}

function groupByStatus(ferias) {
  const sorted = sortByDateRangeDesc(ferias)

  const unclassified = sorted.filter(
    (f) => !STATUS_GROUPS.some((g) => g.status === f.status)
  )
  if (unclassified.length > 0) {
    console.warn(
      `[ferias] ${unclassified.length} feria(s) have no (or an unrecognized) status ` +
        `and won't appear in any group: ${unclassified.map((f) => `"${f.title}"`).join(', ')}. ` +
        'Run the status backfill migration (scripts/migrations/backfill-feria-status.mjs).'
    )
  }

  return STATUS_GROUPS.map(({ status, header }) => ({
    header,
    items: sorted.filter((f) => f.status === status),
  })).filter((group) => group.items.length > 0)
}

export default function FeriasPage() {
  const [ferias, setFerias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFerias()
      .then((ferias) => {
        setFerias(ferias)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error al cargar ferias:', error)
        setFerias([])
        setLoading(false)
      })
  }, [])

  return (
    <>
      <NewsletterModal />
      <div className={`${styles.ferias} alignSecondCol`}>
        <div className={styles.listCol}>
          {loading ? (
            <div>
              <p>Cargando ferias...</p>
            </div>
          ) : ferias.length > 0 ? (
            groupByStatus(ferias).map((group) => (
              <Fragment key={group.header}>
                <h2 className={styles.listHeader}>{group.header}</h2>
                <ul className={styles.list}>
                  {group.items.map((f) => (
                    <li key={f.slug ?? f._id} className={styles.listItem}>
                      <div className={styles.itemLink}>
                        <span className={`${styles.itemName} notranslate`}>
                          {f.title}
                        </span>
                        <span className={styles.itemYear}>{f.year}</span>
                        <span className={styles.itemDate}>{f.dateRange}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </Fragment>
            ))
          ) : (
            <div>
              <p>No se encontraron ferias.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
