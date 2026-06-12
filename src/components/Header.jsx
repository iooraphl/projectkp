"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function Header({ theme, setTheme }) {
  const { isAdmin, isAuthenticated, logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="nav">
      <Link className="nav-logo" href="/">
        <span className="logo-mark">SB</span>
        <span>Surya Ban</span>
      </Link>

      <nav className="nav-menu" aria-label="Navigasi utama">
        <Link href="/#katalog">Katalog</Link>
        <Link href="/#layanan">Layanan</Link>
        <Link href="/#kontak">Kontak</Link>
        {isAdmin && <Link href="/admin">Admin</Link>}
      </nav>

      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <Link className="nav-auth-link" href="/profile">
              {user?.name || "Profil"}
            </Link>
            <button className="nav-auth-btn" type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="nav-auth-link" href="/login">
              Login
            </Link>
            <Link className="nav-auth-btn" href="/register">
              Daftar
            </Link>
          </>
        )}

        <button
          className="nav-icon-btn"
          type="button"
          onClick={() => setTheme((prev) => (prev === "light" ? "night" : "light"))}
          aria-label="Ganti tema"
        >
          {theme === "light" ? "Night" : "Light"}
        </button>
      </div>
    </header>
  );
}
