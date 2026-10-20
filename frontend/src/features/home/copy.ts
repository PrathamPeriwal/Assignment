export const subjects = ['calculus', 'Rust', 'watercolour', 'Hindi', 'jazz piano', 'statistics'];

const count = (value: number, noun: string) =>
  `${value === 0 ? 'no' : value} ${noun}${value === 1 ? '' : 's'}`;

export function liveLine(teachers: number, open: number) {
  const line = `${count(teachers, 'teacher')}, ${count(open, 'open session')} today`;
  return line.charAt(0).toUpperCase() + line.slice(1);
}
