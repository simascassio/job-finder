import { Icon } from "../Icon/Icon";
import type { Job } from "../../types";
import "./SearchCard.css";

export function SearchCard({ job }: { job: Job }) {
  return (
    <article className="job-card">
      <div className="job-card__top">
        <div className="job-card__company-logo" aria-hidden="true">{job.company.slice(0, 1)}</div>
        <div className="job-card__match"><span>{job.compatibility}%</span> compatível</div>
      </div>
      <div className="job-card__content">
        <h3>{job.title}</h3>
        <p className="job-card__company">{job.company}</p>
        <div className="job-card__meta">
          <span><Icon name="search" size={15} /> {job.location}</span>
          <span>{job.workMode}</span>
          <span>{job.contractType}</span>
        </div>
        <p className={`job-card__salary ${job.salary ? "" : "job-card__salary--muted"}`}>{job.salary ?? "Salário não informado"}</p>
        <div className="job-card__tags">{job.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
      </div>
      <div className="job-card__bottom">
        <span className="job-card__date">Publicada em {new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(job.publishedAt))}</span>
        <a className="job-card__link" href={job.url} onClick={(event) => { if (job.url === "#") event.preventDefault(); }}>
          Ver vaga <Icon name="arrow-left" size={15} style={{ transform: "rotate(180deg)" }} />
        </a>
      </div>
    </article>
  );
}
