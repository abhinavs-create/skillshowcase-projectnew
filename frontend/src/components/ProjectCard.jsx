const isWebLink = (u) => /^https?:\/\//i.test(u || "");

export default function ProjectCard({ project: p, children }) {
  const tags = (p.techStack || "").split(",").map((t) => t.trim()).filter(Boolean);
  return (
    <article className="card">
      <h3>{p.title}</h3>
      <p className="muted small">by {p.ownerName}</p>
      <p className="desc">{p.description}</p>
      {tags.length > 0 && (
        <div className="tags">
          {tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      )}
      <div className="links">
        {isWebLink(p.githubLink) && <a href={p.githubLink} target="_blank" rel="noreferrer">GitHub</a>}
        {isWebLink(p.liveLink) && <a href={p.liveLink} target="_blank" rel="noreferrer">Live demo</a>}
      </div>
      {children}
    </article>
  );
}
