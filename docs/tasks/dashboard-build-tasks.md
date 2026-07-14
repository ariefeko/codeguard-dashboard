# CodeGuard Dashboard Build Tasks

## Purpose

This document is the source of truth for the CodeGuard Dashboard implementation sequence. Tasks are intentionally small, independent, and verifiable so the product can be built incrementally.

## Status Legend

```text
[ ] Not started
[~] In progress
[x] Completed
```

## Current Progress

```text
[x] F01 — Scalable Application Skeleton
[x] I01 — Frontend Containerization
[ ] F02 — UI Foundation
[ ] B01 — API Foundation
```

---

## Track F — Frontend

### [x] F01 — Scalable Application Skeleton

Scope:

- Set up React, Vite, and TypeScript
- Establish a feature-based directory structure
- Configure TanStack Router and Query providers
- Build the application shell and responsive sidebar
- Add centralized, role-aware nested navigation configuration
- Add route-level placeholder pages and route-aware tabs

Definition of done:

- The application runs locally
- Every primary route is accessible
- Every submenu has a stable URL and synchronized sidebar/tab active state
- Administrator navigation can be filtered by role
- TypeScript checks and the production build pass

### [ ] F02 — UI Foundation

Scope:

- Set up Tailwind CSS and shadcn/ui
- Define design tokens, dark mode, typography, and spacing
- Add shared empty, loading, error, badge, table, and page-header components

Definition of done:

- Foundation components are documented
- Foundation components are used on one example page
- The layout is responsive on desktop and mobile

Depends on: `F01`

### [ ] F03 — Project Context

Scope:

- Add the project selector
- Build the project list and project detail views
- Add repository and integration tabs
- Persist the selected project consistently in the URL or application context

Definition of done:

- A user can select a project
- A user can open its repositories and integrations
- Refreshing the page preserves the project context

Depends on: `F02`, `B02`

### [ ] F04 — Analyses

Scope:

- Add PR Reviews and Sentry Incidents tabs
- Add filtering, sorting, pagination, and URL search parameters
- Build the analysis detail page
- Add loading, empty, error, and retry states

Definition of done:

- Both analysis types can be followed from list to detail
- Filtered views can be shared through the URL
- API errors can be retried safely

Depends on: `F03`, `B03`

### [ ] F05 — Issues Workflow

Scope:

- Add Open, Resolved, and Ignored filters
- Build the issue detail drawer or page
- Add resolution actions and history
- Add optimistic updates with rollback

Definition of done:

- A user can triage an issue
- A user can resolve or ignore an issue
- A failed mutation restores the previous state

Depends on: `F04`, `B04`

### [ ] F06 — Overview

Scope:

- Add actionable summary cards
- Add severity and analysis trends
- Add recent analyses and issues requiring attention

Definition of done:

- Every card opens a relevant filtered view
- Loading, empty, and error states are available
- Metrics can be filtered by project and time period

Depends on: `F04`, `F05`

### [ ] F07 — System Health

Scope:

- Add role-gated navigation and routes
- Build Jobs, LLM Usage, and business observability event views
- Link events to related analyses, jobs, and traces

Definition of done:

- Administrators and operators can diagnose failures
- Raw telemetry is not exposed to regular users
- Route access is validated rather than merely hidden from the sidebar

Depends on: `B05`, `B06`

### [ ] F08 — Settings

Scope:

- Add GitHub, Sentry, AI & RAG, Telemetry, and Obsidian tabs
- Add form validation and secret-safe states
- Add connection tests and clear status feedback

Definition of done:

- Configuration can be saved and validated
- Secrets are never displayed after being stored
- Connection-test status is understandable to users

Depends on: `F02`, `B02`, `B05`

### [ ] F09 — Frontend Quality Gate

Scope:

- Add unit and component tests
- Add critical Playwright flows
- Add accessibility checks
- Review the production build and bundle

Definition of done:

- Linting and type checks pass
- Automated tests pass
- The production build passes
- Critical accessibility issues are resolved

Depends on: `F03`–`F08`

---

## Track B — Backend

### [ ] B01 — API Foundation

Scope:

- Set up NestJS and Fastify
- Configure PostgreSQL and define a migration strategy
- Add base modules, a health endpoint, and an authentication placeholder
- Generate the OpenAPI contract

Definition of done:

- The API and database run in the development environment
- The health endpoint checks primary dependencies
- The OpenAPI contract can be generated automatically

### [ ] B02 — Project and Repository API

Scope:

- Enforce organization and project boundaries
- Add project CRUD operations
- Add repository and integration endpoints

Definition of done:

- Projects and repositories can be managed through the API
- Every query is constrained by organization context
- Basic authorization has automated test coverage

Depends on: `B01`

### [ ] B03 — Analysis API

Scope:

- Add unified analysis endpoints
- Add GitHub Pull Request and Sentry detail endpoints
- Add pagination, filtering, and stable error responses

Definition of done:

- Analysis list and detail endpoints expose a stable contract
- Pagination and filters are validated
- Error responses use a consistent format

Depends on: `B01`, `B02`

### [ ] B04 — Issue and Resolution API

Scope:

- Add issue queries and status transitions
- Add resolution history and audit events
- Add optimistic-concurrency protection

Definition of done:

- Status transitions are validated by the server
- Every resolution produces an audit-history entry
- Concurrent updates do not overwrite newer changes

Depends on: `B03`

### [ ] B05 — Jobs and Integrations

Scope:

- Implement the BullMQ job lifecycle
- Add GitHub and Sentry webhooks
- Define retry and idempotency behavior

Definition of done:

- Webhooks create jobs idempotently
- Failed jobs can be retried within defined limits
- Duplicate webhook deliveries do not create duplicate analyses

Depends on: `B02`, `B03`

### [ ] B06 — Observability Foundation

Scope:

- Add structured Pino logs and redaction
- Propagate end-to-end traces through BullMQ
- Add low-cardinality metrics
- Define actionable alerts and runbooks

Definition of done:

- An analysis can be traced from webhook to worker
- Metrics do not use unique identifiers as labels
- Sensitive data is sanitized before telemetry is exported
- Every primary alert has an owner and runbook

Depends on: `B01`, `B05`

---

## Track I — Infrastructure

### [x] I01 — Frontend Containerization

Scope:

- Add a Node.js 24 multi-stage Docker build
- Serve the production bundle with Nginx
- Configure SPA route fallback and immutable asset caching
- Add a container health endpoint and Docker health check
- Add Docker Compose for local production-like execution
- Add a Node.js 24 development service with isolated dependencies
- Add the Sail-like `cg` command wrapper
- Exclude development-only files from the image build context

Definition of done:

- Docker Compose configuration is valid
- The production image builds successfully
- The container reports a healthy status
- `/health` returns a successful response
- Direct requests to application routes return the SPA entry point
- npm, npx, and Node.js commands run through `cg` in the development container

Depends on: `F01`

---

## Recommended Build Order

```text
F01 → I01 → F02 → B01 → F03 + B02 → F04 + B03
    → F05 + B04 → F06 → B05 → F07 + B06 → F08 → F09
```

Frontend and backend tasks in related domains can be developed in parallel after the API contract is agreed upon.

## Task Execution Rules

To keep implementation manageable:

1. Work on only one active task per track.
2. Do not start a task until its dependencies are complete.
3. Verify the definition of done before marking a task as completed.
4. Update `Current Progress` after every completed task.
5. Record architecture-changing decisions in the primary concept document.
