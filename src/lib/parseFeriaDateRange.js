/**
 * `feria.dateRange` is a free-text display string (e.g. "Dec 2 to 6" or
 * "5 al 10 de Diciembre") — it does NOT include a year, and the schema
 * allows either English or Spanish phrasing. That makes it unsafe to sort
 * directly as a string: it has no year to disambiguate fairs in different
 * years, and English/Spanish + inconsistent casing ("dec" vs "Dec") sort
 * unpredictably against each other.
 *
 * This parser combines `dateRange` with the document's `year` field to
 * produce real, comparable `Date`s, so callers can sort chronologically
 * and detect malformed data instead of silently mis-sorting it.
 *
 * Returns `{ start, end }` (both `Date`) on success, or `null` if the
 * string doesn't match a known format — callers should treat `null` as
 * "flag this feria for review", not guess.
 */

const MONTHS = {
  // English (full + common abbreviations)
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
  // Spanish (full + common abbreviations)
  ene: 0, enero: 0,
  febrero: 1,
  marzo: 2,
  abr: 3, abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  ago: 7, agosto: 7,
  septiembre: 8, setiembre: 8,
  octubre: 9,
  noviembre: 10,
  dic: 11, diciembre: 11,
}

function stripAccents(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function monthIndex(name) {
  const key = stripAccents(name).toLowerCase().replace(/\.$/, '')
  return key in MONTHS ? MONTHS[key] : null
}

// "Dec 2 to 6", "dec 1 to 5", "Nov 12 to 15", "Aug 28 to 30", or a
// cross-month range like "Dec 30 to Jan 3"
const EN_RANGE = /^([a-z.]+)\s+(\d{1,2})\s*(?:to|-|–|—)\s*(?:([a-z.]+)\s+)?(\d{1,2})$/i

// "5 al 10 de Diciembre"
const ES_RANGE = /^(\d{1,2})\s+al\s+(\d{1,2})\s+de\s+([a-z]+)$/i

export function parseFeriaDateRange(dateRange, year) {
  if (typeof dateRange !== 'string' || !dateRange.trim()) return null
  if (!Number.isInteger(year)) return null

  const input = dateRange.trim()

  let startMonth, startDay, endMonth, endDay

  const en = input.match(EN_RANGE)
  if (en) {
    const [, m1, d1, m2, d2] = en
    startMonth = monthIndex(m1)
    startDay = parseInt(d1, 10)
    endMonth = m2 ? monthIndex(m2) : startMonth
    endDay = parseInt(d2, 10)
  } else {
    const es = input.match(ES_RANGE)
    if (es) {
      const [, d1, d2, m] = es
      startMonth = endMonth = monthIndex(m)
      startDay = parseInt(d1, 10)
      endDay = parseInt(d2, 10)
    }
  }

  if (
    startMonth === null ||
    startMonth === undefined ||
    endMonth === null ||
    endMonth === undefined ||
    !Number.isInteger(startDay) ||
    !Number.isInteger(endDay) ||
    startDay < 1 ||
    startDay > 31 ||
    endDay < 1 ||
    endDay > 31
  ) {
    return null
  }

  const start = new Date(year, startMonth, startDay)
  let end = new Date(year, endMonth, endDay)

  // Range wraps into the next year (e.g. "Dec 30 to Jan 3")
  if (end < start) {
    end = new Date(year + 1, endMonth, endDay)
  }

  return { start, end }
}
