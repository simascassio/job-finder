import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import type { JobSearch, MonitoringFrequency } from "../../types";
import "./SavedSearchCard.css";

const frequencyLabels: Record<MonitoringFrequency, string> = {
  off: "Monitoramento desativado",
  daily: "Monitoramento diário",
  "twice-daily": "Monitoramento 2× ao dia",
  "three-times-daily": "Monitoramento 3× ao dia",
};

interface Props {
  search: JobSearch;
  onEdit: (search: JobSearch) => void;
  onToggle: (search: JobSearch) => void;
  onDelete: (search: JobSearch) => void;
}

export function SavedSearchCard({ search, onEdit, onToggle, onDelete }: Props) {
  const { filters } = search;

  return (
    <article className="saved-search-card">
      <div className="saved-search-card__main">
        <div className="saved-search-card__icon"><Icon name="search" size={17} /></div>
        <div className="saved-search-card__body">
          <div className="saved-search-card__title-row">
            <h3>{search.name}</h3>
            <span className={`monitoring-badge ${search.monitoringEnabled ? "monitoring-badge--on" : ""}`}>
              <span className="monitoring-badge__dot" /> {search.monitoringEnabled ? frequencyLabels[search.monitoringFrequency] : frequencyLabels.off}
            </span>
          </div>
          <p>{filters.technologies.length ? filters.technologies.join(" · ") : "Sem tecnologias específicas"}</p>
          <span className="saved-search-card__location">{filters.location || "Qualquer localização"} · {filters.workMode}</span>
        </div>
      </div>
      <div className="saved-search-card__actions">
        <Button type="button" size="sm" variant="secondary" icon="edit" onClick={() => onEdit(search)}>Editar</Button>
        <Button type="button" size="sm" variant="ghost" icon={search.monitoringEnabled ? "pause" : "play"} onClick={() => onToggle(search)}>
          {search.monitoringEnabled ? "Pausar" : "Ativar"}
        </Button>
        <Button type="button" size="sm" variant="danger" icon="trash" onClick={() => onDelete(search)}>Excluir</Button>
      </div>
    </article>
  );
}
