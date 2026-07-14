import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../../features/auth/model/AuthProvider";
import { AppShell } from "./AppShell";

export function ProtectedAppShell() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
}
