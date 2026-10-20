# Office hours

Teachers publish short office-hour slots. Students book a slot, and a booked slot can be marked completed. This repo is the HTTP API plus a React app for browsing and booking.

## Tech stack

Node.js 20+, TypeScript (strict), Express 5, MongoDB 7, Mongoose, Zod, helmet, cors, morgan, express-rate-limit, Vitest. Frontend: Vite, React 19, React Router 7, TanStack Query, react-hook-form, Tailwind CSS 4.

## Quick start

Prerequisites: Node.js 20 or newer, npm, and Docker if you want a local MongoDB.

### Backend

From the repo root, start MongoDB:

```sh
docker compose up -d
```

That publishes MongoDB on `localhost:27017`. To use Atlas instead, skip compose and put the Atlas URI in `MONGODB_URI` (include the database name in the path).

```sh
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

The `copy` lines are for Windows. On macOS or Linux, use `cp .env.example .env` in both apps. `npm run seed` deletes users, teachers, and sessions in the database named by `MONGODB_URI`, then inserts demo data. `npm run dev` restarts when files change. The API listens on port 3000.

Other scripts, from `backend/`: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, then `npm start`.

### Frontend

The API should already be running.

```sh
cd frontend
copy .env.example .env
npm install
npm run dev
```

The app is at <http://localhost:5173>. It calls the API at `VITE_API_URL`.

Other scripts, from `frontend/`: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run preview`, `npm run format`.

## Environment variables

### Backend (`backend/.env`)

| Variable | Purpose | Example / default |
| --- | --- | --- |
| `PORT` | Port the HTTP server listens on | `3000` (default) |
| `MONGODB_URI` | MongoDB connection string. Database name goes in the path | `mongodb://localhost:27017/session_booking` (required) |
| `NODE_ENV` | `development`, `test`, or `production`. Selects the morgan format | `development` (default) |
| `CORS_ORIGIN` | Allowed browser origins, comma-separated | `http://localhost:5173` (required) |

### Frontend (`frontend/.env`)

| Variable | Purpose | Example / default |
| --- | --- | --- |
| `VITE_API_URL` | API base URL. A trailing slash is stripped | `http://localhost:3000` (required) |

## API reference

Success: `{ success: true, data, message? }`. Failure: `{ success: false, error: { code, message, details? } }`. Any route can also return `429` (more than 120 requests a minute from one IP) or `500`.

| Method | Path | Success | Errors |
| --- | --- | --- | --- |
| POST | `/users` (required) | 201 | 400, 409 |
| POST | `/sessions` (required) | 201 | 400, 404, 409 |
| GET | `/sessions/available?dateTimestamp={timestamp}` (required) | 200 | 400 |
| POST | `/sessions/:id/book` (required) | 200 | 400, 404, 409 |
| PATCH | `/sessions/:id/complete` (required) | 200 | 400, 404, 409 |
| GET | `/users/:id/sessions` (required) | 200 | 400, 404 |
| GET | `/health` | 200 | |
| GET | `/users` | 200 | |
| GET | `/users/:id` | 200 | 400, 404 |
| POST | `/teachers` | 201 | 400, 409 |
| GET | `/teachers` | 200 | |

`dateTimestamp` is required epoch milliseconds. Optional `tzOffsetMinutes` defaults to `0`. Bodies and example payloads are in the Postman collection.

`400` is `VALIDATION_ERROR`, `INVALID_ID`, or `BAD_REQUEST`. `404` is `NOT_FOUND`. `409` is `CONFLICT`. `429` is `RATE_LIMITED`. `500` is `INTERNAL_ERROR`.

## Aggregation pipelines

`GET /sessions/available` and `GET /users/:id/sessions` read with `aggregate`. The other reads use `find`.

**Available sessions.** `dayRange` turns `dateTimestamp` and `tzOffsetMinutes` into `[start, end)`. Offset `0` is the UTC day; `330` is the India day. The pipeline `$match`es `AVAILABLE` sessions whose `startTime` is inside that window, `$sort`s by `startTime`, `$lookup`s and `$unwind`s the teacher, then `$project`s the times, `durationMinutes` (`$dateDiff`), and a short teacher object. The join and the day filter stay in the database.

