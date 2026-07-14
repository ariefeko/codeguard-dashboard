import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ChevronDown, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getNavigationForRole,
} from "../navigation/navigation";
import { useAuth } from "../../features/auth/model/AuthProvider";

function getSectionPath(pathname: string) {
  return pathname.split("/").slice(0, 2).join("/") || "/";
}

export function AppShell() {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigation = getNavigationForRole(user?.role ?? "member");
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const initials = user?.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "CG";
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set([getSectionPath(pathname)]),
  );

  useEffect(() => {
    const activeSection = getSectionPath(pathname);

    setExpandedSections((current) => {
      if (current.has(activeSection)) {
        return current;
      }

      const next = new Set(current);
      next.add(activeSection);
      return next;
    });
  }, [pathname]);

  function toggleSection(sectionPath: string) {
    setExpandedSections((current) => {
      const next = new Set(current);

      if (next.has(sectionPath)) {
        next.delete(sectionPath);
      } else {
        next.add(sectionPath);
      }

      return next;
    });
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${isSidebarOpen ? "sidebar--open" : ""}`}>
        <div className="brand">
          <span className="brand__mark"><ShieldCheck size={21} /></span>
          <span>
            <strong>CodeGuard</strong>
            <small>Engineering quality</small>
          </span>
          <button
            className="icon-button sidebar__close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="navigation" aria-label="Primary navigation">
          <span className="navigation__label">Workspace</span>
          {navigation.map(({ label, to, icon: Icon, children }) => {
            const sectionPath = getSectionPath(to);
            const isSectionActive = to === "/"
              ? pathname === "/"
              : pathname === sectionPath || pathname.startsWith(`${sectionPath}/`);
            const isExpanded = expandedSections.has(sectionPath);

            return (
              <div className="navigation__group" key={to}>
                {children ? (
                  <button
                    type="button"
                    className={`navigation__item navigation__item--button ${isSectionActive ? "navigation__item--active" : ""}`}
                    onClick={() => toggleSection(sectionPath)}
                    aria-expanded={isExpanded}
                    aria-controls={`navigation-${sectionPath.slice(1)}`}
                  >
                    <Icon size={18} />
                    <span className="navigation__item-label">{label}</span>
                    <ChevronDown
                      className={`navigation__chevron ${isExpanded ? "navigation__chevron--expanded" : ""}`}
                      size={15}
                    />
                  </button>
                ) : (
                  <Link
                    to={to}
                    className={`navigation__item ${isSectionActive ? "navigation__item--active" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                )}
                {children && (
                  <div
                    className={`navigation__subitems ${isExpanded ? "navigation__subitems--expanded" : ""}`}
                    id={`navigation-${sectionPath.slice(1)}`}
                    aria-hidden={!isExpanded}
                  >
                    {children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className={`navigation__subitem ${pathname === child.to ? "navigation__subitem--active" : ""}`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="navigation__subitem-marker" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          <div className="avatar">{initials}</div>
          <div>
            <strong>{user?.name ?? "CodeGuard User"}</strong>
            <small>{user?.role ?? "member"}</small>
          </div>
          <button className="sidebar__logout" type="button" onClick={signOut} aria-label="Sign out" title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <button
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <div className="workspace">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <button className="project-switcher" type="button">
            <span className="project-switcher__dot" />
            CodeGuard / Dashboard
            <span aria-hidden="true">⌄</span>
          </button>
          <div className="environment-badge">Development</div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
