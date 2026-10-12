import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.email, form.password);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="panel form" onSubmit={submit}>
      <h2>Log in</h2>
      {error && <p className="error">{error}</p>}
      <label>Email<input type="email" required value={form.email} onChange={set("email")} /></label>
      <label>Password<input type="password" required value={form.password} onChange={set("password")} /></label>
      <button className="btn" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
      <p className="muted small">New here? <Link to="/register">Create an account</Link></p>
    </form>
  );
}
