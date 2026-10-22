import type { Job, JobSearchFilters } from "../types";
import { MOCK_JOBS } from "../data/mockJobs";

export async function searchJobs(filters: JobSearchFilters): Promise<Job[]> {
  await delay(850);

  const role = filters.role.trim().toLowerCase();
  const sector = filters.sector.trim().toLowerCase();
  const location = filters.location.trim().toLowerCase();
  const companies = filters.companies.map((company) => company.toLowerCase());
  const salaryMin = Number(filters.salaryMin) || 0;

  return MOCK_JOBS.filter((job) => {
    const searchableText = `${job.title} ${job.company} ${job.technologies.join(" ")}`.toLowerCase();
    const matchesRole = !role || `${job.title} ${job.company}`.toLowerCase().includes(role);
    const matchesSector = !sector || searchableText.includes(sector);
    const matchesLocation =
      !location ||
      job.location.toLowerCase().includes(location) ||
      (location === "remoto" && job.workMode === "Remoto");
    const matchesWorkMode = filters.workMode === "Qualquer" || job.workMode === filters.workMode;
    const matchesContract = filters.contractType === "Qualquer" || job.contractType === filters.contractType;
    const matchesCompany =
      companies.length === 0 ||
      companies.some((company) => job.company.toLowerCase().includes(company));
    const matchesTech =
      filters.technologies.length === 0 ||
      filters.technologies.every((tech) =>
        job.technologies.some((jobTech) => jobTech.toLowerCase() === tech.toLowerCase()),
      );
    const matchesExperience = matchExperience(job, filters.experienceLevel);
    const matchesSalary = !salaryMin || extractStartingSalary(job.salary) >= salaryMin;

    return (
      matchesRole &&
      matchesSector &&
      matchesLocation &&
      matchesWorkMode &&
      matchesContract &&
      matchesCompany &&
      matchesTech &&
      matchesExperience &&
      matchesSalary
    );
  });
}

function matchExperience(job: Job, experience: JobSearchFilters["experienceLevel"]): boolean {
  if (!experience) return true;

  const title = job.title.toLowerCase();
  if (experience === "Estágio") return title.includes("estágio") || title.includes("intern");
  if (experience === "Júnior") return title.includes("júnior") || title.includes("jr") || title.includes("j r");
  if (experience === "Pleno") return title.includes("pleno") || title.includes("mid-level") || title.includes("mid level");
  if (experience === "Sênior") return title.includes("sênior") || title.includes("senior") || title.includes("sr");
  return title.includes("especialista") || title.includes("specialist");
}

function extractStartingSalary(salary?: string): number {
  if (!salary) return 0;
  const firstValue = salary.match(/R\$\s*([\d.]+)/)?.[1];
  return firstValue ? Number(firstValue.replace(/\./g, "")) : 0;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
