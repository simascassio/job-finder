import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { Input } from "../Input/Input";
import { Select } from "../Select/Select";
import type { JobSearchFilters } from "../../types";
import "./SearchForm.css";

export const DEFAULT_SEARCH_FILTERS: JobSearchFilters = {
  role: "",
  sector: "",
  experienceLevel: "Júnior",
  location: "",
  workMode: "Qualquer",
  salaryMin: "",
  contractType: "Qualquer",
  technologies: [],
  companies: [],
};

interface SearchFormProps {
  initialFilters?: JobSearchFilters;
  loading?: boolean;
  onSearch: (filters: JobSearchFilters) => Promise<void>;
  onSave: (filters: JobSearchFilters) => void;
  submitLabel?: string;
}

const suggestedTechnologies = ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Python", "Node.js", "SQL"];

export function SearchForm({
  initialFilters = DEFAULT_SEARCH_FILTERS,
  loading = false,
  onSearch,
  onSave,
  submitLabel = "Encontrar vagas",
}: SearchFormProps) {
  const [filters, setFilters] = useState<JobSearchFilters>(initialFilters);
  const [technologyInput, setTechnologyInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => setFilters(initialFilters), [initialFilters]);

  const technologySuggestions = useMemo(
    () => suggestedTechnologies.filter((item) => !filters.technologies.some((tech) => tech.toLowerCase() === item.toLowerCase())),
    [filters.technologies],
  );

  function updateFilter<K extends keyof JobSearchFilters>(key: K, value: JobSearchFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    if (error) setError("");
  }

  function addTechnology(value = technologyInput) {
    const normalized = value.trim();
    if (!normalized) return;
    if (filters.technologies.some((tech) => tech.toLowerCase() === normalized.toLowerCase())) {
      setTechnologyInput("");
      return;
    }
    updateFilter("technologies", [...filters.technologies, normalized]);
    setTechnologyInput("");
  }

  function addCompany() {
    const normalized = companyInput.trim();
    if (!normalized) return;
    if (filters.companies.some((company) => company.toLowerCase() === normalized.toLowerCase())) {
      setCompanyInput("");
      return;
    }
    updateFilter("companies", [...filters.companies, normalized]);
    setCompanyInput("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!filters.role.trim() && !filters.location.trim() && filters.technologies.length === 0) {
      setError("Informe pelo menos um critério de busca: cargo, localização ou tecnologia.");
      return;
    }
    setError("");
    await onSearch(filters);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit} noValidate>
      <div className="search-form__intro">
        <div>
          <p className="eyebrow"><Icon name="filter" size={15} /> Filtros inteligentes</p>
          <h2>Configure o que você procura</h2>
          <p>Combine critérios para encontrar oportunidades mais alinhadas ao seu momento profissional.</p>
        </div>
        <button type="button" className="clear-filters" onClick={() => setFilters(DEFAULT_SEARCH_FILTERS)}>Limpar filtros</button>
      </div>

      <div className="search-form__grid search-form__grid--top">
        <Input id="cargo-desejado" label="Cargo desejado" value={filters.role} onChange={(event) => updateFilter("role", event.target.value)} placeholder="Ex.: Desenvolvedor Front-end" icon="briefcase" />
        <Input label="Área / setor" value={filters.sector} onChange={(event) => updateFilter("sector", event.target.value)} placeholder="Ex.: Tecnologia, Educação" />
        <Select label="Nível de experiência" value={filters.experienceLevel} onChange={(event) => updateFilter("experienceLevel", event.target.value as JobSearchFilters["experienceLevel"])} options={[
          { label: "Selecione", value: "" }, { label: "Estágio", value: "Estágio" }, { label: "Júnior", value: "Júnior" },
          { label: "Pleno", value: "Pleno" }, { label: "Sênior", value: "Sênior" }, { label: "Especialista", value: "Especialista" },
        ]} />
        <Input label="Localização" value={filters.location} onChange={(event) => updateFilter("location", event.target.value)} placeholder="Ex.: Rio de Janeiro" />
        <Select label="Modalidade" value={filters.workMode} onChange={(event) => updateFilter("workMode", event.target.value as JobSearchFilters["workMode"])} options={[
          { label: "Qualquer modalidade", value: "Qualquer" }, { label: "Remoto", value: "Remoto" }, { label: "Híbrido", value: "Híbrido" }, { label: "Presencial", value: "Presencial" },
        ]} />
        <Input label="Faixa salarial mínima" value={filters.salaryMin} onChange={(event) => updateFilter("salaryMin", event.target.value.replace(/\D/g, ""))} placeholder="Ex.: R$ 4.000" inputMode="numeric" />
        <Select label="Tipo de contrato" value={filters.contractType} onChange={(event) => updateFilter("contractType", event.target.value as JobSearchFilters["contractType"])} options={[
          { label: "Qualquer contrato", value: "Qualquer" }, { label: "CLT", value: "CLT" }, { label: "PJ", value: "PJ" },
          { label: "Estágio", value: "Estágio" }, { label: "Freelancer", value: "Freelancer" }, { label: "Temporário", value: "Temporário" },
        ]} />
      </div>

      <div className="search-form__section">
        <div className="search-form__section-head">
          <div><h3>Tecnologias e conhecimentos</h3><p>Adicione competências que você quer encontrar nas descrições das vagas.</p></div>
        </div>
        <div className="tag-input-row">
          <input
            value={technologyInput}
            onChange={(event) => setTechnologyInput(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTechnology(); } }}
            placeholder="Digite uma tecnologia e pressione Enter"
            aria-label="Adicionar tecnologia"
          />
          <Button type="button" variant="secondary" size="sm" icon="plus" onClick={() => addTechnology()}>Adicionar</Button>
        </div>
        <div className="suggestion-row" aria-label="Sugestões de tecnologias">
          {technologySuggestions.slice(0, 6).map((technology) => <button type="button" key={technology} className="suggestion-chip" onClick={() => addTechnology(technology)}>+ {technology}</button>)}
        </div>
        {filters.technologies.length > 0 ? (
          <div className="tag-list">
            {filters.technologies.map((technology) => (
              <span className="tag" key={technology}>{technology}
                <button type="button" aria-label={`Remover ${technology}`} onClick={() => updateFilter("technologies", filters.technologies.filter((tech) => tech !== technology))}><Icon name="close" size={13} /></button>
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="search-form__section">
        <div className="search-form__section-head">
          <div><h3>Empresas de interesse <span>Opcional</span></h3><p>Foque sua busca em empresas específicas, quando fizer sentido.</p></div>
        </div>
        <div className="tag-input-row">
          <input
            value={companyInput}
            onChange={(event) => setCompanyInput(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addCompany(); } }}
            placeholder="Ex.: Empresa Alpha"
            aria-label="Adicionar empresa de interesse"
          />
          <Button type="button" variant="secondary" size="sm" icon="plus" onClick={addCompany}>Adicionar</Button>
        </div>
        {filters.companies.length > 0 ? (
          <div className="tag-list">
            {filters.companies.map((company) => (
              <span className="tag" key={company}>{company}
                <button type="button" aria-label={`Remover empresa ${company}`} onClick={() => updateFilter("companies", filters.companies.filter((item) => item !== company))}><Icon name="close" size={13} /></button>
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {error ? <div className="form-banner form-banner--error" role="alert">{error}</div> : null}

      <div className="search-form__actions">
        <Button type="button" variant="secondary" size="lg" icon="plus" onClick={() => onSave(filters)}>Salvar busca</Button>
        <Button type="submit" size="lg" icon="search" loading={loading}>{loading ? "Buscando..." : submitLabel}</Button>
      </div>
    </form>
  );
}
