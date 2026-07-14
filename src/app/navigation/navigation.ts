import {
  Activity,
  FolderKanban,
  Gauge,
  ListChecks,
  ScanSearch,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { AppPath } from "../router/paths";

export type UserRole = "member" | "admin" | "operator";

export interface NavigationItem {
  label: string;
  to: AppPath;
  icon: LucideIcon;
  allowedRoles?: UserRole[];
  children?: Array<{
    label: string;
    to: AppPath;
  }>;
}

export const navigationItems: NavigationItem[] = [
  { label: "Overview", to: "/", icon: Gauge },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  {
    label: "Analyses",
    to: "/analyses/pr-reviews",
    icon: ScanSearch,
    children: [
      { label: "PR Reviews", to: "/analyses/pr-reviews" },
      { label: "Sentry Incidents", to: "/analyses/sentry-incidents" },
    ],
  },
  {
    label: "Issues",
    to: "/issues/open",
    icon: ListChecks,
    children: [
      { label: "Open", to: "/issues/open" },
      { label: "Resolved", to: "/issues/resolved" },
      { label: "Ignored", to: "/issues/ignored" },
    ],
  },
  {
    label: "System Health",
    to: "/system-health/jobs",
    icon: Activity,
    allowedRoles: ["admin", "operator"],
    children: [
      { label: "Jobs", to: "/system-health/jobs" },
      { label: "LLM Usage", to: "/system-health/llm-usage" },
      { label: "Observability", to: "/system-health/observability" },
    ],
  },
  {
    label: "Settings",
    to: "/settings/github",
    icon: Settings,
    children: [
      { label: "GitHub", to: "/settings/github" },
      { label: "Sentry", to: "/settings/sentry" },
      { label: "AI & RAG", to: "/settings/ai-rag" },
      { label: "Telemetry", to: "/settings/telemetry" },
      { label: "Obsidian", to: "/settings/obsidian" },
    ],
  },
];

export function getNavigationForRole(role: UserRole) {
  return navigationItems.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(role),
  );
}
