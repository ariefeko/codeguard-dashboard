# CodeGuard Dashboard Concept

## Goal

CodeGuard Dashboard is the primary interface for users to view CodeGuard analysis results.

The dashboard monitors:

- GitHub PR analysis
- Sentry bug analysis
- Analysis scores
- Issue list
- Files and line numbers
- Resolution status
- Job/queue status
- LLM provider usage
- Project settings
- Optional telemetry
- Optional Obsidian export

---

## Product Direction

```text
CodeGuard = AI code review engine + bug incident analyzer + dashboard
```

The dashboard is the primary workspace for multiple users.

```text
React Dashboard = user-facing dashboard
PostgreSQL = source of truth
Grafana Stack = technical observability
Obsidian = optional second brain export
```

---

## Core Principle

```text
Dashboard = where users view CodeGuard status
PostgreSQL = CodeGuard source of truth
Observability = technical monitoring
Obsidian = markdown summary / second brain
```

Obsidian and telemetry are optional for each project.

---

## Tech Stack

### Frontend

```text
React
Vite
TypeScript
TanStack Router
TanStack Query
TanStack Table
Tailwind CSS
shadcn/ui
Recharts
```

Responsibilities:

- SPA dashboard
- Page routing
- API data fetching
- Cache state
- Data table
- Chart metrics
- Clean SaaS UI

---

### Frontend Runtime and Delivery

```text
Docker multi-stage build
Node.js 24 Alpine = dependency installation and Vite production build
Nginx Alpine = static production server
Docker Compose = local container orchestration
cg CLI = Sail-like container command wrapper
```

Responsibilities:

- Produce a reproducible production bundle with Node.js 24
- Run development and package-management commands in a Node.js 24 container
- Serve hashed static assets with long-lived cache headers
- Support SPA route fallback to `index.html`
- Expose `/health` for container health checks
- Apply baseline HTTP security headers

The development service bind-mounts source code and stores dependencies in a Docker volume. The production container contains only the compiled `dist` output and Nginx runtime; source files, development dependencies, and local documentation are excluded.

---

### Backend

```text
Node.js
NestJS
Fastify Adapter
REST API
```

Responsibilities:

- API dashboard
- GitHub webhook receiver
- Sentry webhook receiver
- Project management
- Analysis management
- Issue tracking
- Resolution tracking
- Integration settings
- Obsidian export API

---

### Database

```text
PostgreSQL
```

Used as the source of truth for:

- users
- organizations
- projects
- repositories
- analysis
- github_pr_analysis_detail
- sentry_analysis_detail
- issues
- issue_resolutions
- jobs
- llm_calls
- observability_events
- integration_settings

---

### Queue

```text
Redis + BullMQ
```

Used for asynchronous processing:

- PR analysis job
- Sentry bug analysis job
- LLM analysis job
- GitHub comment job
- GitHub issue creation job
- Obsidian export job
- Retry failed jobs

---

### Technical Observability

```text
Pino
OpenTelemetry SDK + Collector
Grafana
Tempo
Loki
Prometheus
```

Mapping:

```text
Pino + Loki       = log search
OpenTelemetry     = telemetry pipeline
Tempo             = end-to-end tracing
Prometheus        = metrics
Grafana           = technical observability dashboard
```

Observability focuses on five principles:

```text
End-to-end trace correlation
Low-cardinality metrics
Structured logs
Sensitive-data sanitization
Actionable alerts
```

### End-to-End Trace Correlation

A single analysis must be traceable from the webhook to its final result:

```text
GitHub / Sentry webhook
        ↓
NestJS API
        ↓ propagate trace context
BullMQ job
        ↓
Worker
        ↓
RAG / LLM / GitHub / PostgreSQL
```

Correlation fields used consistently across logs and traces:

```text
trace_id
request_id
organization_id
project_id
analysis_id
job_id
```

Trace context must be propagated through BullMQ so the trace remains connected between the API and worker. Every external call, database operation, and significant analysis stage is represented as a child span.

Example span hierarchy:

```text
analysis.run
├── repository.fetch_context
├── rag.retrieve
├── llm.analyze
│   └── llm.fallback
├── findings.normalize
├── database.save
└── github.comment.publish
```

### Low-Cardinality Metrics

Metrics are used to aggregate system health, not to look up individual analyses.

Core metrics:

```text
http_request_duration_seconds
analysis_duration_seconds
analysis_failures_total
analysis_queue_wait_seconds
jobs_queued
jobs_failed_total
job_retry_total
oldest_pending_job_seconds
llm_request_duration_seconds
llm_errors_total
llm_fallback_total
llm_input_tokens_total
llm_output_tokens_total
```

Metric labels are limited to stable, low-cardinality values:

