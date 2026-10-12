import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/api/projects")
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const shown = projects.filter((p) =>
    `${p.title} ${p.techStack ?? ""} ${p.ownerName}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <section className="hero">
        <h1>See what your classmates are building.</h1>
        <p className="muted">Search by project, student or technology.</p>
        <input
          className="search"
          placeholder="Try “React” or a student's name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </section>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading projects…</p>
      ) : shown.length === 0 ? (
        <p className="muted">
          {projects.length === 0 ? "No projects yet. " : "Nothing matches your search. "}
          {projects.length === 0 &&
            (user ? <Link to="/projects/new">Add the first one.</Link> : <Link to="/register">Create an account to add the first one.</Link>)}
        </p>
      ) : (
        <div className="grid">
          {shown.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </>
  );
}
