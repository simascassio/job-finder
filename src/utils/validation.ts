import type { FieldErrors, User } from "../types";
import { normalizeCPF, validateCPF } from "./cpf";

export interface RegistrationFormData extends Omit<User, "id" | "password"> {
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export function isValidDate(date: string): boolean {
  if (!date) return false;
  const parsed = new Date(`${date}T00:00:00`);
  return !Number.isNaN(parsed.getTime()) && parsed < new Date();
}

export function validateLogin(form: LoginFormData): FieldErrors<LoginFormData> {
  const errors: FieldErrors<LoginFormData> = {};
  if (!isValidEmail(form.email)) errors.email = "Digite um e-mail válido.";
  if (form.password.length < 6) errors.password = "A senha deve ter pelo menos 6 caracteres.";
  return errors;
}

export function validateRegistration(
  form: RegistrationFormData,
): FieldErrors<RegistrationFormData> {
  const errors: FieldErrors<RegistrationFormData> = {};

  if (form.name.trim().length < 3) errors.name = "Informe seu nome completo.";
  if (!isValidEmail(form.email)) errors.email = "Digite um e-mail válido.";
  if (!validateCPF(form.cpf)) errors.cpf = "CPF inválido. Confira os dígitos informados.";
  if (!isValidDate(form.birthDate)) errors.birthDate = "Informe uma data de nascimento válida.";
  if (!isValidPhone(form.phone)) errors.phone = "Informe um telefone válido com DDD.";

  if (form.password.length < 8) {
    errors.password = "Use pelo menos 8 caracteres na senha.";
  } else if (
    !/[A-Z]/.test(form.password) ||
    !/[a-z]/.test(form.password) ||
    !/\d/.test(form.password)
  ) {
    errors.password = "Use letras maiúsculas, minúsculas e pelo menos um número.";
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "As senhas não coincidem.";
  }

  if (!form.termsAccepted) errors.termsAccepted = "Aceite os termos para continuar.";

  return errors;
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function normalizeUserForStorage(user: User): User {
  return {
    ...user,
    cpf: normalizeCPF(user.cpf),
    phone: user.phone.replace(/\D/g, ""),
  };
}
