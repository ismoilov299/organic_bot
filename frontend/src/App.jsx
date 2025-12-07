import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { fetchCategories, fetchProducts, media } from './api'
import ProductDetail from './ProductDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  )
}

function HomePage() {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ])
        setCategories(cats)
        setProducts(prods)
      } catch (e) {
        setError(String(e.message || e))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function onSelectCategory(id) {
    setActiveCategory(id)
    setLoading(true)
    setError('')
    try {
      const prods = await fetchProducts(id ? { category: id } : {})
      setProducts(prods)
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh', paddingBottom: 32 }}>
      <div style={{ background: '#fff', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Mahsulotlarni qidirish"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 14px 14px 48px',
                fontSize: 16,
                border: '1px solid #ddd',
                borderRadius: 24,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: '#999' }}>🔍</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px' }}>
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={onSelectCategory}
        />

        {loading && <p style={{ textAlign: 'center' }}>Yuklanmoqda...</p>}
        {error && <p style={{ color: 'crimson', textAlign: 'center' }}>{error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CategoryFilter({ categories, activeCategory, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, overflowX: 'auto', paddingBottom: 8 }}>
      <button onClick={() => onSelect('')} style={btnStyle(activeCategory === '')}>Все</button>
      {categories.map(c => (
        <button key={c.id} onClick={() => onSelect(c.id)} style={btnStyle(activeCategory === c.id)}>
          {c.name}
        </button>
      ))}
    </div>
  )
}

function btnStyle(active) {
  return {
    padding: '8px 16px',
    borderRadius: 20,
    border: 'none',
    background: active ? '#10b981' : '#f3f4f6',
    color: active ? '#fff' : '#374151',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 14,
    whiteSpace: 'nowrap',
    transition: 'all 0.2s'
  }
}

function ProductCard({ product }) {
  const imgUrl = media(product.image)
  
  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: 16, 
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <a href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative' }}>
          {imgUrl ? (
            <img src={imgUrl} alt={product.name} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: 220, background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' }} />
          )}
        </div>
        
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>
            {Number(product.price).toLocaleString()} сум
          </div>
          <h3 style={{ 
            margin: 0, 
            fontSize: 14, 
            fontWeight: 400,
            color: '#333',
            lineHeight: 1.4,
            minHeight: 40,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.name}
          </h3>
        </div>
      </a>
      
      <div style={{ padding: '0 12px 12px' }}>
        {product.telegram_order_link && (
          <a href={product.telegram_order_link} target="_blank" rel="noreferrer" style={buyStyle}>
            Buyurtma berish
          </a>
        )}
      </div>
    </div>
  )
}

const buyStyle = {
  textAlign: 'center',
  padding: '12px',
  borderRadius: 8,
  background: '#10b981',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: 14,
  marginTop: 'auto',
  transition: 'all 0.2s'
}