```text
source
status
job_type
provider
model
operation
route
```

Unique identifiers such as `trace_id`, `analysis_id`, `job_id`, `user_id`, and `repo_name` must not be used as Prometheus labels. These identifiers belong in logs and traces only.

### Structured Logs

Pino produces JSON logs with consistent field and event names:

```json
{
  "level": "error",
  "event": "analysis.failed",
  "trace_id": "trace_abc",
  "analysis_id": "ana_123",
  "job_id": "job_456",
  "provider": "llm-provider",
  "error_code": "LLM_TIMEOUT",
  "duration_ms": 30215
}
```

Use stable `event` and `error_code` values so logs can be searched and aggregated without parsing free-form messages. Stack traces are stored in technical logs, while the product dashboard only displays user-safe failure messages.

### Sensitive-Data Sanitization

Redaction occurs before logs, spans, or metrics are exported. Telemetry must not store:

- Authorization headers, API tokens, webhook secrets, or credentials
- Source code, code snippets, prompts, or LLM responses by default
- Raw GitHub or Sentry payloads without sanitization
- Email addresses, usernames, or unnecessary personal data
- Query parameters or arbitrary metadata without an allowlist

Use an allowlist for span attributes and `metadata_json`, and configure Pino redaction for secret fields. Storing prompts or responses for debugging must be opt-in and protected by access controls and a retention policy.

### Actionable Alerts

Alerts must communicate impact and have a clear response. Primary alerts include:

- Analysis failure rate exceeds its threshold
- The queue stops progressing or its oldest pending job is too old
- No workers are active
- LLM provider timeout or error rate increases
- Both the primary and fallback providers fail
- GitHub or Sentry webhooks fail to process
- The database connection pool approaches exhaustion
- OpenTelemetry Collector fails to export telemetry

Alerts are based on rate, duration, backlog, or user impact rather than individual errors. Every alert must have a severity, owner, dashboard or trace link, and a concise runbook.

### Data Ownership

```text
PostgreSQL = business events and audit trails required by the product
Loki       = raw structured technical logs
Tempo      = distributed traces
Prometheus = aggregated low-cardinality metrics
Grafana    = technical dashboards and alerting
```

Raw logs, spans, and metrics are not duplicated in PostgreSQL.

---

### Second Brain

```text
Obsidian Markdown Export
```

Obsidian is not a source of truth.

Obsidian stores only:

- Daily summary
- PR analysis summary
- Sentry bug analysis summary
- Important issues
- File + line number
- Resolution notes
- LLM provider health summary
- Incident summary
- Debugging lessons learned
- Technical decisions

---

## High-Level Architecture

```text
GitHub / Sentry
      ↓
NestJS API + Fastify
      ↓
PostgreSQL
      ↓
Redis + BullMQ
      ↓
Worker
      ↓
LLM Provider / RAG / Tavily
      ↓
Save analysis + issues + resolution
      ↓
Nginx container → React Dashboard
```

Frontend delivery flow:

```text
Source code
    ↓ Node.js 24 build stage
Vite production bundle
    ↓ copied into runtime image
Nginx container
    ↓
Browser
```

Optional flow:

```text
API / Worker
   ├── Emit logs → Pino → Loki → Grafana
   ├── Emit traces/metrics → OpenTelemetry → Tempo/Prometheus → Grafana
   └── Export summary → Obsidian Markdown
```

---

## Dashboard Pages

```text
Dashboard
├── Overview
├── Projects
│   └── Project Detail
│       ├── Repositories
│       └── Integrations
├── Analyses
│   ├── PR Reviews
│   └── Sentry Incidents
├── Issues
│   ├── Open
│   ├── Resolved
│   └── Ignored
├── System Health (admin/operator only)
│   ├── Jobs / Queue
│   ├── LLM Usage
│   └── Observability
└── Settings
    ├── GitHub
    ├── Sentry
    ├── AI & RAG
    ├── Telemetry
    └── Obsidian Export
```

The regular-user sidebar displays only five primary menu items:

```text
Overview
Projects
Analyses
Issues
Settings
```

`System Health` is displayed conditionally for administrator and operator roles. Subsections are shown both as nested sidebar links and as route-aware page tabs. Resolutions are part of Issue history and filtering rather than a separate menu item.

Subsection routes:

```text
/analyses/pr-reviews
/analyses/sentry-incidents
/issues/open
/issues/resolved
/issues/ignored
/system-health/jobs
/system-health/llm-usage
/system-health/observability
/settings/github
/settings/sentry
/settings/ai-rag
/settings/telemetry
/settings/obsidian
```

Primary user flow:

```text
Select project → view analysis → inspect issue → resolve
```

---

## Page Details

