import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import type { AppTab } from "../../app/router/paths";

interface PagePlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tabs?: AppTab[];
}

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  icon: Icon,
  tabs,
}: PagePlaceholderProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <button className="secondary-button" type="button">Last 7 days ⌄</button>
      </header>

      {tabs && (
        <div className="tabs" role="tablist" aria-label={`${title} views`}>
          {tabs.map((tab) => {
            const isActive = pathname === tab.to;

            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`tab ${isActive ? "tab--active" : ""}`}
                role="tab"
                aria-selected={isActive}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      )}

      <div className="placeholder-grid">
        <article className="placeholder-card placeholder-card--primary">
          <span className="placeholder-card__icon"><Icon size={24} /></span>
          <div>
            <h2>{title} foundation is ready</h2>
            <p>Route, application shell, and feature boundary are connected. The domain UI can now be implemented independently.</p>
          </div>
        </article>
        {["Data boundary", "Loading states", "API contract"].map((item) => (
          <article className="placeholder-card" key={item}>
            <span className="skeleton-line skeleton-line--short" />
            <h3>{item}</h3>
            <span className="skeleton-line" />
            <span className="skeleton-line skeleton-line--medium" />
          </article>
        ))}
      </div>
    </section>
  );
}
