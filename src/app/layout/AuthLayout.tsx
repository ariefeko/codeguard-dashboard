import { Navigate, Outlet } from "@tanstack/react-router";
import { Braces, ScanSearch, ShieldCheck } from "lucide-react";
import { useAuth } from "../../features/auth/model/AuthProvider";

export function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="auth-layout">
      <section className="auth-layout__intro" aria-label="CodeGuard overview">
        <div className="auth-brand">
          <span className="auth-brand__mark"><ShieldCheck size={24} /></span>
          <span>
            <strong>CodeGuard</strong>
            <small>Engineering quality</small>
          </span>
        </div>

        <div className="auth-layout__message">
          <span className="eyebrow">Secure engineering workflow</span>
          <h1>Turn every analysis into an actionable decision.</h1>
          <p>Review pull requests, investigate incidents, and track resolutions from one focused workspace.</p>
        </div>

        <div className="auth-highlights">
          <div><ScanSearch size={18} /><span>AI-assisted PR and incident analysis</span></div>
          <div><Braces size={18} /><span>Traceable findings down to file and line</span></div>
        </div>
      </section>

      <section className="auth-layout__form">
        <Outlet />
        <p className="auth-layout__legal">Frontend authentication demo for the CodeGuard skeleton.</p>
      </section>
    </main>
  );
}