**A user's sessions.** The service returns 404 when the user is missing, then aggregates. The pipeline `$match`es that `userId`, joins the teacher the same way, `$project`s times, status, `completedAt`, duration, and teacher, then `$facet`s two lists: `upcoming` (`BOOKED`, earliest start first) and `completed` (`COMPLETED`, latest `completedAt` first). The handler adds `counts`.

```sh
curl -s -X POST http://localhost:3000/sessions/SESSION_ID/book -H "Content-Type: application/json" -d "{\"userId\":\"USER_ID\"}"
```

```json
{
  "success": true,
  "message": "Session booked",
  "data": {
    "_id": "…",
    "teacherId": "…",
    "userId": "…",
    "startTime": "…",
    "endTime": "…",
    "status": "BOOKED",
    "completedAt": null,
    "createdAt": "…",
    "updatedAt": "…"
  }
}
```

## Beyond the brief

**Backend**

- Booking and completing each use one `findOneAndUpdate` filtered on the current status, then a follow-up read chooses 404 or 409.
- Creating a session rejects a time range that overlaps another session for that teacher.
- `tzOffsetMinutes` moves the available-sessions day off UTC onto the client's offset.
- One success helper and one error middleware produce the response envelope. Zod covers bodies, queries, ids, and env.
- helmet, cors, and a 120-request rate limit sit in front of the routes. Morgan logs requests.
- SIGINT and SIGTERM close the HTTP server and disconnect MongoDB.
- `npm run seed` loads 6 teachers, 4 users, and 30 one-hour sessions (24 available, 4 booked, 2 completed) across today and the next six UTC days.
- API tests use Vitest, supertest, and mongodb-memory-server. `docker-compose.yml` runs MongoDB 7.

**Frontend**

- React app with home, browse, teachers, and my sessions.
- Ticket-style UI: paper background, ink rules, vermilion accent, and a session rendered as a ticket.
- Home has a rolling subject line, a live count of today's open sessions, and a practice day strip that saves nothing.
- An "Acting as" picker chooses or creates the current person and remembers them in this browser. There is no login.
- Booking confirms in a dialog. A 409 says the slot was just taken and refreshes the list.
- The teachers page adds a teacher and opens a new slot for them.
- My sessions lists upcoming and completed bookings, and can mark a booked session completed.

## Project structure

```
.
├── docker-compose.yml    MongoDB 7 on port 27017
├── postman/              Office Hours collection and the local environment
├── backend/
│   ├── src/              config, models, validators, controllers, services, routes, middlewares
│   └── tests/            API tests
└── frontend/
    ├── public/           favicon
    └── src/              features, components, lib, hooks, styles
```

A request goes routes, then validate, then a controller, then a service, then a Mongoose model.

## Testing

From `backend/`:

```sh
npm test
```

Tests boot an in-memory MongoDB and do not touch the database in `.env`.

Import both files in `postman/`:

- `office-hours.postman_collection.json`
- `local.postman_environment.json`

Select the environment named `local` (`baseUrl` is `http://localhost:3000`). Start the API with `npm run dev`, open the Office Hours collection, and run it with Collection Runner in the existing order.

Create requests save `teacherId`, `userId`, and `sessionId` for the requests after them. Emails include a timestamp, so a run still works after `npm run seed`, and a second run does not collide with the first. Requests that expect a 4xx turn green when the API returns that error. A red row means the status or the body differed from the test script.

## Assumptions

- "Upcoming" means status `BOOKED`. A booked session stays upcoming after its start time until it is completed.
- User email and teacher email are unique. Stored emails are trimmed and lowercased.
- Creating a session allows a start time in the past.
- Overlap is checked per teacher. Two teachers may overlap. A session that ends exactly when the next one starts is allowed.
- `dateTimestamp` is epoch milliseconds. The day is the UTC day of that instant unless `tzOffsetMinutes` is set.
- There is no authentication. Booking sends a `userId`.
