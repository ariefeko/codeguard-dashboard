import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { UserRole } from "../../../app/navigation/navigation";

const SESSION_KEY = "codeguard.demo-session";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

interface SignInInput {
  email: string;
}

interface RegisterInput extends SignInInput {
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  signIn: (input: SignInInput) => void;
  register: (input: RegisterInput) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  try {
    const storedUser = window.localStorage.getItem(SESSION_KEY);
    return storedUser ? JSON.parse(storedUser) as AuthUser : null;
  } catch {
    return null;
  }
}

function nameFromEmail(email: string) {
  return email
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  const persistUser = useCallback((nextUser: AuthUser) => {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const signIn = useCallback(({ email }: SignInInput) => {
    persistUser({
      name: nameFromEmail(email) || "CodeGuard User",
      email,
      role: "admin",
    });
  }, [persistUser]);

  const register = useCallback(({ name, email }: RegisterInput) => {
    persistUser({ name, email, role: "admin" });
  }, [persistUser]);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, signIn, register, signOut }),
    [register, signIn, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
