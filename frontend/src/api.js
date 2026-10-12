// One helper for every call to the Spring Boot backend.
const BASE = "http://localhost:8080";

export async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  const isAuthCall = path.startsWith("/api/auth");
  if (token && !isAuthCall) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Check that the backend is running on port 8080.");
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (res.status === 401 && token && !isAuthCall) {
    // token expired or invalid: log out and go to the login page
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}
