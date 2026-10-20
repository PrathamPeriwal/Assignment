# Office hours API

Teachers publish office-hour slots. Students book a slot, and a booked slot can be marked completed. This package is the HTTP API. A frontend can come later.

## Tech stack

- Node.js 20 or newer
- TypeScript (strict)
- Express 5
- MongoDB with Mongoose
- Zod for request bodies, query strings, and environment variables
- helmet, cors, morgan, express-rate-limit
- Vitest, supertest, and mongodb-memory-server for tests

## Quick start

From the repo root, start MongoDB:

```
docker compose up -d
```

That publishes MongoDB on `localhost:27017`. If you use Atlas instead, skip compose and put the Atlas URI in `MONGODB_URI`. Include the database name in the path, for example `mongodb+srv://user:pass@cluster.example.net/session_booking`.

Then, in `backend/`:

```
npm install
copy .env.example .env
npm run dev
```

On macOS or Linux, use `cp .env.example .env` instead of `copy`. Edit `.env` if the port or the MongoDB URI is different. `npm run dev` restarts the server when files change.

Load demo data (safe to run again; it deletes existing users, teachers, and sessions in the database from `MONGODB_URI`, then inserts a fresh set):

```
npm run seed
```

Run the tests. They start an in-memory MongoDB, separate from the database in `.env`:

```
npm test
```

Other scripts: `npm run typecheck`, `npm run lint`, `npm run build`, then `npm start` for the compiled server.

## Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `PORT` | no | `3000` | Port the HTTP server listens on |
| `MONGODB_URI` | yes | | MongoDB connection string. Put the database name in the path |
| `NODE_ENV` | no | `development` | `development`, `test`, or `production`. Production error responses omit stacks |
| `CORS_ORIGIN` | yes | | Allowed browser origins, comma-separated if you have more than one |

See `.env.example`.

## Project structure

```
Assignment/
  docker-compose.yml
  README.md
  postman/
    office-hours.postman_collection.json
    local.postman_environment.json
  backend/
    src/
      config/          env.ts, db.ts
      constants/       session status and error codes
      models/          user, teacher, session
      validators/      zod schemas
      controllers/     HTTP only
      services/        business rules
      routes/          mounted at the root, no /api prefix
      middlewares/     validate, errors, 404, rate limit
      utils/           ApiError, sendSuccess, date helpers, logger
      app.ts           builds the Express app
      server.ts        connects to MongoDB, listens, shuts down on SIGINT/SIGTERM
      seed.ts          demo data
    tests/
      api.test.ts
    package.json
    tsconfig.json
    tsconfig.build.json
    vitest.config.mjs
    eslint.config.mjs
    .env.example
```

A request goes routes, then the validate middleware, then a controller, then a service, then a Mongoose model. Controllers do not import Mongoose. Services do not read `req` or `res`.

## Endpoints

| Method | Path | Success | Error statuses |
| --- | --- | --- | --- |
| GET | `/health` | 200 | |
| POST | `/users` | 201 | 400, 409 |
| GET | `/users` | 200 | |
| GET | `/users/:id` | 200 | 400, 404 |
| GET | `/users/:id/sessions` | 200 | 400, 404 |
| POST | `/teachers` | 201 | 400, 409 |
| GET | `/teachers` | 200 | |
| POST | `/sessions` | 201 | 400, 404, 409 |
| GET | `/sessions/available` | 200 | 400 |
| POST | `/sessions/:id/book` | 200 | 400, 404, 409 |
| PATCH | `/sessions/:id/complete` | 200 | 400, 404, 409 |

More than 120 requests in a minute from one IP gets `429`.

Failure bodies use this shape. `details` is present for validation problems.

