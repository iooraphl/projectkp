import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Login from "./components/Login";
import { ContactSection, PromoSection, ServicesSection } from "./components/MarketingSections";
import ProductModal from "./components/ProductModal";
import ProductSection from "./components/ProductSection";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import { categories, promos, rimOptions, services, whatsappNumber } from "./constants/storeData";
import { useAuth } from "./contexts/AuthContext";
import { formatIDR } from "./utils/format";

export default function App() {
  const { isAuthenticated } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000";
  const [theme, setTheme] = useState(() => localStorage.getItem("tire-catalog-theme") || "night");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeRim, setActiveRim] = useState("Semua Ring");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tire-catalog-theme", theme);
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
          ? "Tidak bisa memuat produk. Pastikan backend berjalan."
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

  const openWhatsApp = (product) => {
    const message = product
      ? `Halo Surya Ban, saya mau tanya ${product.name} ukuran ${product.size}. Cocok untuk mobil saya?`
      : "Halo Surya Ban, saya mau konsultasi pilihan ban mobil.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const catalogPage = (
    <>
      <HeroSection
          search={search}
          setSearch={setSearch}
          visibleCount={visibleProducts.length}
          totalCount={products.length}
          onConsult={() => openWhatsApp(null)}
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
          onConsultProduct={openWhatsApp}
          formatIDR={formatIDR}
          loading={productLoading}
          error={productError}
        />

      <ServicesSection services={services} />
      <PromoSection promos={promos} />
      <ContactSection onConsult={() => openWhatsApp(null)} />
    </>
  );

  return (
    <div className="site-shell">
      <Header theme={theme} setTheme={setTheme} />

      <main>
        <Routes>
          <Route path="/" element={catalogPage} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard onProductsChanged={loadProducts} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
