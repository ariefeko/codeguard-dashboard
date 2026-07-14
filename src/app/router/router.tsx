import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
} from "@tanstack/react-router";
import { AppShell } from "../layout/AppShell";
import { OverviewPage } from "../../features/overview/pages/OverviewPage";
import { ProjectsPage } from "../../features/projects/pages/ProjectsPage";
import { AnalysesPage } from "../../features/analyses/pages/AnalysesPage";
import { IssuesPage } from "../../features/issues/pages/IssuesPage";
import { SystemHealthPage } from "../../features/system-health/pages/SystemHealthPage";
import { SettingsPage } from "../../features/settings/pages/SettingsPage";

const rootRoute = createRootRoute({ component: AppShell });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: OverviewPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: ProjectsPage,
});

const analysesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analyses",
  component: () => <Navigate to="/analyses/pr-reviews" replace />,
});

const prReviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analyses/pr-reviews",
  component: AnalysesPage,
});

const sentryIncidentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analyses/sentry-incidents",
  component: AnalysesPage,
});

const issuesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/issues",
  component: () => <Navigate to="/issues/open" replace />,
});

const openIssuesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/issues/open",
  component: IssuesPage,
});

const resolvedIssuesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/issues/resolved",
  component: IssuesPage,
});

const ignoredIssuesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/issues/ignored",
  component: IssuesPage,
});

const systemHealthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system-health",
  component: () => <Navigate to="/system-health/jobs" replace />,
});

const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system-health/jobs",
  component: SystemHealthPage,
});

const llmUsageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system-health/llm-usage",
  component: SystemHealthPage,
});

const observabilityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system-health/observability",
  component: SystemHealthPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => <Navigate to="/settings/github" replace />,
});

const githubSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/github",
  component: SettingsPage,
});

const sentrySettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/sentry",
  component: SettingsPage,
});

const aiRagSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/ai-rag",
  component: SettingsPage,
});

const telemetrySettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/telemetry",
  component: SettingsPage,
});

const obsidianSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/obsidian",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  projectsRoute,
  analysesRoute,
  prReviewsRoute,
  sentryIncidentsRoute,
  issuesRoute,
  openIssuesRoute,
  resolvedIssuesRoute,
  ignoredIssuesRoute,
  systemHealthRoute,
  jobsRoute,
  llmUsageRoute,
  observabilityRoute,
  settingsRoute,
  githubSettingsRoute,
  sentrySettingsRoute,
  aiRagSettingsRoute,
  telemetrySettingsRoute,
  obsidianSettingsRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
