# Phase 3b checklist

Real pages on top of the phase 3a foundation.

## Preparation
- [x] Read `project.mdc`, `frontend.mdc`, `backend/README.md`
- [x] Reviewed `components/ui`, `features/*`, `lib`; reuse existing pieces
- [x] Checked installed package versions and used current APIs
- [x] Missing primitives added to `components/ui` in the same style (no new colors or fonts)

## 1. Home `/`
- [x] `features/home/Hero.tsx` placeholder, clearly marked, big headline
- [x] "How it works" with 3 steps, numbered, ruled, editorial, varied widths (not three equal cards)

## 2. Browse `/sessions`
- [x] Week strip: 7 day buttons from today, today marked, selected day stamped
- [x] Jump-to-date input for dates beyond the week
- [x] GET /sessions/available with local start-of-day ms and tzOffsetMinutes (sign checked against README)
- [x] Client-side filter by teacher name or specialization
- [x] Tickets in a ruled timetable layout, responsive, staggered entrance
- [x] Ticket click opens confirm dialog (teacher, date and time, "Booking as {name}")
- [x] No acting-as user: UserPicker opens first, then the confirm dialog continues
- [x] POST book; success shows stamp animation, toast, ticket removed
- [x] 409: friendly "someone just took this one", dialog closes, list refetches
- [x] Skeleton tickets while loading
- [x] Designed empty state with nudge to the next day that has sessions, or the week strip
- [x] Error state with retry

## 3. Teachers `/teachers`
- [x] Index-card rows: name, specialization, years, mono ID tail
- [x] "Add teacher" dialog (react-hook-form + zod, server errors inline)
- [x] Per-teacher "Create session" dialog: date, start, end, end-after-start validation
- [x] startTime/endTime built as ISO from local date and time
- [x] Server errors (overlap 409) inline in the form
- [x] Loading, empty, error states

## 4. My sessions `/me`
- [x] Upcoming and Completed sections, each with a count
- [x] "Mark as completed" on upcoming, labelled as a teacher action kept for the demo, confirm and toast
- [x] Completed tickets show DONE stamp and completedAt
- [x] No user selected: prompt to pick or create one
- [x] Empty states for both sections
- [x] Loading and error states

## 5. All pages
- [x] Document titles
- [x] Loading, empty, error states
- [x] Works at 360px

## Quality bar
- [x] Components small, split by feature folder
- [x] Labelled fields, focus-visible styles
- [x] Mutation buttons disabled while pending
- [x] No layout shift when data arrives
- [x] Plain copy, no banned words, no comment narration, no emojis
- [x] Nothing looks like a generic SaaS template

## Finish
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] Brief re-read against this checklist
- [x] Final message has "Manual steps for me" and "Verify manually"
