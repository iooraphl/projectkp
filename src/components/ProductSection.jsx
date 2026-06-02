export default function ProductSection({
  categories,
  rimOptions,
  activeCategory,
  activeRim,
  setActiveCategory,
  setActiveRim,
  products,
  onSelectProduct,
  onConsultProduct,
  formatIDR
}) {
  return (
    <section id="katalog" className="section catalog-section">
      <div className="section-top">
        <div>
          <span className="section-kicker">Katalog Produk</span>
          <h2>Ban Mobil Pilihan</h2>
          <p>Pilih berdasarkan tipe mobil dan ukuran ring. Klik detail untuk melihat spesifikasi lengkap.</p>
        </div>
      </div>

      <div className="filter-toolbar">
        <div className="filter-group" aria-label="Filter kategori kendaraan">
          {categories.map((category) => (
            <button
              key={category}
              className={category === activeCategory ? "filter-btn active" : "filter-btn"}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="filter-group" aria-label="Filter ukuran ring">
          {rimOptions.map((rim) => (
            <button
              key={rim}
              className={rim === activeRim ? "filter-btn active" : "filter-btn"}
              onClick={() => setActiveRim(rim)}
              type="button"
            >
              {rim}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">Produk tidak ditemukan. Coba ukuran atau tipe kendaraan lain.</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <span className="card-badge">{product.badge}</span>
              <div className="product-media">
                <img className="product-thumb" src={product.image} alt={product.name} loading="lazy" />
              </div>
              <div className="product-info">
                <span className="product-cat">{product.category}</span>
                <h3>{product.name}</h3>
                <p className="product-size">{product.size}</p>
                <p className="price">{formatIDR(product.price)} <small>/ pcs</small></p>
                <div className="spec-pills">
                  <span>{product.rim}</span>
                  <span>{product.vehicleType}</span>
                  <span>{product.stock}</span>
                </div>
              </div>
              <div className="product-actions">
                <button type="button" className="btn btn-ghost" onClick={() => onSelectProduct(product)}>
                  Detail
                </button>
                <button type="button" className="btn btn-primary" onClick={() => onConsultProduct(product)}>
                  Tanya Ban
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
