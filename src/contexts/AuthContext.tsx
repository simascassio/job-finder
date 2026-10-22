import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { getStoredUser, loginUser, logoutUser, registerUser } from "../services/authService";
import type { User } from "../types";
import type { LoginFormData, RegistrationFormData } from "../utils/validation";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (form: LoginFormData) => Promise<User>;
  register: (form: RegistrationFormData) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const login = useCallback(async (form: LoginFormData) => {
    const authenticatedUser = await loginUser(form);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const register = useCallback(async (form: RegistrationFormData) => {
    const registeredUser = await registerUser(form);
    setUser(registeredUser);
    return registeredUser;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, register, logout }),
    [login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
