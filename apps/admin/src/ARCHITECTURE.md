# Caelix Admin UI Architecture

## Principle

The admin app is composed, not accumulated. Next.js route files are entry points only. They do not own API calls, industry switches, role logic, section layout, or business-specific UI.

```text
Next.js route
  -> layout
  -> application view
  -> context / resolver
  -> industry or shared section
  -> feature component
  -> feature hook
  -> API client
```

## Source boundaries

- `app/` — Next.js App Router route entry points and route-group layouts. Keep pages thin.
- `layouts/` — reusable application chrome for auth and dashboard experiences.
- `core/` — platform composition: auth, organization context, RBAC, industry registry/resolution, navigation resolution, dashboard composition.
- `contexts/` — cross-cutting runtime context providers. Organization and theme are established once at dashboard-shell scope.
- `store/` — client-side application state. Auth state remains separate from UI preferences/state.
- `industries/` — industry-specific user experiences only. Industry code may consume shared features; core/shared code must not depend on industry internals.
- `sections/` — cross-industry admin views. If a view is materially different for Music and Gym, it belongs inside the corresponding industry folder instead.
- `features/` — reusable application/domain capabilities and API contracts. A feature must not assume one industry.
- `components/ui/` — primitive visual atoms.
- `components/data/` — reusable data-display primitives such as `DataTable`, `StatCard`, `ChartPanel`, `ActivityFeed`, and `CalendarGrid`.
- `components/forms/` — reusable form patterns.
- `components/layout/` — visual shell pieces. These render resolved state; they do not decide business rules.
- `theme/` — shared tokens and industry-specific token sets.
- `configs/` — runtime/configuration switches such as module availability and layout constants.
- `routes/` — centralized route paths.
- `api/` — HTTP transport, API envelopes, errors, and interceptors.
- `lib/` and `utils/` — generic technical helpers.

## Industry registry

`core/industry/industry.registry.ts` is the registration point for each supported industry. It owns:

- display metadata;
- theme metadata;
- navigation groups;
- lazy dashboard loader.

`IndustryDashboardResolver` consumes the registry instead of maintaining a parallel switch map or eager imports.

Adding an industry should require a registry entry plus the industry's implementation package. Do not add industry-specific `if/else` chains to the sidebar, topbar, organization context, or theme provider.

## Navigation

Navigation is grouped and resolved from:

```text
industry
+ permissions
+ module flags
    -> NavigationGroup[]
    -> Sidebar
```

The sidebar is a renderer. It does not know what a Music organization or Gym is.

## Theme

The dashboard sets `data-industry` and `data-theme` on the document root. Shared components use semantic CSS variables such as `--accent`, `--canvas`, `--surface`, `--success`, and `--danger`.

Industry themes may override the complete semantic token set while preserving the shared Caelix component vocabulary.

## UI state

`store/ui.store.ts` owns shell preferences:

- sidebar collapsed state;
- dark mode;
- command palette state.

These are not mixed with authentication state.

## Shared vs industry-specific rule

```text
sections/contacts        -> generic contact administration
industries/music-org/... -> Music-specific student experience
industries/gym/...       -> Gym-specific member experience
features/contacts        -> shared data/API contract
```

Shared features expose capability/data contracts. Industry views compose those contracts into a vertical-specific experience.

## Route rule

A route should be understandable in one screen:

```tsx
import { DashboardView } from '@/core/dashboard/views/dashboard-view';

export default function DashboardPage() {
  return <DashboardView />;
}
```

If a route starts accumulating API calls or multiple feature sections, move the orchestration into a view/section.
