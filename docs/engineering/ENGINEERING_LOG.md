# Caelix Business OS — Engineering Log

Living record of architecture decisions, conventions, and current state.
Read this before making structural changes — it's the source of truth,
not any particular chat history.

## Repo structure (frozen, do not deviate without updating this doc)

```
apps/
  api/            NestJS. DDD + Clean Architecture. See "API conventions" below.
  admin/          Next.js 16 App Router. See "Admin conventions" below.
  starter-website/  Not yet built.
packages/
  database/       Prisma schema + generated client + seed script. Single source of DB truth.
  tsconfig/, auth/, config/, contracts/, design-system/, eslint-config/,
  sdk/, testing/, types/, ui/   Currently empty placeholders. Not wired into
                                the workspace as real packages yet.
```

## API conventions (`apps/api/src`)

Every business module under `src/core/<name>/` follows:
```
<name>/
  domain/
    entities/       AggregateRoot subclasses. Private fields + getters +
                     behavior methods (never public mutable props).
    events/         DomainEvent subclasses.
    enums/
    repositories/   Interface + `token.ts` (Symbol) + barrel index.ts
    exceptions/
  application/
    <use-case>/     One folder per command/query: .dto.ts, .command.ts
                     (or .query.ts), .handler.ts
    event-handlers/ @EventHandler(SomeEvent)-decorated classes reacting
                     to events from ANY module (cross-module coupling
                     happens here, not via direct service injection)
  infrastructure/
    <name>.mapper.ts         toDomain / toPersistence, only place
                              Prisma models and domain entities meet
    prisma/<name>.prisma.repository.ts
  presentation/
    controllers/<name>.controller.ts
  <name>.module.ts
```

Existing modules: `organization`, `branch`, `users`, `rbac`, `auth`, `audit`,
`settings`, `notification`.
Placeholder-only (README explaining intent, no code yet): `business/`,
`capabilities/`, `industry/`, `integrations/` — see each README.

### Outbox pattern (critical — never bypass)
`PrismaRepository` base class (`common/prisma/prisma.repository.ts`)
provides `runInTransaction(aggregate, aggregateType, work)`. It writes the
aggregate's own row(s) AND a `DomainEvent` outbox row for every event the
aggregate recorded, in ONE Prisma `$transaction`, then publishes to the
EventBus only after that transaction commits. Every aggregate repository
must go through this — never write outbox rows by hand, never publish
before commit.

### RBAC
- Fixed hierarchy: OWNER > ADMIN > MANAGER > EMPLOYEE > VIEWER (`RoleLevel`).
- Permission codes live in `core/rbac/domain/enums/permission-code.enum.ts`
  (`PermissionCode`) with a `ROLE_PERMISSION_MATRIX` mapping each role to
  its granted codes.
- **The global `Permission` table must be seeded** (`pnpm db:seed`) before
  any organization is created, or `SeedOrganizationRolesHandler` creates
  roles with zero permissions (this happened once already — see git
  history — now it logs a loud warning if the catalogue is empty).
- `packages/database/prisma/seed.ts` duplicates the PermissionCode list
  as plain data (database package can't import from apps/api). If you
  add a PermissionCode, add the matching row there in the same change.
- First user registered in an org → OWNER. Every user after → EMPLOYEE.
  Admin/Owner can reassign via `PATCH /users/:id/role`.

### Auth
- JWT access token (embeds `organizationId`, `branchId`, `roles`,
  `permissions` — authorization never needs a DB round trip after login).
- Refresh tokens are opaque random strings; only their SHA-256 hash is
  persisted. Rotated on every use (single-use).
- `JwtAuthGuard` is global (`APP_GUARD`) — every route requires a token
  unless marked `@Public()`.
- `PermissionsGuard` is also global — routes need `@RequirePermissions(...)`
  to be checked; routes without it are permission-open (still auth-gated).
- Login is by **organization slug** (human-memorable, e.g. `acme-gym`),
  not raw organization UUID.

### Tenant isolation (fixed a real bug class here — stay vigilant)
`PermissionsGuard` only checks *what* a caller can do, never *whose* data
they're doing it to. Every controller route that takes an `:organizationId`
or otherwise touches another aggregate's data MUST call
`assertSameOrganization(currentUser.organizationId, routeOrganizationId)`
(`core/auth/application/guards/assert-same-organization.ts`), or for
id-only routes (`/branches/:id`), the handler must verify
`entity.organizationId === callerOrganizationId` itself and throw
`EntityNotFoundException` (not `ForbiddenException` — don't reveal
existence) on mismatch. This was missing across Organization/Branch/Audit
controllers until it was found and fixed — check any new controller
against this before considering it done.

There is deliberately **no "list all organizations" endpoint** — with no
platform-superadmin role yet, that would leak every tenant's existence to
any authenticated user.

## Admin conventions (`apps/admin/src`)

Stack: Next.js 16 App Router + route groups (`(auth)`, `(dashboard)`),
`features/` colocation pattern, TanStack Query (server state), Zustand
(client/session state), React Hook Form + Zod (forms), Axios (HTTP,
interceptor-based auto-refresh-on-401), Sonner (toasts), Lucide (icons),
Radix UI primitives + Tailwind (NOT MUI — deliberate choice, see below).

```
features/<name>/
  api/          <name>.api.ts (raw axios calls) + use-<name>.ts (TanStack
                Query hooks: useQuery for reads, useMutation for writes,
                onSuccess invalidates the relevant query key or calls
                queryClient.setQueryData)
  schemas/      Zod schemas + inferred FormValues types, used with
                react-hook-form's zodResolver
  components/   Feature-specific UI (dialogs, forms) — shared/generic UI
                stays in src/components/ui
  types.ts
```

Existing features: `auth`, `organizations`, `branches`, `users`, `rbac`,
`audit`.

### Why Radix + Tailwind, not MUI
A prior instruction suggested MUI. Pushed back and the user accepted:
we'd just extracted the real brand palette (mint `#0EAFA0` / slate-navy
`#011423`) from the actual logo, and MUI's Material Design fingerprint
(elevation, ripple, spacing rhythm) is hard to fully suppress even when
themed. Radix gives accessible unstyled primitives (Dialog, Select,
DropdownMenu, Tabs, Tooltip) that inherit our own design tokens instead.
Reserve MUI's DataGrid only if a screen genuinely needs heavy
spreadsheet-like features later.

