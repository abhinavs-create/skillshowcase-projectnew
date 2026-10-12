import { useEffect, useState } from "react";
import { api } from "../api";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", department: "", bio: "" });
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState({ name: "", level: "Beginner" });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const loadSkills = () => api("/api/skills").then(setSkills).catch((e) => setError(e.message));

  useEffect(() => {
    api("/api/profile")
      .then((p) => setProfile({ ...p, department: p.department ?? "", bio: p.bio ?? "" }))
      .catch((e) => setError(e.message));
    loadSkills();
  }, []);

  const set = (k) => (e) => { setSaved(false); setProfile({ ...profile, [k]: e.target.value }); };

  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api("/api/profile", {
        method: "PUT",
        body: { name: profile.name, department: profile.department, bio: profile.bio },
      });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const addSkill = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api("/api/skills", { method: "POST", body: skill });
      setSkill({ name: "", level: "Beginner" });
      loadSkills();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeSkill = async (id) => {
    try {
      await api(`/api/skills/${id}`, { method: "DELETE" });
      loadSkills();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h2>Your profile</h2>
      {error && <p className="error">{error}</p>}

      <form className="panel form wide" onSubmit={saveProfile}>
        <label>Full name<input required value={profile.name} onChange={set("name")} /></label>
        <label>Email<input value={profile.email} disabled /></label>
        <label>Department<input value={profile.department} onChange={set("department")} /></label>
        <label>Short bio
          <textarea rows={3} maxLength={500} value={profile.bio} onChange={set("bio")} />
        </label>
        <div className="actions">
          <button className="btn">Save changes</button>
          {saved && <span className="ok">Saved</span>}
        </div>
      </form>

      <h3>Skills</h3>
      {skills.length === 0 ? (
        <p className="muted">No skills yet. Add one below.</p>
      ) : (
        <div className="tags">
          {skills.map((s) => (
            <span key={s.id} className="tag">
              {s.name} · {s.level}
              <button className="x" aria-label={`Remove ${s.name}`} onClick={() => removeSkill(s.id)}>×</button>
            </span>
          ))}
        </div>
      )}
      <form className="inline-form" onSubmit={addSkill}>
        <input required placeholder="Skill, e.g. Java" value={skill.name} onChange={(e) => setSkill({ ...skill, name: e.target.value })} />
        <select value={skill.level} onChange={(e) => setSkill({ ...skill, level: e.target.value })}>
          {LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <button className="btn small">Add skill</button>
      </form>
    </>
  );
}
