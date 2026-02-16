# Backend plan: API, auth, and score history

## Monorepo vs separate repo

**Recommendation: monorepo.**

- One repo, one clone; frontend and backend stay in sync.
- Shared types (e.g. `WordLength`, score payload) can live in a small `packages/shared` or be duplicated in `apps/api` (minimal surface).
- Single CI/deploy story; you can add Turborepo or Nx later if the repo grows.

**Structure:**

```
woodle/
  apps/
    web/          # current Vite app (move existing src, public, index.html, vite.config here)
    api/          # Node backend
  packages/
    shared/       # optional: shared TypeScript types and constants
  package.json    # workspace root
```

If you prefer to avoid moving files immediately, a lighter approach is to keep the current app at repo root and add only `apps/api` (and optionally `packages/shared`), with the root `package.json` defining workspaces that include `apps/api`. The frontend stays where it is; the backend is the new sibling.

---

## Framework choice

**Recommendation: Express (Node).**

- Simple, well-known, easy to deploy anywhere (Railway, Render, Fly.io, VPS).
- Huge middleware ecosystem (auth, validation, rate-limit).
- Fits the scope: a few REST endpoints, JWT auth, one DB.

**Alternatives:**

- **Fastify**: Better performance and built-in schema validation; slightly steeper if the team is new to it.
- **Hono**: Very small and works in Node and edge; good if you might go serverless/edge later.
- **NestJS**: More structure and DI; overkill unless you want strict architecture and many modules.

Sticking with **Express** keeps the plan straightforward and deploy-friendly.

---

## Backend scope

### 1. Game start (solution obfuscation)

- **POST /api/game/start**
- Body: `{ wordLength: 5 | 6 | 7 }`
- Response: `{ solutionEncoded: "v2:..." }`
- Logic (server-side only, not visible in client DevTools):
  - Fetch batch from `https://random-word-api.herokuapp.com/word?length={wordLength}&number=5`
  - For each candidate: skip if `word.endsWith('s')`; else GET `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`; first 200 → solution
  - If no valid in batch, fetch next batch (e.g. up to 20 batches), then optional fallback word list
  - Encrypt solution with same key/algorithm as client (CryptoJS AES, `WOODLE_OBFUSCATION_KEY` env)
- **Auth**: Optional. Can be called without auth; protect with rate limiting (e.g. by IP or by optional JWT) to avoid abuse.
- **CORS**: Allow frontend origin(s); in dev, Vite proxy makes this same-origin.

### 2. Auth: sign-in + guest mode

- **POST /api/auth/register**  
  - Body: `{ email, password }`  
  - Validate email format and password strength; hash password (e.g. bcrypt); insert user; return JWT (and optionally user id/email).

- **POST /api/auth/login**  
  - Body: `{ email, password }`  
  - Verify credentials; return JWT (and optional user payload).

- **POST /api/auth/guest** (or **GET** for simplicity)  
  - No body.  
  - Create a short-lived or long-lived “guest” identity: e.g. issue a JWT with `{ sub: guestId, guest: true }` (no email).  
  - Client can use this for a consistent “session” (e.g. store in localStorage).  
  - **Guest mode** = no account; no persisted score history (or store under `guestId` with TTL and no cross-device sync—your product choice). Recommendation: **do not** persist guest scores in DB; only authenticated users get history.

- **GET /api/auth/me** (optional)  
  - Require JWT. Return current user (id, email, guest flag) so the client can show “signed in as …” or “playing as guest”.

- **JWT**: Sign with a secret (env `JWT_SECRET`). Include `sub` (user id or guest id), `guest: true` for guests, `email` for registered users if desired. Use short expiry for guests if you want to force re-guest periodically; longer for logged-in users.

### 3. Score history

- **POST /api/scores**  
  - Body: `{ wordLength: 5|6|7, won: boolean, guessesCount: number }`  
  - `guessesCount`: 1..(wordLength+1) on win; on loss you can send `wordLength+1` (max guesses used).  
  - Requires **authenticated** JWT (non-guest).  
  - Validate body; insert row into `scores` table (e.g. `user_id`, `word_length`, `won`, `guesses_count`, `played_at`).  
  - Return 201 and optionally the created record (id, played_at).

