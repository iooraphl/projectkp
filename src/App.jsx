"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import { ContactSection, PromoSection, ServicesSection } from "./components/MarketingSections";
import ProductModal from "./components/ProductModal";
import ProductSection from "./components/ProductSection";
import { categories, promos, rimOptions, services } from "./constants/storeData";
import { createWhatsAppLink } from "./utils/whatsapp";
import { formatIDR } from "./utils/format";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "night";
    return window.localStorage.getItem("tire-catalog-theme") || "night";
  });
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeRim, setActiveRim] = useState("Semua Ring");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("tire-catalog-theme", theme);
  }, [theme]);

  const normalizeProduct = (product) => ({
    ...product,
    imageUrl: product.image?.startsWith("/uploads") ? `${API_BASE_URL}${product.image}` : product.image
  });

  const loadProducts = async () => {
    try {
      setProductLoading(true);
      setProductError("");

      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memuat produk");
      }

      setProducts((data.products || []).map(normalizeProduct));
    } catch (error) {
      setProductError(
        error instanceof TypeError
          ? "Tidak bisa memuat produk. Pastikan aplikasi Next.js berjalan."
          : error.message || "Gagal memuat produk"
      );
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const catalogCategories = useMemo(() => {
    const values = products.map((product) => product.category).filter(Boolean);
    return ["Semua", ...Array.from(new Set([...categories.filter((item) => item !== "Semua"), ...values]))];
  }, [products]);

  const catalogRims = useMemo(() => {
    const values = products.map((product) => product.rim).filter(Boolean);
    return ["Semua Ring", ...Array.from(new Set([...rimOptions.filter((item) => item !== "Semua Ring"), ...values]))];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
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
  }, [activeCategory, activeRim, products, search]);

  const openWhatsApp = ({ product = null, intent = "consult" } = {}) => {
    window.open(createWhatsAppLink({ product, intent }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="site-shell">
      <Header theme={theme} setTheme={setTheme} />

      <main>
        <HeroSection
          search={search}
          setSearch={setSearch}
          visibleCount={visibleProducts.length}
          totalCount={products.length}
          onConsult={() => openWhatsApp({ intent: "consult" })}
        />

        <ProductSection
          categories={catalogCategories}
          rimOptions={catalogRims}
          activeCategory={activeCategory}
          activeRim={activeRim}
          setActiveCategory={setActiveCategory}
          setActiveRim={setActiveRim}
          products={visibleProducts}
          onSelectProduct={setSelectedProduct}
          onConsultProduct={(product, intent) => openWhatsApp({ product, intent })}
          formatIDR={formatIDR}
          loading={productLoading}
          error={productError}
        />

        <ServicesSection services={services} />
        <PromoSection promos={promos} />
        <ContactSection onConsult={() => openWhatsApp({ intent: "consult" })} />
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Surya Ban. Katalog ban mobil, MPV, SUV, dan niaga.</p>
      </footer>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConsultProduct={(product, intent) => openWhatsApp({ product, intent })}
        formatIDR={formatIDR}
      />
    </div>
  );
}
