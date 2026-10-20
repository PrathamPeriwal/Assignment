export const HOURS = Array.from({ length: 10 }, (_, index) => 8 + index);

export const pad = (value: number) => String(value).padStart(2, '0');

export const hourLabel = (hour: number) => `${pad(hour)}:00 to ${pad(hour + 1)}:00`;

export const claimed = (count: number) => `${count} of ${HOURS.length} hours claimed.`;

// Alternating lean so a row of torn tiles reads as hand-torn, not mirrored
export const tearTilt = (index: number) => (index % 2 === 0 ? -5 : 4);

// How many tiles either side of the pointer feel the pull
const REACH = 2.5;

export function falloff(distance: number) {
  const away = Math.abs(distance);
  if (away >= REACH) return 0;
  const wave = Math.cos((away / REACH) * (Math.PI / 2));
  return wave * wave;
}
