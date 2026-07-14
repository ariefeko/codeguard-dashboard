import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { PasswordField } from "../components/PasswordField";
import { useAuth } from "../model/AuthProvider";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const passwordConfirmation = String(form.get("passwordConfirmation") ?? "");

    if (name.length < 2 || !email.includes("@")) {
      setError("Enter your name and a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Password confirmation does not match.");
      return;
    }

    register({ name, email });
    void navigate({ to: "/" });
  }

  return (
    <div className="auth-card">
      <header className="auth-card__header">
        <span className="eyebrow">Create workspace access</span>
        <h2>Start with CodeGuard</h2>
        <p>Create your account and continue to the dashboard.</p>
      </header>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="auth-field" htmlFor="register-name">
          <span>Full name</span>
          <span className="auth-input-wrap">
            <UserRound size={16} />
            <input id="register-name" name="name" autoComplete="name" placeholder="Your name" required />
          </span>
        </label>

        <label className="auth-field" htmlFor="register-email">
          <span>Email address</span>
          <span className="auth-input-wrap">
            <Mail size={16} />
            <input id="register-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
          </span>
        </label>

        <PasswordField id="register-password" name="password" label="Password" autoComplete="new-password" placeholder="At least 8 characters" required />
        <PasswordField id="register-password-confirmation" name="passwordConfirmation" label="Confirm password" autoComplete="new-password" placeholder="Repeat your password" required />

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button className="auth-submit" type="submit">
          Create account <ArrowRight size={17} />
        </button>
      </form>

      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );
}