## 1. Overview

Displays the primary summary.

Cards:

- Total PR analyzed
- Total Sentry bugs analyzed
- Total issues found
- Open issues
- Resolved issues
- Failed jobs
- LLM fallback used
- Last analysis status

Charts:

- Issues by severity
- Analysis trend
- LLM provider success/failure
- Job success/failure

---

## 2. Projects

Displays projects for the current user or organization.

Data:

```text
project_id
organization_id
project_name
repository_count
analysis_count
open_issue_count
status
created_at
updated_at
```

Actions:

- Create project
- Edit project
- Open project detail
- Configure integrations

---

## 3. Repositories

Displays connected repositories.

Data:

```text
repo_id
project_id
provider
repo_owner
repo_name
default_branch
webhook_status
last_webhook_at
created_at
```

Actions:

- Connect GitHub repo
- View PR analysis
- Check webhook status

---

## 4. PR Reviews

Displays GitHub Pull Request analysis results.

Data:

```text
analysis_id
project_id
repo_name
pr_number
pr_title
author_username
branch_name
score
status
issue_count
resolved_count
github_comment_status
created_at
completed_at
```

Actions:

- View analysis detail
- View issues
- Open GitHub PR
- Re-run analysis
- Export to Obsidian

---

## 5. Sentry Incidents

Displays Sentry bug analysis results.

Data:

```text
analysis_id
project_id
sentry_issue_id
error_type
error_message
environment
release
score
status
issue_count
github_issue_status
created_at
completed_at
```

Actions:

- View incident detail
- View related files
- Open Sentry issue
- Open GitHub issue
- Re-run analysis
- Export to Obsidian

---

## 6. Issues

The primary workflow page for users.

Data:

```text
issue_id
analysis_id
project_id
source
file_path
line_number
end_line_number
issue_type
severity
title
message
recommendation
confidence_score
status
created_at
updated_at
```

Status:

```text
open
resolved
ignored
false_positive
accepted_risk
```

Actions:

- View issue detail
- Mark as resolved
- Mark as ignored
- Mark as false positive
- Add resolution note
- Open related PR/Sentry

---

## 7. Resolutions

Displays issue-resolution history.

Data:

```text
resolution_id
issue_id
analysis_id
project_id
resolved_by_user_id
resolution_type
resolution_note
resolved_commit_sha
resolved_pr_number
resolved_at
created_at
```

Resolution type:

```text
fixed
ignored
false_positive
accepted_risk
```

---

## 8. Jobs / Queue

Displays asynchronous job status.

Data:

```text
job_id
project_id
analysis_id
job_type
status
attempts
error_message
created_at
started_at
processed_at
failed_at
```

Job type:

```text
pr_analysis
sentry_analysis
llm_analysis
github_comment
github_issue
obsidian_export
```

Actions:

- Retry failed job
- View job logs
- View related analysis

---

## 9. LLM Usage

Displays LLM provider usage.

Data:

```text
llm_call_id
project_id
analysis_id
provider
model
status
latency_ms
tokens_input
tokens_output
fallback_used
error_reason
created_at
```

Metrics:

- Provider success count
- Provider failure count
- Average latency
- Fallback count
- Error reasons

---

## 10. Observability

Displays CodeGuard business events and operational status that are safe and relevant to users. Operators and administrators continue to access raw logs, traces, metrics, stack traces, and infrastructure details through Grafana.

Data:

```text
event_id
analysis_id
project_id
trace_id
job_id
event_type
source
status
message
metadata_json
created_at
```

Event examples:

```text
github_webhook_received
sentry_webhook_received
job_queued
worker_started
rag_query_succeeded
rag_query_failed
llm_called
llm_failed
fallback_used
github_comment_posted
github_issue_created
analysis_completed
analysis_failed
obsidian_exported
```

Actions:

- Filter by project, analysis, event type, and status
- Open related analysis/job
- Copy `trace_id`
- Open the related Grafana trace for users with operator access

`observability_events` is not a raw telemetry store. The table contains only product and audit events that must be displayed in the dashboard.

---

## 11. Settings

### GitHub Settings

- GitHub App / PAT config
- Repository mapping
- Webhook status
- Comment behavior
- Issue creation behavior

### Sentry Settings

- Sentry webhook secret
- Project mapping
- Environment filter
- Auto-create GitHub issue toggle

### RAG Settings

- RAG enabled
- Collection settings
- Max snippets
- Min confidence
- Topic mapper config

### Telemetry Settings

- Telemetry enabled
- OpenTelemetry endpoint
- Export logs toggle
- Export traces toggle
- Export metrics toggle

### Obsidian Export Settings

