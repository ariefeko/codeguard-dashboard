import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
} from "@tanstack/react-router";
import { AuthLayout } from "../layout/AuthLayout";
import { ProtectedAppShell } from "../layout/ProtectedAppShell";
import { OverviewPage } from "../../features/overview/pages/OverviewPage";
import { ProjectsPage } from "../../features/projects/pages/ProjectsPage";
import { AnalysesPage } from "../../features/analyses/pages/AnalysesPage";
import { IssuesPage } from "../../features/issues/pages/IssuesPage";
import { SystemHealthPage } from "../../features/system-health/pages/SystemHealthPage";
import { SettingsPage } from "../../features/settings/pages/SettingsPage";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { RegisterPage } from "../../features/auth/pages/RegisterPage";

const rootRoute = createRootRoute({ component: Outlet });

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_auth",
  component: AuthLayout,
});

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/register",
  component: RegisterPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_dashboard",
  component: ProtectedAppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",
  component: OverviewPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/projects",
  component: ProjectsPage,
});

const analysesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/analyses",
  component: () => <Navigate to="/analyses/pr-reviews" replace />,
});

const prReviewsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/analyses/pr-reviews",
  component: AnalysesPage,
});

const sentryIncidentsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/analyses/sentry-incidents",
  component: AnalysesPage,
});

const issuesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/issues",
  component: () => <Navigate to="/issues/open" replace />,
});

const openIssuesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/issues/open",
  component: IssuesPage,
});

const resolvedIssuesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/issues/resolved",
  component: IssuesPage,
});

const ignoredIssuesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/issues/ignored",
  component: IssuesPage,
});

const systemHealthRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/system-health",
  component: () => <Navigate to="/system-health/jobs" replace />,
});

const jobsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/system-health/jobs",
  component: SystemHealthPage,
});

const llmUsageRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/system-health/llm-usage",
  component: SystemHealthPage,
});

const observabilityRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/system-health/observability",
  component: SystemHealthPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/settings",
  component: () => <Navigate to="/settings/github" replace />,
});

const githubSettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/settings/github",
  component: SettingsPage,
});

const sentrySettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/settings/sentry",
  component: SettingsPage,
});

const aiRagSettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/settings/ai-rag",
  component: SettingsPage,
});

const telemetrySettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/settings/telemetry",
  component: SettingsPage,
});

const obsidianSettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/settings/obsidian",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  authRoute.addChildren([loginRoute, registerRoute]),
  dashboardRoute.addChildren([
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
  ]),
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
