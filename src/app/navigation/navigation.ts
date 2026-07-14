import {
  Activity,
  FolderKanban,
  Gauge,
  ListChecks,
  ScanSearch,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type UserRole = "member" | "admin" | "operator";

export interface NavigationItem {
  label: string;
  to: "/" | "/projects" | "/analyses" | "/issues" | "/system-health" | "/settings";
  icon: LucideIcon;
  allowedRoles?: UserRole[];
}

export const navigationItems: NavigationItem[] = [
  { label: "Overview", to: "/", icon: Gauge },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Analyses", to: "/analyses", icon: ScanSearch },
  { label: "Issues", to: "/issues", icon: ListChecks },
  {
    label: "System Health",
    to: "/system-health",
    icon: Activity,
    allowedRoles: ["admin", "operator"],
  },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function getNavigationForRole(role: UserRole) {
  return navigationItems.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(role),
  );
}
