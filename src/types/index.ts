export type WorkMode = "Remoto" | "Híbrido" | "Presencial" | "Qualquer";
export type ExperienceLevel = "Estágio" | "Júnior" | "Pleno" | "Sênior" | "Especialista";
export type ContractType = "CLT" | "PJ" | "Estágio" | "Freelancer" | "Temporário" | "Qualquer";
export type MonitoringFrequency = "off" | "daily" | "twice-daily" | "three-times-daily";

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  birthDate: string;
  phone: string;
  password?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: Exclude<WorkMode, "Qualquer">;
  salary?: string;
  contractType: Exclude<ContractType, "Qualquer">;
  technologies: string[];
  publishedAt: string;
  compatibility: number;
  url: string;
}

export interface JobSearchFilters {
  role: string;
  sector: string;
  experienceLevel: ExperienceLevel | "";
  location: string;
  workMode: WorkMode;
  salaryMin: string;
  contractType: ContractType;
  technologies: string[];
  companies: string[];
}

export interface JobSearch {
  id: string;
  name: string;
  filters: JobSearchFilters;
  monitoringEnabled: boolean;
  monitoringFrequency: MonitoringFrequency;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
