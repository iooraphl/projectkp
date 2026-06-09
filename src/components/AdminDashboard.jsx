import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { categories, rimOptions } from '../constants/storeData';
import { formatIDR } from '../utils/format';
import '../styles/admin.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:4000';
const requiredProductFields = new Set(['name', 'brand', 'category', 'price']);

const emptyForm = {
  name: '',
  brand: '',
  category: '',
  price: '',
  size: '',
  width: '',
  profile: '',
  rim: '',
  loadIndex: '',
  speedRating: '',
  vehicleType: '',
  compatibleCars: '',
  character: '',
  condition: 'Baru',
  yearProduction: new Date().getFullYear().toString(),
  warranty: 'Garansi toko 7 hari',
  image: '',
  stock: 'Ready',
  badge: '',
  note: '',
  description: '',
};

const textFields = [
  ['name', 'Nama produk'],
  ['brand', 'Brand'],
  ['category', 'Kategori'],
  ['price', 'Harga'],
  ['size', 'Ukuran'],
  ['rim', 'Ring'],
  ['stock', 'Stok'],
  ['badge', 'Badge'],
  ['width', 'Lebar'],
  ['profile', 'Profil'],
  ['loadIndex', 'Load index'],
  ['speedRating', 'Speed rating'],
  ['vehicleType', 'Tipe kendaraan'],
  ['compatibleCars', 'Mobil cocok'],
  ['condition', 'Kondisi'],
  ['yearProduction', 'Tahun produksi'],
  ['warranty', 'Garansi'],
  ['image', 'URL gambar'],
];

const selectFields = {
  category: categories.filter((category) => category !== 'Semua'),
  rim: rimOptions.filter((rim) => rim !== 'Semua Ring'),
  condition: ['Baru', 'Bekas'],
  stock: ['Ready', 'Pre-order', 'Habis'],
};

const textareaFields = [
  ['character', 'Karakter'],
  ['note', 'Catatan'],
  ['description', 'Deskripsi'],
];

const getImageSrc = (product) => {
  if (!product?.image) return '/images/product-placeholder.svg';
  return product.image.startsWith('/uploads') ? `${API_BASE_URL}${product.image}` : product.image;
};

export default function AdminDashboard({ onProductsChanged }) {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const selectedProduct = useMemo(() => products.find((product) => product.id === selectedId) || null, [products, selectedId]);

  const readJson = async (response) => {
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  };

  const request = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    });
    const data = await readJson(response);

    if (!response.ok) {
      throw new Error(data.message || 'Request gagal');
    }

    return data;
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await request('/api/products');
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const selectProduct = (product) => {
    setSelectedId(product.id);
    setImageFile(null);
    setMessage('');
    setError('');
    setForm({
      ...emptyForm,
      ...Object.fromEntries(Object.entries(product).map(([key, value]) => [key, value ?? ''])),
      price: String(product.price || ''),
    });
  };

  const resetForm = () => {
    setSelectedId('');
    setForm(emptyForm);
    setImageFile(null);
    setMessage('');
    setError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const renderFieldControl = (name) => {
    if (selectFields[name]) {
      return (
        <select name={name} value={form[name]} onChange={handleChange} required={requiredProductFields.has(name)} aria-required={requiredProductFields.has(name)}>
          <option value="">Pilih {name === 'category' ? 'kategori' : name === 'rim' ? 'ring' : name}</option>
          {selectFields[name].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return <input name={name} type={name === 'price' ? 'number' : 'text'} min={name === 'price' ? '0' : undefined} value={form[name]} onChange={handleChange} required={requiredProductFields.has(name)} />;
  };

  const uploadImage = async (productId) => {
    if (!imageFile) return null;

    const body = new FormData();
    body.append('image', imageFile);

    return request(`/api/admin/products/${productId}/image`, {
      method: 'POST',
      body,
    });
  };

  const saveProduct = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const payload = {
        ...form,
        price: Number(form.price),
      };

      const saved = selectedId
        ? await request(`/api/admin/products/${selectedId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          })
        : await request('/api/admin/products', {
            method: 'POST',
            body: JSON.stringify(payload),
          });

      const finalProduct = imageFile ? await uploadImage(saved.id) : saved;

      setMessage(selectedId ? 'Produk berhasil diperbarui.' : 'Produk berhasil dibuat.');
      setSelectedId(finalProduct.id);
      setImageFile(null);
      await loadProducts();
      await onProductsChanged?.();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan produk');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async () => {
    if (!selectedId) return;

    const confirmed = window.confirm('Hapus produk ini?');
    if (!confirmed) return;

    try {
      setSaving(true);
      setError('');
      await request(`/api/admin/products/${selectedId}`, { method: 'DELETE' });
      resetForm();
      await loadProducts();
      await onProductsChanged?.();
      setMessage('Produk berhasil dihapus.');
    } catch (err) {
      setError(err.message || 'Gagal menghapus produk');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <span className="section-kicker">Admin Dashboard</span>
          <h1>Kelola Produk</h1>
        </div>
        <button className="btn btn-primary" type="button" onClick={resetForm}>
          Produk Baru
        </button>
      </div>

      <div className="admin-layout">
        <aside className="admin-list" aria-label="Daftar produk">
          {loading ? (
            <div className="admin-empty">Memuat produk...</div>
          ) : products.length === 0 ? (
            <div className="admin-empty">Belum ada produk.</div>
          ) : (
            products.map((product) => (
              <button className={product.id === selectedId ? 'admin-product active' : 'admin-product'} key={product.id} type="button" onClick={() => selectProduct(product)}>
                <img src={getImageSrc(product)} alt="" />
                <span>
                  <b>{product.name}</b>
                  <small>
                    {product.size || product.category} · {formatIDR(product.price)}
                  </small>
                </span>
              </button>
            ))
          )}
        </aside>

        <form className="admin-form" onSubmit={saveProduct}>
          <div className="admin-form-top">
            <div>
              <h2>{selectedProduct ? 'Edit Produk' : 'Tambah Produk'}</h2>
              <p>{selectedProduct ? selectedProduct.name : 'Masukkan detail ban yang akan tampil di katalog.'}</p>
            </div>
            {selectedId && (
              <button className="btn btn-ghost" type="button" onClick={deleteProduct} disabled={saving}>
                Hapus
              </button>
            )}
          </div>

          {error && <div className="admin-alert error">{error}</div>}
          {message && <div className="admin-alert success">{message}</div>}

          <div className="admin-image-row">
            <img src={imageFile ? URL.createObjectURL(imageFile) : getImageSrc(selectedProduct || form)} alt="" />
            <label>
              Upload gambar
              <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
            </label>
          </div>

          <div className="admin-grid">
            {textFields.map(([name, label]) => (
              <label className="admin-field" key={name}>
                <span className="admin-field-label">
                  {label}
                  <small>{requiredProductFields.has(name) ? 'Wajib' : 'Opsional'}</small>
                </span>
                {renderFieldControl(name)}
              </label>
            ))}
          </div>

          {textareaFields.map(([name, label]) => (
            <label className="admin-field" key={name}>
              {label}
              <textarea name={name} value={form[name]} onChange={handleChange} rows="3" />
            </label>
          ))}

          <button className="btn btn-primary full" type="submit" disabled={saving}>
            {saving ? 'Menyimpan...' : selectedId ? 'Simpan Perubahan' : 'Buat Produk'}
          </button>
        </form>
      </div>
    </section>
  );
}
