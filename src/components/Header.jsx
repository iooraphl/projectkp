export default function Header({ theme, setTheme }) {
  return (
    <header className="nav">
      <a className="nav-logo" href="/">
        <span className="logo-mark">SB</span>
        <span>Surya Ban</span>
      </a>

      <nav className="nav-menu" aria-label="Navigasi utama">
        <a href="#katalog">Katalog</a>
        <a href="#layanan">Layanan</a>
        <a href="#kontak">Kontak</a>
      </nav>

      <button
        className="nav-icon-btn"
        type="button"
        onClick={() => setTheme((prev) => (prev === "light" ? "night" : "light"))}
        aria-label="Ganti tema"
      >
        {theme === "light" ? "Night" : "Light"}
      </button>
    </header>
  );
}
