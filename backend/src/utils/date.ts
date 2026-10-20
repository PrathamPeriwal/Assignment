const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * 60_000;

// tzOffsetMinutes is minutes ahead of UTC (IST = 330), so the day boundary follows the client's calendar day.
export function dayRange(timestamp: number, tzOffsetMinutes: number) {
  const shift = tzOffsetMinutes * MINUTE_MS;
  const localMidnight = Math.floor((timestamp + shift) / DAY_MS) * DAY_MS;
  const start = new Date(localMidnight - shift);
  return { start, end: new Date(start.getTime() + DAY_MS) };
}
