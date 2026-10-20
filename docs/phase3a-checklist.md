# Phase 3a checklist

Design system and shared plumbing only. Real pages, filters, week strip and hero come in the next phase.

## 1. Scaffold
- [x] Vite + React + TypeScript app in `frontend/`
- [x] Strict tsconfig, `@/` path alias (tsconfig + vite)
- [x] ESLint + Prettier
- [x] Scripts: dev, build, preview, lint, typecheck
- [x] Folders: `src/features/*`, `src/components/ui`, `src/components/layout`, `src/lib`, `src/hooks`
- [x] Deps: react-router, @tanstack/react-query, react-hook-form, zod, motion, date-fns, tailwindcss v4, @fontsource (Fraunces, Hanken Grotesk, JetBrains Mono), @radix-ui/react-dialog
- [x] No component library installed
- [x] `VITE_API_URL` env + `.env.example`

## 2. Tokens and globals
- [x] Colors in `@theme` (paper, paper-2, ink, ink-soft, vermilion, moss, butter)
- [x] Fonts in `@theme` (display, body, mono)
- [x] Radii and hard shadow tokens in `@theme`
- [x] Base styles, selection color
- [x] Visible focus ring (vermilion, offset outline)
- [x] Paper grain overlay (inline SVG noise, low opacity, pointer-events none)
- [x] No tailwind.config.js

## 3. Cursor rule
- [x] `.cursor/rules/frontend.mdc` with globs `frontend/**`, about 40 lines max
- [x] Palette tokens, type roles, shape rules, banned patterns and words, copy tone
- [x] Code conventions (feature folders, small components, no comment narration, no JSDoc spam, no emojis, no unused deps)

## 4. UI primitives (`src/components/ui`)
- [x] Button (primary / secondary / ghost, press-in shadow)
- [x] Input
- [x] Select
- [x] Field (label, hint, error, aria-describedby)
- [x] Dialog (Radix wrapper, enter/exit motion)
- [x] Toast (provider + hook, stacked, auto-dismiss, aria-live)
- [x] Skeleton
- [x] SectionLabel ("No. 02")
- [x] Stamp (rotated mono)

## 5. Ticket
- [x] Perforated side notches (radial-gradient mask)
- [x] Dashed tear line
- [x] Mono time stamp, serif teacher name, mono specialization and duration
- [x] Variant: available (clickable, hover lift)
- [x] Variant: booked
- [x] Variant: completed (DONE stamp with completedAt)
- [x] TicketSkeleton with the same silhouette

## 6. API layer
- [x] Typed fetch client unwrapping the envelope
- [x] Typed ApiError (code, message, status, details)
- [x] Shared types matching the backend
- [x] Centralized query keys
- [x] teachers: list, create
- [x] users: list, get, create
- [x] sessions: available by date, create, book, complete, user sessions
- [x] Mutations invalidate the right keys

## 7. Acting-as
- [x] Context + hook backed by localStorage, guards bad/stale values
- [x] UserPicker dialog: list users (GET /users)
- [x] UserPicker: create user (POST /users), 409 duplicate email inline
- [x] Loading, empty and error states

## 8. Layout shell
- [x] Header: wordmark, nav (Home, Browse, Teachers, My sessions), "Acting as: {name}" control opening UserPicker
- [x] Mobile nav works at 360px
- [x] Route transitions via motion
- [x] `useDocumentTitle` hook

## 9. Routing
- [x] Placeholder pages: `/`, `/sessions`, `/teachers`, `/me`
- [x] Designed 404 page with personality

## 10. Styleguide
- [x] `/styleguide` only when `import.meta.env.DEV`
- [x] Every primitive shown
- [x] All three Ticket variants with mock data + skeleton
- [x] Toast triggers
- [x] Type scale

## Cross-cutting
- [x] Reduced motion respected everywhere
- [x] No banned words, emojis, gradients, blurred shadows, purple/blue
- [x] `npm run typecheck`, `npm run lint`, `npm run build` pass
- [x] Final message has "Manual steps for me" and "Verify manually"
