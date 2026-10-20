export interface Step {
  title: string;
  body: string;
  placement: string;
}

export const steps: Step[] = [
  {
    title: 'Say who you are.',
    body: 'There are no logins. Pick your name from the list, or add yourself. It takes about ten seconds and the choice is remembered in this browser.',
    placement: 'md:col-span-7',
  },
  {
    title: 'Pick a day, then a slot.',
    body: 'Open slots are listed by day, earliest first. Narrow them down by teacher or subject, then click the ticket you want and confirm.',
    placement: 'md:col-span-8 md:col-start-5',
  },
  {
    title: 'Turn up. It gets stamped.',
    body: 'Your booking sits under My sessions. Once the hour is over, the teacher marks it completed and it moves to the done pile.',
    placement: 'md:col-span-6 md:col-start-2',
  },
];
