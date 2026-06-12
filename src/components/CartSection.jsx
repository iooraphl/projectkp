"use client";

export default function CartSection({
  cart,
  subtotal,
  serviceFee,
  paymentFee,
  grandTotal,
  updateQty,
  removeFromCart,
  formatIDR
}) {
  return (
    <section id="checkout" className="section checkout-wrap">
      <div className="checkout-grid">
        <div>
          <div className="section-head">
            <h3>Keranjang Belanja</h3>
            <p>Atur jumlah produk sebelum lanjut checkout.</p>
          </div>
          <div className="cart-list">
            {cart.length === 0 && (
              <p className="muted cart-empty">
                Keranjang masih kosong. Tambahkan produk dari katalog.
              </p>
            )}
            {cart.map((item) => (
              <article key={item.id} className="card cart-item">
                <div>
                  <h4>{item.name}</h4>
                  <p className="muted">
                    {item.size} | {formatIDR(item.price)}
                  </p>
                </div>
                <div className="qty-box">
                  <button onClick={() => updateQty(item.id, "dec")}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, "inc")}>+</button>
                </div>
                <button
                  className="btn btn-ghost mini"
                  onClick={() => removeFromCart(item.id)}
                >
                  Hapus
                </button>
              </article>
            ))}
          </div>
        </div>

        <aside className="checkout-summary">
          <h4>Ringkasan Belanja</h4>
          <p>
            Subtotal <strong>{formatIDR(subtotal)}</strong>
          </p>
          <p>
            Biaya layanan <strong>{formatIDR(serviceFee)}</strong>
          </p>
          <p>
            Biaya pembayaran <strong>{formatIDR(paymentFee)}</strong>
          </p>
          <p className="total-line">
            Total <strong>{formatIDR(grandTotal)}</strong>
          </p>
        </aside>
      </div>
    </section>
  );
}
