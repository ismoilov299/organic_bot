const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

// Simple cache
const cache = {
  categories: null,
  products: null,
  timestamp: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 daqiqa

export async function fetchCategories() {
  if (cache.categories && cache.timestamp && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.categories;
  }
  
  const res = await fetch(`${API_BASE}/api/categories/`);
  if (!res.ok) throw new Error('Kategoriya olishda xatolik');
  const data = await res.json();
  
  cache.categories = data;
  if (!cache.timestamp) cache.timestamp = Date.now();
  
  return data;
}

export async function fetchProducts(params = {}) {
  const hasParams = Object.keys(params).length > 0;
  
  if (!hasParams && cache.products && cache.timestamp && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.products;
  }
  
  const url = new URL(`${API_BASE}/api/products/`);
  Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) throw new Error('Maxsulotlar olishda xatolik');
  const data = await res.json();
  
  if (!hasParams) {
    cache.products = data;
    cache.timestamp = Date.now();
  }
  
  return data;
}

export function media(urlPath) {
  if (!urlPath) return null;
  if (urlPath.startsWith('http')) return urlPath;
  // urlPath /media/products/image.jpg shaklida keladi
  const path = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
  return `${API_BASE}${path}`;
}
