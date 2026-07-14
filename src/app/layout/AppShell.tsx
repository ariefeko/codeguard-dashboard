import { Link, Outlet } from "@tanstack/react-router";
import { Menu, PanelLeftClose, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import {
  getNavigationForRole,
  type UserRole,
} from "../navigation/navigation";

const currentUserRole: UserRole = "admin";

export function AppShell() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigation = getNavigationForRole(currentUserRole);

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
          {navigation.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "navigation__item navigation__item--active" }}
              inactiveProps={{ className: "navigation__item" }}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="avatar">AE</div>
          <div>
            <strong>Arief Eko</strong>
            <small>{currentUserRole}</small>
          </div>
          <PanelLeftClose size={17} aria-hidden="true" />
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
