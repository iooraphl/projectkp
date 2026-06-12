"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, error, setError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);

    if (result.success) {
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <section className="auth-rail" aria-label="Surya Ban">
        <span className="auth-logo">SB</span>
        <h1>Surya Ban</h1>
        <p>Masuk untuk melihat profil dan melanjutkan pesanan dengan akun pelanggan.</p>
      </section>

      <div className="auth-card">
        <div className="auth-heading">
          <span>Selamat datang</span>
          <h2>Login</h2>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Belum punya akun? <Link href="/register">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}
