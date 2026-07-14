import {
  createRootRoute,
  createRoute,
  createRouter,
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
  component: AnalysesPage,
});

const issuesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/issues",
  component: IssuesPage,
});

const systemHealthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system-health",
  component: SystemHealthPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  projectsRoute,
  analysesRoute,
  issuesRoute,
  systemHealthRoute,
  settingsRoute,
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
