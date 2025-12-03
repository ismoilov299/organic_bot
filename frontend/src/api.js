const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/api/categories/`);
  if (!res.ok) throw new Error('Kategoriya olishda xatolik');
  return res.json();
}

export async function fetchProducts(params = {}) {
  const url = new URL(`${API_BASE}/api/products/`);
  Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) throw new Error('Maxsulotlar olishda xatolik');
  return res.json();
}

export function media(urlPath) {
  if (!urlPath) return null;
  if (urlPath.startsWith('http')) return urlPath;
  // urlPath /media/products/image.jpg shaklida keladi
  const path = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
  return `${API_BASE}${path}`;
}
