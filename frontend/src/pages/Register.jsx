import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="panel form" onSubmit={submit}>
      <h2>Create your account</h2>
      {error && <p className="error">{error}</p>}
      <label>Full name<input required value={form.name} onChange={set("name")} /></label>
      <label>Email<input type="email" required value={form.email} onChange={set("email")} /></label>
      <label>Department<input placeholder="e.g. Computer Science" value={form.department} onChange={set("department")} /></label>
      <label>Password (6+ characters)<input type="password" required minLength={6} value={form.password} onChange={set("password")} /></label>
      <button className="btn" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
      <p className="muted small">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
