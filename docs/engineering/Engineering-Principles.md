# Engineering Principles

| Field | Value |
|-------|-------|
| Document | ENG-0001 |
| Title | Engineering Principles |
| Version | v1.0 |
| Status | Approved |
| Owner | Caelix Labs |
| Last Updated | 2026-07-15 |

---

# Purpose

This document defines the engineering principles, architectural standards, coding conventions, and development practices that govern the Caelix Platform.

These principles are intended to ensure long-term maintainability, scalability, consistency, and developer productivity.

Every contributor is expected to follow these principles.

---

# Core Engineering Philosophy

We optimize for:

- Readability
- Maintainability
- Scalability
- Testability
- Developer Experience
- Security
- Performance

We **do not** optimize for writing the least amount of code.

We optimize for writing code that will still be understandable five years from now.

---

# Engineering Values

## Simplicity

Prefer simple solutions over clever solutions.

If a junior engineer cannot understand a piece of code within a reasonable amount of time, it should be reconsidered.

---

## Consistency

Consistency is more valuable than personal preference.

Follow existing conventions before introducing new ones.

---

## Explicitness

Avoid hidden behavior.

Code should clearly communicate its intent.

---

## Separation of Concerns

Each layer has a single responsibility.

Business logic must not depend on UI frameworks.

Infrastructure must not leak into business logic.

---

# Architectural Principles

Caelix follows:

- Domain Driven Design (DDD)
- Clean Architecture
- Modular Monolith
- Event Driven Architecture
- API First
- Headless First
- Multi-Tenant First

---

# Repository Rules

## Applications

Applications contain executable software.

Examples

- Admin
- API
- Starter Website
- Documentation

Applications should never contain reusable business libraries.

---

## Packages

Packages contain reusable code only.

Examples

- UI Components
- SDK
- Types
- Config
- Database Client

Packages must not contain business rules.

---

## Services

Background workers and long-running processes.

Examples

- Queue Workers
- Schedulers
- Webhook Processors

---

# Module Design

Each module owns its own domain.

Modules should not directly manipulate another module's internal state.

Communication between modules should happen through:

- Public interfaces
- Domain Events
- Application Services

Never through internal implementation details.

---

# Dependency Rule

Dependencies always point inward.

```text
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

The Domain layer must never depend on:

- NestJS
- React
- Prisma
- PostgreSQL
- Redis
- HTTP

The Domain layer should contain pure business logic.

---

# Business Logic

Business rules belong inside the Application and Domain layers.

Never place business logic inside:

- Controllers
- React Components
- Middleware
- API Routes

Controllers should orchestrate requests only.

---

# API Design

All APIs follow REST principles.

Standards:

- Versioned
- Stateless
- Predictable
- Consistent

Every endpoint should return consistent response structures.

---

# Authentication

Authentication identifies users.

Authorization determines permissions.

Never combine these responsibilities.

---

# Multi-Tenancy

Every request must resolve:

- Organization
- Branch
- Workspace
- User

No database query should execute without organization context.

Cross-organization access is never allowed unless explicitly designed.

---

# Database Principles

Use PostgreSQL.

Use Prisma ORM.

Every business table includes:

- id
- organizationId
- branchId (where applicable)
- createdAt
- updatedAt
- deletedAt (soft delete)
- createdBy
- updatedBy

Soft deletes are preferred over permanent deletion.

---

# Naming Conventions

## Files

Use kebab-case.

Examples

```text
create-booking.use-case.ts

inventory.controller.ts

payment.repository.ts
```

---

## Classes

Use PascalCase.

Examples

```typescript
CreateBookingUseCase

InventoryRepository

PaymentService
```

---

## Variables

Use camelCase.

Examples

```typescript
organizationId

branchId

bookingDate
```

---

## Constants

Use UPPER_SNAKE_CASE.

```typescript
MAX_UPLOAD_SIZE

DEFAULT_PAGE_SIZE
```

---

## Enums

Use PascalCase.

```typescript
MembershipStatus

BookingStatus
```

---

# Folder Naming

Folders use lowercase.

Multiple words use kebab-case.

Examples

```text
music-Org

starter-website

feature-flags
```

---

# Error Handling

Errors should be:

- Predictable
- Typed
- Logged
- User-friendly

Never expose stack traces to clients.

---

# Logging

Every request includes:

- requestId
- organizationId
- branchId
- workspaceId
- userId

Logs should be structured.

Avoid console.log in production code.

---

# Security

Never trust client input.

Always validate:

- DTOs
- Payloads
- Query Parameters
- Headers

Use Zod or class-validator where appropriate.

---

# Testing Strategy

Every feature should include:

- Unit Tests
- Integration Tests

Critical business logic requires automated tests.

Avoid testing framework internals.

Test behavior instead.

---

# Code Review Checklist

Every Pull Request should satisfy:

- Builds successfully
- Passes TypeScript
- Passes ESLint
- Passes Tests
- No duplicated code
- No dead code
- No hardcoded secrets
- Documentation updated (if applicable)

---

# Git Strategy

Main branches:

```text
main

develop
```

Feature branches:

```text
feature/authentication

feature/organizations

feature/inventory

feature/gym-memberships
```

Bug fixes:

```text
fix/payment-timeout
```

Hotfixes:

```text
hotfix/login-issue
```

---

# Commit Convention

Use Conventional Commits.

Examples

```text
feat(auth): add JWT authentication

fix(inventory): prevent negative stock

refactor(booking): simplify booking workflow

docs(api): update authentication guide

test(payments): add refund service tests
```

---

# Pull Request Principles

Keep PRs:

- Small
- Focused
- Reviewable

One PR should solve one problem.

Avoid mixing refactoring and new features.

---

# Documentation

Every major architectural decision requires an ADR.

Every major feature requires a PRD.

Documentation is part of the product.

---

# Performance

Optimize only after measuring.

Avoid premature optimization.

Prefer readability until performance becomes measurable.

---

# Future-Proofing

Before introducing:

- new package
- new service
- new abstraction
- new architectural pattern

Ask:

1. Does an existing solution already exist?
2. Will this reduce complexity?
3. Will this still make sense in three years?

If not, do not introduce it.

---

# Final Principle

> Build software that future engineers will enjoy working on.

Maintainability is a feature.

Readable code is scalable code.

Consistency beats cleverness.

Architecture is a long-term investment.

Every line of code should move Caelix toward becoming a world-class business platform.