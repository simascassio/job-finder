import type { User } from "../types";
import { storage } from "./storageService";
import { normalizeUserForStorage, type LoginFormData, type RegistrationFormData } from "../utils/validation";

const DEMO_USER: User = {
  id: "user-demo",
  name: "Cássio Demo",
  email: "demo@jobfinder.local",
  cpf: "52998224725",
  birthDate: "1993-01-15",
  phone: "21999999999",
  password: "JobFinder123",
};

export async function registerUser(form: RegistrationFormData): Promise<User> {
  await delay(450);

  const user = normalizeUserForStorage({
    id: crypto.randomUUID(),
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    cpf: form.cpf,
    birthDate: form.birthDate,
    phone: form.phone,
    password: form.password,
  });

  storage.set(storage.keys.user, user);
  storage.set(storage.keys.session, { userId: user.id });
  return user;
}

export async function loginUser(form: LoginFormData): Promise<User> {
  await delay(550);

  const storedUser = storage.get<User | null>(storage.keys.user, null);
  const normalizedEmail = form.email.trim().toLowerCase();
  const user = storedUser ?? DEMO_USER;

  if (storedUser && normalizedEmail !== user.email) {
    throw new Error("E-mail ou senha inválidos.");
  }

  if (form.password.length < 6) {
    throw new Error("E-mail ou senha inválidos.");
  }

  // Simulação local. A versão com backend validará credenciais via API.
  storage.set(storage.keys.user, user);
  storage.set(storage.keys.session, { userId: user.id });
  return user;
}

export async function logoutUser(): Promise<void> {
  await delay(120);
  storage.remove(storage.keys.session);
}

export function getStoredUser(): User | null {
  const storedUser = storage.get<User | null>(storage.keys.user, null);
  const session = storage.get<{ userId: string } | null>(storage.keys.session, null);

  return session && storedUser && session.userId === storedUser.id ? storedUser : null;
}

export async function requestPasswordRecovery(email: string): Promise<void> {
  await delay(650);
  // Backend futuro: POST /auth/password-recovery
  void email;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
