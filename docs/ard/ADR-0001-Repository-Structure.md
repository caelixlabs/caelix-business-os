# ADR-0001 – Repository Structure

| Field | Value |
|-------|-------|
| ADR | 0001 |
| Title | Repository Structure |
| Status | Approved |
| Version | v1.0 |
| Date | 2026-07-15 |
| Owner | Caelix Labs |

---

# Context

Caelix is intended to become a long-term SaaS platform supporting multiple industries, customer experiences and integrations.

The repository must support:

- Independent deployments
- Shared packages
- Modular architecture
- Excellent developer experience
- Long-term maintainability

---

# Decision

Caelix will use a **Turborepo Monorepo**.

```
caelix-platform/

apps/

packages/

services/

infra/

docs/
```

---

# Repository Layout

```
caelix-platform/

apps/
    admin/
    api/
    starter-website/
    docs/

packages/
    auth/
    config/
    contracts/
    database/
    design-system/
    eslint-config/
    sdk/
    testing/
    tsconfig/
    types/
    ui/

services/
    worker/

infra/
    docker/

docs/
```

---

# API Structure

```
apps/api/src/

bootstrap/

kernel/

common/

config/

core/

business/

capabilities/

industry-packs/

integrations/

events/

libs/

main.ts
```

---

# Layer Responsibilities

## Core

Platform services.

Examples

- Authentication
- Organizations
- Users
- Roles
- Permissions
- Billing
- Notifications

---

## Business

Reusable business services.

Examples

- Inventory
- Booking
- Contacts
- CRM
- Payments
- Products

---

## Capabilities

Optional business capabilities.

Examples

- Attendance
- Marketing
- Automation
- Loyalty
- LMS
- AI
- POS

---

## Industry Packs

Industry-specific business behavior.

Examples

- Gym
- Music Academy
- Restaurant
- Salon
- Clinic

---

## Integrations

External service providers.

Examples

- Stripe
- Spotify
- WhatsApp
- Google
- Zoom

---

# Shared Packages

Packages must not contain business logic.

Packages contain reusable libraries only.

Examples

- UI
- SDK
- Types
- Database
- Config

---

# Engineering Principles

- API First
- Domain Driven Design
- Clean Architecture
- Modular Monolith
- Event Driven
- Vertical Slice Architecture
- Shared Nothing Between Organizations

---

# Folder Naming Convention

Folders use plural names where appropriate.

Examples

```
organizations

users

roles

permissions

contacts

bookings

products

payments
```

Industry Packs use kebab-case.

```
music-academy

sports-club
```

---

# Future Changes

Any repository restructuring requires a new ADR.

Repository layout is considered frozen after approval.

Major structural changes require:

- Motivation
- Alternatives
- Migration Plan
- Approval

---

# Consequences

Positive

- Predictable repository layout
- Clear separation of concerns
- Independent deployments
- Shared packages
- Scalable architecture

Negative

- Higher initial structure complexity
- Requires architectural discipline

The long-term benefits outweigh the initial complexity.
