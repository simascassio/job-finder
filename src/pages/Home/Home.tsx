import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button/Button";
import { Header } from "../../components/Header/Header";
import { Icon } from "../../components/Icon/Icon";
import { Input } from "../../components/Input/Input";
import { Modal } from "../../components/Modal/Modal";
import { SavedSearchCard } from "../../components/SavedSearchCard/SavedSearchCard";
import { SearchCard } from "../../components/SearchCard/SearchCard";
import { DEFAULT_SEARCH_FILTERS, SearchForm } from "../../components/SearchForm/SearchForm";
import { Toast } from "../../components/Toast/Toast";
import { useAuth } from "../../contexts/AuthContext";
import { MOCK_JOBS } from "../../data/mockJobs";
import { searchJobs } from "../../services/jobService";
import { storage } from "../../services/storageService";
import type { Job, JobSearch, JobSearchFilters, MonitoringFrequency } from "../../types";
import "./Home.css";

const SAVED_SEARCHES_KEY = storage.keys.searches;
const monitoringOptions: Array<{ label: string; value: MonitoringFrequency }> = [
  { label: "Desativado", value: "off" },
  { label: "Diário", value: "daily" },
  { label: "2 vezes por dia", value: "twice-daily" },
  { label: "3 vezes por dia", value: "three-times-daily" },
];

