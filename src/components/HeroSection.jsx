export default function HeroSection({ search, setSearch, visibleCount, totalCount, onConsult }) {
  const quickSearches = ["185/65 R15", "Avanza", "SUV", "R16"];
  const hasSearch = search.trim().length > 0;

  return (
    <section className="hero">
      <div className="hero-text">
        <div className="hero-badge">Katalog Ban Mobil Ready</div>
        <h1>
          Pilih Ban Mobil <span>Tanpa Bingung.</span>
        </h1>
        <p>
          Cari ban berdasarkan ukuran, ring, tipe mobil, atau merek. Detail produk
          dibuat jelas supaya customer paham ukuran, kecocokan mobil, dan karakter bannya.
        </p>

        <div className="hero-actions">
          <a href="#katalog" className="btn btn-primary">Lihat Katalog</a>
          <button type="button" className="btn btn-ghost" onClick={onConsult}>
            Tanya Ukuran Ban
          </button>
        </div>

        <div className="hero-stats">
          <div>
            <b>{totalCount}</b>
            <span>Produk Ban</span>
          </div>
          <div>
            <b>R13-R18</b>
            <span>Ukuran Ring</span>
          </div>
          <div>
            <b>4</b>
            <span>Tipe Kendaraan</span>
          </div>
        </div>
      </div>

      <aside className="hero-panel">
        <div className="panel-head">
          <h2>Tire Finder</h2>
          <span>{hasSearch ? "Filter aktif" : "Siap cari"}</span>
        </div>

        <label htmlFor="hero-search">Cari merek, ukuran, atau mobil</label>
        <div className="search-box">
          <input
            id="hero-search"
            type="text"
            placeholder="Contoh: Avanza, 185/65 R15, Michelin"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="quick-search">
          {quickSearches.map((item) => (
            <button
              key={item}
              type="button"
              className={search.toLowerCase() === item.toLowerCase() ? "chip active" : "chip"}
              onClick={() => setSearch(item)}
            >
              {item}
            </button>
          ))}
          {hasSearch && (
            <button type="button" className="chip reset" onClick={() => setSearch("")}>
              Reset
            </button>
          )}
        </div>

        <p className="finder-result">
          Menampilkan <strong>{visibleCount}</strong> dari <strong>{totalCount}</strong> produk.
        </p>
        <p className="helper-note">
          Tidak yakin ukuran ban? Cek tulisan di ban lama, contoh 185/65 R15.
        </p>
      </aside>
    </section>
  );
}
