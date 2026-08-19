// Arini was founded 2023-10-31. Keep this in sync with FOUNDED_ISO in
// control-plane/app/client/components/FoundingCounter.tsx — the two render the
// same number and there is no shared module between a React app and an
// unpacked extension.
const FOUNDED_UTC = Date.UTC(2023, 9, 31)
const ZONE = "America/Los_Angeles"
const PRECISION = 6
const SCALE = 10 ** PRECISION
const MS_PER_DAY = 86_400_000

// Pinned to one zone so the count reads the same for everyone rather than
// rolling over at each viewer's own midnight.
const zoneParts = new Intl.DateTimeFormat("en-US", {
  timeZone: ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
})

function elapsed(now) {
  const p = {}
  for (const { type, value } of zoneParts.formatToParts(now)) p[type] = value

  // Whole days come from the calendar date in the pinned zone, not from
  // dividing milliseconds: a DST changeover makes one local day 23 or 25 hours
  // long, which would drift the day number off the calendar.
  const localMidnightUTC = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day))
  const days = Math.round((localMidnightUTC - FOUNDED_UTC) / MS_PER_DAY)

  // h23 still reports 24 at exactly midnight in some engines.
  const hour = Number(p.hour) % 24
  const seconds = hour * 3600 + Number(p.minute) * 60 + Number(p.second) + now.getMilliseconds() / 1000

  return {
    days,
    fraction: String(Math.floor((seconds / 86_400) * SCALE)).padStart(PRECISION, "0"),
    week: Math.floor(days / 7) + 1,
  }
}

const daysEl = document.getElementById("days")
const fractionEl = document.getElementById("fraction")
const weekEl = document.getElementById("week")
const announceEl = document.getElementById("announce")

let shown = ""

function paint() {
  const next = elapsed(new Date())
  const key = `${next.days}.${next.fraction}`
  // Touch the DOM only when the digits move; rAF fires far faster than the
  // last digit changes.
  if (key !== shown) {
    shown = key
    daysEl.textContent = next.days
    fractionEl.textContent = `.${next.fraction}`
    weekEl.textContent = next.week
    announceEl.textContent = `Day ${next.days} since Arini was founded, week ${next.week}.`
  }
  requestAnimationFrame(paint)
}

requestAnimationFrame(paint)