| HTTP | `error.code` | When |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Body or query failed validation |
| 400 | `INVALID_ID` | A path id is not a 24-character hex ObjectId |
| 400 | `BAD_REQUEST` | The body is not JSON |
| 404 | `NOT_FOUND` | Unknown user, teacher, session, or route |
| 409 | `CONFLICT` | Duplicate email, overlapping session, or a status change that is not allowed |
| 429 | `RATE_LIMITED` | The rate limit tripped |
| 500 | `INTERNAL_ERROR` | Anything unexpected |

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "field": "email", "message": "Invalid email address" }]
  }
}
```

Ids in the examples below are illustrative.

## Examples

### GET /health

```http
GET /health
```

```json
{ "success": true, "data": { "status": "ok" } }
```

### POST /users

Email is trimmed and stored in lowercase.

```http
POST /users
Content-Type: application/json

{
  "fullName": "Aarav Shah",
  "email": "Aarav@Example.com",
  "phone": "+91 98450 11220"
}
```

```json
{
  "success": true,
  "message": "User created",
  "data": {
    "_id": "665f1c2b9a4e4d0012ab34cd",
    "fullName": "Aarav Shah",
    "email": "aarav@example.com",
    "phone": "+91 98450 11220",
    "createdAt": "2026-10-20T08:00:00.000Z",
    "updatedAt": "2026-10-20T08:00:00.000Z"
  }
}
```

The same email again:

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "A user with this email already exists"
  }
}
```

### GET /users

Returns every user, newest first.

```json
{
  "success": true,
  "data": [
    {
      "_id": "665f1c2b9a4e4d0012ab34cd",
      "fullName": "Aarav Shah",
      "email": "aarav@example.com",
      "phone": "+91 98450 11220",
      "createdAt": "2026-10-20T08:00:00.000Z",
      "updatedAt": "2026-10-20T08:00:00.000Z"
    }
  ]
}
```

### GET /users/:id

`GET /users/665f1c2b9a4e4d0012ab34cd` returns the same user object under `data`. `GET /users/not-an-id` is a 400 `INVALID_ID`. An id that is well formed but missing is a 404.

### GET /users/:id/sessions

```http
GET /users/665f1c2b9a4e4d0012ab34cd/sessions
```

```json
{
  "success": true,
  "data": {
    "upcoming": [
      {
        "_id": "665f1c2b9a4e4d0012ab3501",
        "startTime": "2026-10-21T09:00:00.000Z",
        "endTime": "2026-10-21T10:00:00.000Z",
        "status": "BOOKED",
        "completedAt": null,
        "durationMinutes": 60,
        "teacher": {
          "_id": "665f1c2b9a4e4d0012ab3401",
          "fullName": "Ananya Iyer",
          "specialization": "Algorithms",
          "experience": 14
        }
      }
    ],
    "completed": [
      {
        "_id": "665f1c2b9a4e4d0012ab3502",
        "startTime": "2026-10-20T09:00:00.000Z",
        "endTime": "2026-10-20T10:00:00.000Z",
        "status": "COMPLETED",
        "completedAt": "2026-10-20T10:00:00.000Z",
        "durationMinutes": 60,
        "teacher": {
          "_id": "665f1c2b9a4e4d0012ab3402",
          "fullName": "Priya Raman",
          "specialization": "Databases",
          "experience": 18
        }
      }
    ],
    "counts": { "upcoming": 1, "completed": 1 }
  }
}
```

`upcoming` is every `BOOKED` session for that user, earliest start first. `completed` is every `COMPLETED` session, most recently completed first.

### POST /teachers

```http
POST /teachers
Content-Type: application/json

{
  "fullName": "Ananya Iyer",
  "email": "ananya.iyer@example.com",
  "specialization": "Algorithms",
  "experience": 14
}
```

```json
{
  "success": true,
  "message": "Teacher created",
  "data": {
    "_id": "665f1c2b9a4e4d0012ab3401",
    "fullName": "Ananya Iyer",
    "email": "ananya.iyer@example.com",
    "specialization": "Algorithms",
    "experience": 14,
    "createdAt": "2026-10-20T08:00:00.000Z",
    "updatedAt": "2026-10-20T08:00:00.000Z"
  }
}
```

A repeated email is `409` with `CONFLICT`.

### GET /teachers

Returns every teacher, sorted by `fullName`. The objects match the create response.

### POST /sessions

`startTime` and `endTime` are ISO datetimes with an offset (`Z` is fine). The session starts as `AVAILABLE`.

