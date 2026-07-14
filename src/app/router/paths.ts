export type AppPath =
  | "/"
  | "/login"
  | "/register"
  | "/projects"
  | "/analyses"
  | "/analyses/pr-reviews"
  | "/analyses/sentry-incidents"
  | "/issues"
  | "/issues/open"
  | "/issues/resolved"
  | "/issues/ignored"
  | "/system-health"
  | "/system-health/jobs"
  | "/system-health/llm-usage"
  | "/system-health/observability"
  | "/settings"
  | "/settings/github"
  | "/settings/sentry"
  | "/settings/ai-rag"
  | "/settings/telemetry"
  | "/settings/obsidian";

export interface AppTab {
  label: string;
  to: AppPath;
}
