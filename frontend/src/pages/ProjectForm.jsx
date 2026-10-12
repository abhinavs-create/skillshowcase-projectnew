import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api";

const empty = { title: "", description: "", techStack: "", githubLink: "", liveLink: "" };

// Used for both "add project" (no id in the URL) and "edit project" (id in the URL).
export default function ProjectForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (!id) return;
    api("/api/projects/mine")
      .then((list) => {
        const p = list.find((x) => String(x.id) === id);
        if (!p) return setError("Project not found");
        setForm({
          title: p.title,
          description: p.description,
          techStack: p.techStack ?? "",
          githubLink: p.githubLink ?? "",
          liveLink: p.liveLink ?? "",
        });
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api(id ? `/api/projects/${id}` : "/api/projects", {
        method: id ? "PUT" : "POST",
        body: form,
      });
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form className="panel form wide" onSubmit={submit}>
      <h2>{id ? "Edit project" : "Add a project"}</h2>
      {error && <p className="error">{error}</p>}
      <label>Title<input required value={form.title} onChange={set("title")} /></label>
      <label>What does it do?
        <textarea required rows={5} maxLength={2000} value={form.description} onChange={set("description")} />
      </label>
      <label>Technologies (separate with commas)
        <input placeholder="Java, Spring Boot, React" value={form.techStack} onChange={set("techStack")} />
      </label>
      <label>GitHub link<input type="url" placeholder="https://github.com/..." value={form.githubLink} onChange={set("githubLink")} /></label>
      <label>Live demo link<input type="url" placeholder="https://..." value={form.liveLink} onChange={set("liveLink")} /></label>
      <div className="actions">
        <button className="btn" disabled={busy}>{busy ? "Saving…" : "Save project"}</button>
        <Link className="btn ghost" to="/dashboard">Cancel</Link>
      </div>
    </form>
  );
}