- Obsidian enabled
- Export mode
- GitHub repo sync / local export later
- Daily summary toggle
- PR summary toggle
- Sentry summary toggle

---

## Core Data Model

```text
users
  └── organizations
        └── projects
              ├── repositories
              ├── analysis
              │     ├── github_pr_analysis_detail
              │     ├── sentry_analysis_detail
              │     ├── issues
              │     │     └── issue_resolutions
              │     ├── jobs
              │     ├── llm_calls
              │     └── observability_events
              └── integration_settings
```

---

## Main Tables

## analysis

```text
analysis_id
project_id
project_name
user_id
source
score
status
issue_count
resolved_count
open_count
trace_id
job_id
created_at
started_at
completed_at
failed_at
error_message
```

Source:

```text
github_pr
sentry
```

---

## github_pr_analysis_detail

```text
analysis_id
repo_id
repo_owner
repo_name
pr_id
pr_number
pr_title
pr_url
branch_name
base_branch
commit_sha
author_username
github_comment_status
github_comment_url
```

---

## sentry_analysis_detail

```text
analysis_id
sentry_project_id
sentry_issue_id
sentry_issue_url
error_type
error_message
environment
release
transaction
event_id
occurred_at
github_issue_status
github_issue_url
```

---

## issues

```text
issue_id
analysis_id
project_id
source
file_path
line_number
end_line_number
issue_type
severity
title
message
recommendation
code_snippet
confidence_score
status
created_at
updated_at
```

---

## issue_resolutions

```text
resolution_id
issue_id
analysis_id
project_id
resolved_by_user_id
resolution_type
resolution_note
resolved_commit_sha
resolved_pr_number
resolved_at
created_at
```

---

## observability_events

```text
event_id
analysis_id
project_id
trace_id
job_id
event_type
source
status
message
metadata_json
created_at
```

---

## MVP Scope

### Included in Dashboard MVP

```text
Project list
Repository list
PR review history
Sentry incident history
Issue list with file + line number
Issue detail
Resolution status
Job status
LLM usage summary
Basic settings
Obsidian export status
```

### Not Included Yet

```text
Billing
Team role permission detail
Advanced analytics
Custom alert builder
Advanced Grafana embedding
Advanced RAG dashboard
Multi-tenant enterprise isolation
```

---

## MVP Build Tasks

Task breakdowns, dependencies, statuses, and definitions of done are stored separately so the concept document remains focused:

[CodeGuard Dashboard Build Tasks](tasks/dashboard-build-tasks.md)

---

## API Endpoint Draft

```text
GET    /api/health

GET    /api/projects
POST   /api/projects
GET    /api/projects/:projectId
PATCH  /api/projects/:projectId

GET    /api/projects/:projectId/repositories
POST   /api/projects/:projectId/repositories

GET    /api/projects/:projectId/analysis
GET    /api/analysis/:analysisId

GET    /api/analysis/:analysisId/github-pr-detail
GET    /api/analysis/:analysisId/sentry-detail

GET    /api/projects/:projectId/issues
GET    /api/issues/:issueId
PATCH  /api/issues/:issueId/status

POST   /api/issues/:issueId/resolutions
GET    /api/issues/:issueId/resolutions

GET    /api/projects/:projectId/jobs
GET    /api/jobs/:jobId
POST   /api/jobs/:jobId/retry

GET    /api/projects/:projectId/llm-usage
GET    /api/projects/:projectId/observability-events

GET    /api/projects/:projectId/settings
PATCH  /api/projects/:projectId/settings

POST   /api/projects/:projectId/obsidian/export
```

---

## UI Layout Direction

```text
Left Sidebar
  - Overview
  - Projects
  - Analyses
  - Issues
  - System Health (admin/operator only)
  - Settings

Page Tabs
  - Analyses: PR Reviews / Sentry Incidents
  - Issues: Open / Resolved / Ignored
  - System Health: Jobs / LLM Usage / Observability

Top Bar
  - Project selector
  - Search
  - User menu

Main Content
  - Cards
  - Tables
  - Charts
  - Detail drawer
```

Recommended UI:

```text
shadcn/ui
Dark mode first
Clean technical SaaS style
Large tables for issues and analysis
Detail drawer for issue details
```

---

## Final Flow

```text
GitHub PR / Sentry Event
        ↓
CodeGuard API / Worker
        ↓
Save analysis/issues/resolution → PostgreSQL
        ↓
Emit logs/traces/metrics → Observability stack
        ↓
React Dashboard reads from NestJS API
        ↓
User reviews issue / resolution status
        ↓
Optional export summary → Obsidian
```

---

## Final Principle

```text
PostgreSQL stores the truth.
Dashboard shows the product value.
Grafana shows technical health.
Obsidian stores the human-readable memory.
```