```http
POST /sessions
Content-Type: application/json

{
  "teacherId": "665f1c2b9a4e4d0012ab3401",
  "startTime": "2026-10-21T10:00:00.000Z",
  "endTime": "2026-10-21T11:00:00.000Z"
}
```

```json
{
  "success": true,
  "message": "Session created",
  "data": {
    "_id": "665f1c2b9a4e4d0012ab3501",
    "teacherId": "665f1c2b9a4e4d0012ab3401",
    "userId": null,
    "startTime": "2026-10-21T10:00:00.000Z",
    "endTime": "2026-10-21T11:00:00.000Z",
    "status": "AVAILABLE",
    "completedAt": null,
    "createdAt": "2026-10-20T08:00:00.000Z",
    "updatedAt": "2026-10-20T08:00:00.000Z"
  }
}
```

Unknown `teacherId`: `404`. `endTime` equal to or before `startTime`: `400`. A time range that overlaps another session for that same teacher: `409`.

### GET /sessions/available

```http
GET /sessions/available?dateTimestamp=1792557000000&tzOffsetMinutes=330
```

`dateTimestamp` is epoch milliseconds and is required. `tzOffsetMinutes` is optional and defaults to `0` (the UTC day). A non-numeric timestamp is `400`.

```json
{
  "success": true,
  "data": [
    {
      "_id": "665f1c2b9a4e4d0012ab3501",
      "startTime": "2026-10-21T04:30:00.000Z",
      "endTime": "2026-10-21T05:30:00.000Z",
      "durationMinutes": 60,
      "teacher": {
        "_id": "665f1c2b9a4e4d0012ab3401",
        "fullName": "Ananya Iyer",
        "specialization": "Algorithms",
        "experience": 14
      }
    }
  ]
}
```

Only `AVAILABLE` sessions whose `startTime` falls on that calendar day are returned, earliest first.

### POST /sessions/:id/book

```http
POST /sessions/665f1c2b9a4e4d0012ab3501/book
Content-Type: application/json

{ "userId": "665f1c2b9a4e4d0012ab34cd" }
```

```json
{
  "success": true,
  "message": "Session booked",
  "data": {
    "_id": "665f1c2b9a4e4d0012ab3501",
    "teacherId": "665f1c2b9a4e4d0012ab3401",
    "userId": "665f1c2b9a4e4d0012ab34cd",
    "startTime": "2026-10-21T10:00:00.000Z",
    "endTime": "2026-10-21T11:00:00.000Z",
    "status": "BOOKED",
    "completedAt": null,
    "createdAt": "2026-10-20T08:00:00.000Z",
    "updatedAt": "2026-10-20T08:05:00.000Z"
  }
}
```

Unknown user or unknown session: `404`. Booking a session that is already `BOOKED` or `COMPLETED`: `409`, and the message includes the current status.

### PATCH /sessions/:id/complete

```http
PATCH /sessions/665f1c2b9a4e4d0012ab3501/complete
```

```json
{
  "success": true,
  "message": "Session completed",
  "data": {
    "_id": "665f1c2b9a4e4d0012ab3501",
    "teacherId": "665f1c2b9a4e4d0012ab3401",
    "userId": "665f1c2b9a4e4d0012ab34cd",
    "startTime": "2026-10-21T10:00:00.000Z",
    "endTime": "2026-10-21T11:00:00.000Z",
    "status": "COMPLETED",
    "completedAt": "2026-10-21T10:05:00.000Z",
    "createdAt": "2026-10-20T08:00:00.000Z",
    "updatedAt": "2026-10-21T10:05:00.000Z"
  }
}
```

Completing an `AVAILABLE` session, or completing one that is already `COMPLETED`, is `409`. The message includes the current status. A missing session is `404`.

## Aggregation pipelines

Endpoints 3 and 6 are the two reads that aggregate instead of using `find`.

### 3. GET /sessions/available

`dayRange` turns `dateTimestamp` into a half-open window `[start, end)`. With `tzOffsetMinutes` left at 0, that window is the UTC calendar day containing the timestamp. A positive offset (India is `330`) shifts the window to that timezone's calendar day.

