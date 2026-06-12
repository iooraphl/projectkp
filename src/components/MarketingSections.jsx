"use client";

export function ServicesSection({ services }) {
  return (
    <section id="layanan" className="section">
      <div className="section-top">
        <div>
          <span className="section-kicker">Layanan</span>
          <h2>Beli Ban Sekalian Beres</h2>
          <p>Katalog ini dibuat agar customer bisa tanya ukuran dan booking pemasangan lebih cepat.</p>
        </div>
      </div>
      <div className="feature-grid">
        {services.map((service) => (
          <article className="feature-card" key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PromoSection({ promos }) {
  return (
    <section className="section">
      <div className="section-top">
        <div>
          <span className="section-kicker">Info Pembelian</span>
          <h2>Promo & Catatan</h2>
        </div>
      </div>
      <div className="feature-grid">
        {promos.map((promo) => (
          <article key={promo.title} className="feature-card accent">
            <h3>{promo.title}</h3>
            <p>{promo.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ContactSection({ onConsult }) {
  return (
    <section id="kontak" className="section contact-band">
      <div>
        <span className="section-kicker">Kontak</span>
        <h2>Mau cek ukuran ban mobilmu?</h2>
        <p>Kirim ukuran ban lama atau tipe mobilmu, admin bantu rekomendasikan pilihan yang pas.</p>
      </div>
      <button className="btn btn-whatsapp" type="button" onClick={onConsult}>
        Chat WhatsApp
      </button>
    </section>
  );
}