export function Home() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<JobSearchFilters>(DEFAULT_SEARCH_FILTERS);
  const [results, setResults] = useState<Job[]>(MOCK_JOBS);
  const [searching, setSearching] = useState(false);
  const [savedSearches, setSavedSearches] = useState<JobSearch[]>(() => storage.get<JobSearch[]>(SAVED_SEARCHES_KEY, []));
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [editingSearch, setEditingSearch] = useState<JobSearch | null>(null);
  const [draftSearchName, setDraftSearchName] = useState("");
  const [draftFrequency, setDraftFrequency] = useState<MonitoringFrequency>("daily");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => storage.set(SAVED_SEARCHES_KEY, savedSearches), [savedSearches]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const activeMonitoringCount = useMemo(() => savedSearches.filter((search) => search.monitoringEnabled).length, [savedSearches]);

  async function handleSearch(nextFilters: JobSearchFilters) {
    setFilters(nextFilters);
    setSearching(true);
    try {
      const nextResults = await searchJobs(nextFilters);
      setResults(nextResults);
      setToast({ message: `${nextResults.length} oportunidade(s) encontrada(s) na demonstração.`, type: "success" });
      window.setTimeout(() => document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch {
      setToast({ message: "Não foi possível concluir a busca simulada.", type: "error" });
    } finally {
      setSearching(false);
    }
  }

  function openSaveModal(nextFilters: JobSearchFilters) {
    setFilters(nextFilters);
    setEditingSearch(null);
    setDraftSearchName(nextFilters.role ? `${nextFilters.role}${nextFilters.location ? ` — ${nextFilters.location}` : ""}` : "Minha nova busca");
    setDraftFrequency("daily");
    setSaveModalOpen(true);
  }

  function confirmSaveSearch() {
    const now = new Date().toISOString();
    setSavedSearches((current) => [{
      id: crypto.randomUUID(),
      name: draftSearchName.trim() || "Minha nova busca",
      filters,
      monitoringEnabled: draftFrequency !== "off",
      monitoringFrequency: draftFrequency,
      createdAt: now,
      updatedAt: now,
    }, ...current]);
    setSaveModalOpen(false);
    setToast({ message: "Busca salva com sucesso.", type: "success" });
  }

  function openEditModal(search: JobSearch) {
    setEditingSearch(search);
    setDraftSearchName(search.name);
    setDraftFrequency(search.monitoringEnabled ? search.monitoringFrequency : "off");
    setSaveModalOpen(true);
  }

  function confirmEditSearch() {
    if (!editingSearch) return;
    setSavedSearches((current) => current.map((search) => search.id === editingSearch.id
      ? {
          ...search,
          name: draftSearchName.trim() || search.name,
          monitoringEnabled: draftFrequency !== "off",
          monitoringFrequency: draftFrequency,
          updatedAt: new Date().toISOString(),
        }
      : search,
    ));
    setSaveModalOpen(false);
    setEditingSearch(null);
    setToast({ message: "Busca atualizada.", type: "success" });
  }

  function toggleSearch(search: JobSearch) {
    setSavedSearches((current) => current.map((item) => item.id === search.id
      ? {
          ...item,
          monitoringEnabled: !item.monitoringEnabled,
          monitoringFrequency: item.monitoringEnabled
            ? "off"
            : (item.monitoringFrequency === "off" ? "daily" : item.monitoringFrequency),
          updatedAt: new Date().toISOString(),
        }
      : item,
    ));
    setToast({ message: search.monitoringEnabled ? "Monitoramento pausado." : "Monitoramento ativado.", type: "success" });
  }

  function deleteSearch(search: JobSearch) {
    if (!window.confirm(`Excluir a busca “${search.name}”?`)) return;
    setSavedSearches((current) => current.filter((item) => item.id !== search.id));
    setToast({ message: "Busca excluída.", type: "success" });
  }

  function createNewSearch() {
    document.getElementById("busca")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => document.getElementById("cargo-desejado")?.focus(), 400);
  }

  return (
    <div className="app-shell">
      <Header />
      <main>
        <section className="dashboard-hero">
          <div className="container dashboard-hero__inner">
            <div>
              <div className="hero-chip"><Icon name="sparkles" size={14} /> Motor de oportunidades · MVP</div>
              <h1>Encontre sua próxima oportunidade.</h1>
              <p>Olá, {user?.name.split(" ")[0]}. Configure o que você procura e deixe o JobFinder procurar por você.</p>
            </div>
            <div className="hero-highlight">
              <span className="hero-highlight__icon"><Icon name="briefcase" size={18} /></span>
              <div><strong>{activeMonitoringCount}</strong><span>buscas monitoradas</span></div>
            </div>
          </div>
        </section>

        <div className="container dashboard-content">
          <section id="busca" className="surface-panel search-panel">
            <SearchForm initialFilters={filters} loading={searching} onSearch={handleSearch} onSave={openSaveModal} />
          </section>

          <section id="resultados" className="results-section" aria-labelledby="results-title">
            <div className="section-head">
              <div>
                <p className="eyebrow">Resultados</p>
                <h2 id="results-title">Oportunidades encontradas</h2>
                <p>{results.length ? `${results.length} vagas demonstrativas para seus critérios atuais.` : "Nenhuma vaga demonstrativa corresponde aos filtros atuais."}</p>
              </div>
              <div className="result-summary"><Icon name="sparkles" size={16} /><span>Compatibilidade simulada</span></div>
            </div>

            {results.length ? (
              <div className="jobs-grid">{results.map((job) => <SearchCard key={job.id} job={job} />)}</div>
            ) : (
              <div className="empty-state">
                <span className="empty-state__icon"><Icon name="search" size={21} /></span>
                <h3>Nenhuma oportunidade encontrada</h3>
                <p>Tente remover algum filtro ou ampliar a localização e as tecnologias.</p>
              </div>
            )}
          </section>

          <section id="buscas" className="saved-section" aria-labelledby="saved-title">
            <div className="section-head">
              <div>
                <p className="eyebrow">Automação</p>
                <h2 id="saved-title">Minhas buscas</h2>
                <p>Salve combinações de filtros e escolha com que frequência elas seriam monitoradas no produto final.</p>
              </div>
              <Button type="button" variant="secondary" icon="plus" onClick={createNewSearch}>Criar nova busca</Button>
            </div>

            {savedSearches.length ? (
              <div className="saved-list">{savedSearches.map((search) => <SavedSearchCard key={search.id} search={search} onEdit={openEditModal} onToggle={toggleSearch} onDelete={deleteSearch} />)}</div>
            ) : (
              <div className="empty-state empty-state--compact">
                <span className="empty-state__icon"><Icon name="settings" size={21} /></span>
                <h3>Nenhuma busca salva ainda</h3>
                <p>Configure seus filtros acima e clique em “Salvar busca” para criar seu primeiro monitoramento.</p>
                <Button type="button" variant="secondary" icon="plus" onClick={createNewSearch}>Criar primeira busca</Button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Modal
        open={saveModalOpen}
        onClose={() => { setSaveModalOpen(false); setEditingSearch(null); }}
        title={editingSearch ? "Editar busca" : "Salvar busca"}
        description={editingSearch ? "Ajuste o nome e a frequência de monitoramento desta busca." : "Defina um nome e escolha como o monitoramento funcionará na versão futura."}
        size="sm"
      >
        <div className="save-modal-form">
          <Input label="Nome da busca" value={draftSearchName} onChange={(event) => setDraftSearchName(event.target.value)} placeholder="Ex.: Front-end Júnior — RJ" autoFocus />
          <fieldset className="frequency-fieldset">
            <legend>Monitoramento automático</legend>
            <div className="frequency-options">
              {monitoringOptions.map((option) => (
                <label className={`frequency-option ${draftFrequency === option.value ? "frequency-option--selected" : ""}`} key={option.value}>
                  <input type="radio" name="monitoring-frequency" value={option.value} checked={draftFrequency === option.value} onChange={() => setDraftFrequency(option.value)} />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="save-modal-note"><Icon name="sparkles" size={15} /><span>O agendamento é visual apenas; nenhum processo automático é executado neste MVP.</span></div>
          <div className="modal-actions">
            <Button type="button" variant="ghost" onClick={() => { setSaveModalOpen(false); setEditingSearch(null); }}>Cancelar</Button>
            <Button type="button" onClick={editingSearch ? confirmEditSearch : confirmSaveSearch}>Salvar</Button>
          </div>
        </div>
      </Modal>

      {toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