- **GET /api/scores** (or **GET /api/me/scores**)  
  - Requires **authenticated** JWT (non-guest).  
  - Return list of the user’s scores (e.g. newest first), optionally paginated (e.g. `?limit=20&offset=0`).  
  - Response shape: e.g. `{ scores: [ { id, wordLength, won, guessesCount, playedAt } ] }`.

- **Guest users**: Do not call POST/GET scores for guests; or have the backend reject guest JWTs for these routes. Client shows “Sign in to save your history” when in guest mode.

---

## Data model (minimal)

- **users**  
  - `id` (PK), `email` (unique), `password_hash`, `created_at`

- **scores**  
  - `id` (PK), `user_id` (FK → users), `word_length` (5|6|7), `won` (boolean), `guesses_count` (int), `played_at` (timestamp)

- **Guests**: No row in `users`; guest JWT `sub` can be a UUID generated at “guest login” time, stored only in the token. No DB persistence for guest identity unless you want ephemeral “guest score” tables (not recommended for “history” in the usual sense).

---

## Database

- **Dev / simple deploy**: **SQLite** (e.g. `better-sqlite3` or `sql.js`). Single file; no separate DB server.
- **Production (scaling)**: **PostgreSQL** (or managed Postgres). Swap the DB layer behind a small repository interface so only one implementation is used at a time.

Start with SQLite; add a thin **repository** layer (e.g. `getUserByEmail`, `createUser`, `insertScore`, `getScoresByUserId`) so switching to Postgres later is a single adapter change.

---

## Project layout (apps/api)

```
apps/api/
  package.json
  tsconfig.json
  src/
    index.ts              # Express app, listen
    config.ts              # env (PORT, JWT_SECRET, WOODLE_OBFUSCATION_KEY, DB path)
    routes/
      game.ts              # POST /api/game/start
      auth.ts              # register, login, guest, optional me
      scores.ts            # POST /api/scores, GET /api/scores
    middleware/
      auth.ts              # JWT verification; attach user/guest to req
      validate.ts          # body validation (e.g. wordLength, score payload)
      rateLimit.ts         # rate limit game/start (and maybe auth)
    services/
      solutionService.ts   # fetch batch, validate with dictionary, encrypt
      authService.ts      # hash, verify, issue JWT
    db/
      schema.sql           # or migrations
      repository.ts       # SQLite (or Postgres) queries
    crypto/
      encodeSolution.ts   # same encode() as client (CryptoJS + KEY)
```

Use **environment variables**: `PORT`, `JWT_SECRET`, `WOODLE_OBFUSCATION_KEY` (same as client key), `DATABASE_PATH` (SQLite file) or `DATABASE_URL` (Postgres), `NODE_ENV`, and optionally `FRONTEND_ORIGIN` for CORS.

---

## Client integration (high level)

- **Game start**: Prefer `POST /api/game/start`; on failure, fall back to current client-side `fetchRandomWord()` so the game still works offline.
- **Auth**: After register/login/guest, store JWT (e.g. in memory + localStorage or cookie); send `Authorization: Bearer <token>` on requests that require auth.
- **Scores**: On game over (win or loss), if user is authenticated (non-guest), call `POST /api/scores` with `{ wordLength, won, guessesCount }`. “History” page or section calls `GET /api/scores` when the user is logged in.

---

## Summary

| Topic            | Choice / behavior |
|------------------|--------------------|
| Repo             | Monorepo (e.g. `apps/web`, `apps/api`; current app can stay at root initially). |
| Framework        | Express (Node). |
| DB               | SQLite first; repository layer to allow Postgres later. |
| Auth             | JWT; register, login, guest (guest = JWT with no DB user; no score history). |
| Score history    | POST (record) and GET (list) for authenticated users only. |
| Game start       | POST /api/game/start returns encrypted solution; rate-limited; no auth required. |

This gives you one endpoint for solution obfuscation, sign-in + guest mode, and persisted score history for registered users, with a clear path to scale the DB and add more features later.
