import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header({ theme, setTheme }) {
  const { isAdmin, isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="nav">
      <Link className="nav-logo" to="/">
        <span className="logo-mark">SB</span>
        <span>Surya Ban</span>
      </Link>

      <nav className="nav-menu" aria-label="Navigasi utama">
        <Link to="/#katalog">Katalog</Link>
        <Link to="/#layanan">Layanan</Link>
        <Link to="/#kontak">Kontak</Link>
        {isAdmin && <Link to="/admin">Admin</Link>}
      </nav>

      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <Link className="nav-auth-link" to="/profile">
              {user?.name || "Profil"}
            </Link>
            <button className="nav-auth-btn" type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="nav-auth-link" to="/login">
              Login
            </Link>
            <Link className="nav-auth-btn" to="/register">
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