### Session / token storage
Access token: in-memory only (Zustand store, never persisted).
Refresh token: `localStorage` (a BFF + httpOnly cookie would be strictly
better but requires backend work not yet in scope — documented tradeoff,
not an oversight).
A separate **non-secret** cookie (`caelix_session`, boolean flag only) is
set alongside the real session purely so `middleware.ts` can redirect
before first paint — it carries no token and is not the security boundary.

### Design tokens (`app/globals.css`)
Extracted directly from the brand logo image via pixel sampling — not
invented. `--accent: #0eafa0` (mint), `--ink: #011423` (slate navy). Status
badges/rails: `ACTIVE` and `PRIMARY` both map to `accent` tone (unified
deliberately — they're both "positive" states and using two different
greens read as inconsistent).

### Settings
Plain key-value store per organization (`core/settings`), typed via a
closed `SettingKey` enum (`timezone`, `currency`, `dateFormat`,
`weekStart`) rather than free-form keys — every industry vertical the
PRD targets needs this same handful of cross-cutting preferences.
Missing keys fall back to `SETTING_DEFAULTS` at the application layer,
so callers always get a complete map.

### Notifications
In-app only (no email/push yet). `core/notification` reacts to existing
domain events — `UserRegisteredEvent` and `BranchCreatedEvent` both
notify the organization's OWNER/ADMIN users (queried directly via
Prisma, matching the same cross-cutting-read pattern as
`SeedOrganizationRolesHandler` — not worth a repository method for a
one-off read). Role changes aren't a domain event (Role/UserRole aren't
aggregates), so `AssignRoleHandler` calls `NotificationRepository`
directly instead of going through the EventBus — that's a deliberate,
documented exception to "prefer events," not an oversight. Admin UI
polls `GET /notifications` every 30s (`useNotifications` in
`features/notifications`) rather than a websocket, matching that this
is a low-frequency, non-realtime-critical scope.

### Deferred, not forgotten
- `next-intl` (i18n) — no translated content exists yet; add when there is.
- Full MUI DataGrid — only if a table screen outgrows plain `<table>`.
- Email-based invite flow — `InviteUserHandler` currently takes an
  admin-set temporary password with no email delivery; swapping in a real
  invite-token+email flow only touches that one handler.
- Real-time notifications (websocket/SSE) — currently 30s poll.
- `core/workflow`, `core/storage`, `core/billing`, `core/analytics` — need
  real integration decisions (S3/Stripe/etc.) before building, unlike
  settings/notification which needed none.
- `business/`, `capabilities/`, `industry/`, `integrations/` — see each
  README; still just placeholders.

## Known sandbox limitation (not a code issue)

Prisma's schema-engine binary can't be fetched in the assistant's sandbox
(network-restricted). Real code changes to `schema.prisma` are made and
manually cross-checked against field names, but `apps/api` typechecks in
that sandbox will always show `Property 'x' does not exist on type
PrismaClient` for any model added there until `pnpm --filter
@caelix-business-os/database prisma:generate` is run in an environment
with normal network access (i.e., yours). That class of error is expected
noise, not a real bug — everything else in a clean typecheck is real.

### Event system — a real bug, now fixed and regression-tested
`EventDiscoveryService.getProviders()` walks the module *import graph*,
not a deduplicated set of provider singletons. Any handler living in a
module reached via more than one import path (e.g. `RbacModule` — 
imported by `UsersModule`, `AuthModule`, *and* `AppModule` directly) got
registered — and therefore invoked — once per path. This is what caused
the first user to sometimes get `EMPLOYEE` instead of `OWNER`: two
concurrent invocations of `AssignDefaultRoleHandler` raced each other,
and depending on timing either crashed on a unique-constraint violation
or produced the wrong role. Fixed at two layers:
- `EventRegistry.register()` now dedupes by handler instance (the
  definitive fix — makes the whole event system correct regardless of
  how discovery works).
- `EventDiscoveryService` also dedupes during its scan (belt and
  suspenders, and keeps startup logs honest — a handler is logged as
  "registered" exactly once).
- `AssignDefaultRoleHandler` also switched from "count users in this
  org" to "does this org already have an OWNER" (`RbacRepository.hasOwner`)
  — the more direct, semantically correct question, and self-healing if
  a first assignment ever failed.
- `RbacPrismaRepository.assignSystemRole` now upserts instead of
  inserting, so it's safe to call twice for the same (user, role) pair
  regardless.
- Regression tests: `test/common/ddd/event-registry.spec.ts` (dedup
  behavior), `test/core/rbac/assign-default-role.handler.spec.ts`
  (hasOwner-based logic).

## Running seed data
```bash
pnpm db:seed   # populates the global Permission catalogue — required
               # before creating any organization, or roles get zero
               # permissions
```
