import React, { useEffect, useState } from 'react'
import { fetchCategories, fetchProducts, media } from './api'

export default function App() {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 16, maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 16 }}>Online Katalog</h1>
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelect={onSelectCategory}
      />

      {loading && <p>Yuklanmoqda...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

function CategoryFilter({ categories, activeCategory, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
      <button onClick={() => onSelect('')} style={btnStyle(activeCategory === '')}>Barchasi</button>
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
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #ddd',
    background: active ? 'rgb(34, 197, 94)' : '#fff',
    color: active ? '#fff' : '#111',
    cursor: 'pointer'
  }
}

function ProductCard({ product }) {
  const imgUrl = media(product.image)
  console.log('Product:', product.name, 'Image:', product.image, 'URL:', imgUrl)
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {imgUrl ? (
        <img src={imgUrl} alt={product.name} style={{ width: '100%', height: 500, objectFit: 'cover', borderRadius: 8, background: '#f9fafb' }} />
      ) : (
        <div style={{ width: '100%', height: 500, background: '#f4f4f5', borderRadius: 8 }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>{product.name}</h3>
        <strong>{Number(product.price).toLocaleString()} so'm</strong>
      </div>
      <p style={{ margin: 0, color: '#555', whiteSpace: 'pre-line' }}>{product.description}</p>
      {product.telegram_order_link && (
        <a href={product.telegram_order_link} target="_blank" rel="noreferrer" style={buyStyle}>Sotib olish (Telegram)</a>
      )}
    </div>
  )
}

const buyStyle = {
  textAlign: 'center',
  padding: '10px 12px',
  borderRadius: 8,
  background: '#22c55e',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 600
}
