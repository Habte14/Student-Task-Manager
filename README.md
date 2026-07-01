# Task Manager

A task manager with a React + Vite frontend and a **Hono + oRPC** backend,
giving you end-to-end type safety: the React app imports the server's
router type directly, so the input/output shape of every API call is
checked at compile time — change a field on the server and the frontend
will fail to compile if it's not updated to match.

Each user has their own account (email + password) and their own private
task list. Accounts and tasks are stored in **PostgreSQL** via **Drizzle
ORM**; login sessions use an `httpOnly` cookie.

## Project structure

```
task with login/
├── src/                     # React frontend
│   ├── api.ts                # typed oRPC client (sends cookies)
│   ├── Login.tsx              # login / signup screen
│   ├── App.tsx                 # checks session on load, shows Login or the task list
│   └── ...
├── server/
│   ├── .env                  # your real DB connection string (not committed)
│   ├── .env.example           # template showing what .env needs
│   ├── drizzle.config.ts      # tells drizzle-kit where the schema & migrations live
│   ├── drizzle/                # generated SQL migration files (committed)
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts        # users & tasks tables (Drizzle schema)
│   │   │   └── index.ts          # Postgres connection (node-postgres + Drizzle)
│   │   ├── schemas.ts            # Zod schemas (request/response validation)
│   │   ├── store.ts               # tasks queries (list/create/toggle/remove/stats)
│   │   ├── auth-store.ts           # user queries + password hashing (scrypt)
│   │   ├── session-store.ts         # in-memory session tokens (cookie-based)
│   │   ├── context.ts                # AuthContext type shared by every procedure
│   │   ├── auth-router.ts             # auth.signup / auth.login / auth.logout / auth.me
│   │   ├── router.ts                   # tasks.* (all require login, scoped per user)
│   │   └── index.ts                     # Hono app: cookies, CORS, mounts oRPC at /rpc
├── vite.config.ts            # dev proxy: /rpc -> http://localhost:3001
└── package.json
```

## One-time database setup

You need PostgreSQL installed and running (not just pgAdmin — the actual
server). Then, in `psql` (e.g. `psql -U postgres`):

```sql
CREATE DATABASE task_manager;
CREATE USER task_manager_app WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE task_manager TO task_manager_app;

-- Postgres 15+ does NOT automatically let a non-owner role create
-- objects in the public schema, even after the grant above -- this
-- step is required or migrations will hang/fail silently:
\c task_manager
GRANT ALL ON SCHEMA public TO task_manager_app;
```

Then configure the connection. Copy the example file:

```bash
cp server/.env.example server/.env
```

and edit `server/.env` so `DATABASE_URL` matches your database, username,
and password. **If your password contains special characters** (`@ : / ?
# %` etc.), URL-encode them -- e.g. a password of `Tinishu123@` becomes
`Tinishu123%40` in the connection string. (`@` -> `%40` is the most common
case, since `@` is also the separator before the host in the URL.)

Finally, create the tables:

```bash
cd server
npx drizzle-kit migrate
```

This applies `server/drizzle/0000_*.sql` to your database, creating the
`users` and `tasks` tables.

> **If `drizzle-kit migrate` seems to hang or do nothing:** apply the
> migration directly instead -- it's a plain SQL file:
> ```bash
> psql -U postgres -d task_manager -f drizzle/0000_*.sql
> ```
> Then re-run the `GRANT ALL ON SCHEMA public` step above followed by:
> ```sql
> GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO task_manager_app;
> GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO task_manager_app;
> ```
> (Tables created while connected as `postgres` are owned by `postgres`,
> so the app's dedicated user needs an explicit grant on them too.)

## Setup

Install dependencies for both the frontend and the server:

```bash
npm install
npm install --prefix server
```

## Running it

The easiest way -- runs the Vite dev server and the API together:

```bash
npm run dev:all
```

This starts:
- the **frontend** on `http://localhost:5173` (Vite dev server, proxies `/rpc` to the API)
- the **API** on `http://localhost:3001` (Hono + oRPC, connected to Postgres)

Open `http://localhost:5173` -- you'll see a login screen. Click "Sign up"
to create an account, then you'll land on your task list. Your account
and tasks now live in PostgreSQL, so they survive server restarts.

### Running them separately

```bash
# terminal 1
npm run server     # starts the Hono + oRPC API on port 3001

# terminal 2
npm run dev         # starts Vite on port 5173
```

> **Important:** the frontend needs the API running (and the API needs
> Postgres running) to do anything with tasks or accounts. `npm run
> dev:all` avoids ever running just one half of the stack.

## How accounts & sessions work

- **Users and tasks are stored in PostgreSQL**, queried through Drizzle
  ORM (`server/src/db/schema.ts`). They persist across server restarts.
- **Sessions are still in memory** (`session-store.ts`) -- logging out
  closes the session, and restarting the server logs everyone out (they
  just log back in; their account and tasks are untouched). This is a
  deliberate simplification; swap it for a `sessions` table if you want
  logins to survive a server restart too.
- Passwords are hashed with Node's built-in `scrypt` (never stored in
  plain text), and sessions use an `httpOnly` cookie so JavaScript in the
  browser can't read the session token.
- Every `tasks.*` call requires a valid session; every query is scoped
  to `WHERE user_id = <the logged-in user>`, so users only ever see
  their own tasks -- enforced at the database query level, not just in
  the UI.

## Changing the schema later

1. Edit `server/src/db/schema.ts`.
2. Run `npm run db:generate --prefix server` (or `cd server && npx
   drizzle-kit generate`) to create a new migration file.
3. Apply it with `npm run db:migrate --prefix server`, or via `psql -f`
   if that hangs for you (see note above).

`npm run db:studio --prefix server` opens Drizzle Studio, a browser UI
for browsing/editing your data directly.

## API (oRPC procedures)

All requests go through `/rpc` and are validated with Zod on the server.

| Procedure          | Description                                  |
|---------------------|-----------------------------------------------|
| `auth.signup`       | Create an account (name, email, password)    |
| `auth.login`        | Log in with email + password                 |
| `auth.logout`       | Clear the current session                    |
| `auth.me`           | Get the current logged-in user, or `null`    |
| `tasks.list`        | List the current user's tasks                |
| `tasks.create`      | Create a task (`title` required)             |
| `tasks.toggle`      | Toggle a task's `completed` state by `id`    |
| `tasks.remove`      | Delete a task by `id`                        |
| `tasks.stats`       | Totals: total / completed / pending / high   |

Bad input (e.g. an empty title, a taken email, a wrong password) returns
a clear error (`400`/`401`/`409`) instead of failing silently.

## Notes

- CORS is locked to `http://localhost:5173` (set via the `CLIENT_ORIGIN`
  env var in `server/.env`) with `credentials: true`, since cookies
  require a specific origin rather than a wildcard. Update
  `CLIENT_ORIGIN` if you deploy the frontend somewhere else.
- `server/.env` contains your real database password and is excluded via
  `.gitignore` -- never commit it. Share `.env.example` instead.
