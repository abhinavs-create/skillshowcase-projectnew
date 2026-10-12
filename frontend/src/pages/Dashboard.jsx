import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import ProjectCard from "../components/ProjectCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    Promise.all([api("/api/projects/mine"), api("/api/skills")])
      .then(([p, s]) => { setProjects(p); setSkills(s); })
      .catch((e) => setError(e.message));

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api(`/api/projects/${id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h2>Welcome back, {user.name}</h2>
      <div className="stats">
        <div className="stat"><b>{projects.length}</b><span>projects</span></div>
        <div className="stat"><b>{skills.length}</b><span>skills</span></div>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="row">
        <h3>My projects</h3>
        <Link className="btn small" to="/projects/new">Add project</Link>
      </div>
      {projects.length === 0 ? (
        <p className="muted">You haven't added a project yet. <Link to="/projects/new">Add your first project.</Link></p>
      ) : (
        <div className="grid">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p}>
              <div className="actions">
                <Link className="btn small ghost" to={`/projects/${p.id}/edit`}>Edit</Link>
                <button className="btn small danger" onClick={() => remove(p.id)}>Delete</button>
              </div>
            </ProjectCard>
          ))}
        </div>
      )}

      <div className="row">
        <h3>My skills</h3>
        <Link className="btn small ghost" to="/profile">Manage skills</Link>
      </div>
      {skills.length === 0 ? (
        <p className="muted">No skills listed yet. <Link to="/profile">Add your skills.</Link></p>
      ) : (
        <div className="tags">
          {skills.map((s) => <span key={s.id} className="tag">{s.name} · {s.level}</span>)}
        </div>
      )}
    </>
  );
}
