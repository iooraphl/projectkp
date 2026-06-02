import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import { ContactSection, PromoSection, ServicesSection } from "./components/MarketingSections";
import ProductModal from "./components/ProductModal";
import ProductSection from "./components/ProductSection";
import { categories, promos, rimOptions, services, tireProducts, whatsappNumber } from "./constants/storeData";
import { formatIDR } from "./utils/format";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("tire-catalog-theme") || "night");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeRim, setActiveRim] = useState("Semua Ring");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tire-catalog-theme", theme);
  }, [theme]);

  const visibleProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return tireProducts.filter((product) => {
      const passCategory = activeCategory === "Semua" || product.category === activeCategory;
      const passRim = activeRim === "Semua Ring" || product.rim === activeRim;
      const searchable = [
        product.name,
        product.brand,
        product.size,
        product.category,
        product.compatibleCars,
        product.character
      ].join(" ").toLowerCase();
      const passSearch = !keyword || searchable.includes(keyword);

      return passCategory && passRim && passSearch;
    });
  }, [activeCategory, activeRim, search]);

  const openWhatsApp = (product) => {
    const message = product
      ? `Halo Surya Ban, saya mau tanya ${product.name} ukuran ${product.size}. Cocok untuk mobil saya?`
      : "Halo Surya Ban, saya mau konsultasi pilihan ban mobil.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="site-shell">
      <Header theme={theme} setTheme={setTheme} />

      <main>
        <HeroSection
          search={search}
          setSearch={setSearch}
          visibleCount={visibleProducts.length}
          totalCount={tireProducts.length}
          onConsult={() => openWhatsApp(null)}
        />

        <ProductSection
          categories={categories}
          rimOptions={rimOptions}
          activeCategory={activeCategory}
          activeRim={activeRim}
          setActiveCategory={setActiveCategory}
          setActiveRim={setActiveRim}
          products={visibleProducts}
          onSelectProduct={setSelectedProduct}
          onConsultProduct={openWhatsApp}
          formatIDR={formatIDR}
        />

        <ServicesSection services={services} />
        <PromoSection promos={promos} />
        <ContactSection onConsult={() => openWhatsApp(null)} />
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Surya Ban. Katalog ban mobil, MPV, SUV, dan niaga.</p>
      </footer>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConsultProduct={openWhatsApp}
        formatIDR={formatIDR}
      />
    </div>
  );
}
