"use client";

function SpecRow({ label, value }) {
  return (
    <div className="spec-row">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

export default function ProductModal({ product, onClose, onConsultProduct, formatIDR }) {
  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Tutup modal">
          x
        </button>

        <div className="modal-grid">
          <div className="modal-media">
            <img
              src={product.imageUrl || product.image || "/images/product-placeholder.svg"}
              alt={product.name}
              loading="lazy"
            />
          </div>

          <div className="modal-info">
            <span className="card-badge modal-badge">{product.badge}</span>
            <h2>{product.name}</h2>
            <p className="modal-subtitle">{product.character}</p>
            <p className="stock-line modal-stock-line">
              Stok: <strong>{product.stock}</strong>
            </p>
            <p className="modal-price">{formatIDR(product.price)} <small>/ pcs</small></p>

            <div className="spec-columns">
              <div>
                <h4>Spesifikasi Ban</h4>
                <SpecRow label="Ukuran" value={product.size} />
                <SpecRow label="Lebar" value={product.width} />
                <SpecRow label="Profil" value={product.profile} />
                <SpecRow label="Ring" value={product.rim} />
                <SpecRow label="Load Index" value={product.loadIndex} />
                <SpecRow label="Speed Rating" value={product.speedRating} />
              </div>
              <div>
                <h4>Kecocokan</h4>
                <SpecRow label="Tipe Mobil" value={product.vehicleType} />
                <SpecRow label="Mobil Cocok" value={product.compatibleCars} />
                <SpecRow label="Kondisi" value={product.condition} />
                <SpecRow label="Produksi" value={product.yearProduction} />
                <SpecRow label="Garansi" value={product.warranty} />
                <SpecRow label="Stok" value={product.stock} />
              </div>
            </div>

            <div className="note-box">
              <b>Catatan:</b> {product.note}
            </div>

            <button
              className="btn btn-primary full"
              type="button"
              onClick={() => onConsultProduct(product, "checkout")}
            >
              Checkout via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
