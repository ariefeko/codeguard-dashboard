import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { PasswordField } from "../components/PasswordField";
import { useAuth } from "../model/AuthProvider";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email.includes("@") || password.length < 8) {
      setError("Enter a valid email and a password with at least 8 characters.");
      return;
    }

    signIn({ email });
    void navigate({ to: "/" });
  }

  return (
    <div className="auth-card">
      <header className="auth-card__header">
        <span className="eyebrow">Welcome back</span>
        <h2>Sign in to CodeGuard</h2>
        <p>Continue to your engineering quality workspace.</p>
      </header>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="auth-field" htmlFor="login-email">
          <span>Email address</span>
          <span className="auth-input-wrap">
            <Mail size={16} />
            <input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
          </span>
        </label>

        <PasswordField id="login-password" name="password" label="Password" autoComplete="current-password" placeholder="At least 8 characters" required />

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button className="auth-submit" type="submit">
          Sign in <ArrowRight size={17} />
        </button>
      </form>

      <p className="auth-demo-note">Demo mode: use any valid email and password with at least 8 characters.</p>
      <p className="auth-switch">New to CodeGuard? <Link to="/register">Create an account</Link></p>
    </div>
  );
}