The pipeline then:

1. `$match` sessions with status `AVAILABLE` and `startTime >= start` and `startTime < end`.
2. `$sort` by `startTime` ascending.
3. `$lookup` the `teachers` collection on `teacherId`.
4. `$unwind` the teacher array so each session sits next to one teacher document.
5. `$project` the session id, `startTime`, `endTime`, `durationMinutes` (`$dateDiff` in minutes), and a teacher object with `_id`, `fullName`, `specialization`, and `experience`.

The match keeps `AVAILABLE` sessions whose `startTime` sits inside that window.

### 6. GET /users/:id/sessions

The service first checks that the user exists, and answers `404` if not. The pipeline then:

1. `$match` sessions whose `userId` is that user.
2. `$lookup` and `$unwind` the teacher, same as the available list.
3. `$project` `startTime`, `endTime`, `status`, `completedAt`, `durationMinutes`, and the same teacher fields.
4. `$facet` splits the stream:
   - `upcoming`: status `BOOKED`, sorted by `startTime` ascending.
   - `completed`: status `COMPLETED`, sorted by `completedAt` descending.

The handler counts each array and returns `{ upcoming, completed, counts }`. A user with no sessions gets empty arrays and zero counts.

## Design decisions

**Atomic booking.** `POST /sessions/:id/book` updates with one `findOneAndUpdate` whose filter is `{ _id, status: 'AVAILABLE' }`. MongoDB applies that to at most one writer, so two requests in flight cannot both book the slot. If the update matches nothing, a follow-up read decides the response: no document is `404`, any other status is `409`. Completing a session is the same pattern, filtered on `BOOKED`, and `completedAt` is set in that same update.

**Response envelope.** Success is `{ success: true, data, message? }` from one helper. Failures are `{ success: false, error: { code, message, details? } }`. Services throw `ApiError`. A single error middleware also maps Zod failures, bad ObjectIds, and duplicate-key errors onto that shape, so every route answers the same way.

**UTC day by default.** `dateTimestamp` is an instant, not a calendar date. `tzOffsetMinutes` says how many minutes the client is ahead of UTC, and the default `0` means "use the UTC day of this instant." The filter uses `startTime`, so a session is listed on the day it starts.

## Assumptions

- "Upcoming" means status `BOOKED`. A booked session stays in `upcoming` until it is completed, including after its start time.
- Teacher email is unique.
- Past start times are allowed when a session is created.
- The overlap check is per teacher. Two teachers may hold sessions at the same time. A session that ends exactly when the next one starts is allowed.

## Seed data

`npm run seed` wipes users, teachers, and sessions, then inserts:

- 6 teachers, with different specializations and years of experience
- 4 users
- 30 one-hour sessions from today through the next six days, at 09:00, 11:00, 14:00, and 16:00 UTC, plus two at 18:00 UTC

Twenty-four sessions are `AVAILABLE`, four are `BOOKED`, and two are `COMPLETED`. Running the command again replaces the demo set.

## Postman

Import both files in `postman/`:

- `office-hours.postman_collection.json`
- `local.postman_environment.json`

In Postman: Import, select those two files, then choose the environment named `local` in the environment dropdown. `baseUrl` is `http://localhost:3000`. Change it there if the API is on another port.

Start the API with `npm run dev`. Open the Office Hours collection, choose Run, and run the whole collection with Collection Runner. Leave the request order as it is.

The create requests store `teacherId`, `userId`, and `sessionId` for the requests that follow. Emails include a timestamp, so the run still works after `npm run seed`, and a second run does not collide with the first. The create-session request computes tomorrow 10:00-11:00 in your machine's local timezone in a pre-request script, and the available-sessions request uses that same instant.

Negative requests (duplicate email, invalid body, invalid id, unknown teacher, end before start, overlap, complete before booking, double booking, unknown user, unknown session, complete twice, bad timestamp) are written to expect a 4xx. They show up green when the API returns that error. A red row means the status or the body shape was different from what the test script expected.
