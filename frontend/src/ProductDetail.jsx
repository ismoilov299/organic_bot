import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProducts, media } from './api'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const products = await fetchProducts()
        const found = products.find(p => p.id === parseInt(id))
        if (!found) {
          setError('Mahsulot topilmadi')
        } else {
          setProduct(found)
        }
      } catch (e) {
        setError(String(e.message || e))
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) {
    return (
      <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 16, textAlign: 'center' }}>
        Yuklanmoqda...
      </div>
    )
  }

  if (error || !product) {
    return (
      <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 16 }}>
        <button onClick={() => navigate('/')} style={backButtonStyle}>← Orqaga</button>
        <p style={{ color: 'crimson', textAlign: 'center', marginTop: 32 }}>{error || 'Mahsulot topilmadi'}</p>
      </div>
    )
  }

  const imgUrl = media(product.image)

  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh', paddingBottom: 32 }}>
      <div style={{ background: '#fff', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <button onClick={() => navigate('/')} style={backButtonStyle}>← Orqaga</button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px' }}>
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {imgUrl ? (
            <img src={imgUrl} alt={product.name} style={{ width: '100%', maxHeight: 500, objectFit: 'contain', background: '#f9fafb' }} />
          ) : (
            <div style={{ width: '100%', height: 400, background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' }} />
          )}
          
          <div style={{ padding: 24 }}>
            <h1 style={{ margin: '0 0 16px 0', fontSize: 24, fontWeight: 600, color: '#111' }}>
              {product.name}
            </h1>
            
            <div style={{ fontSize: 32, fontWeight: 700, color: '#111', marginBottom: 16 }}>
              {Number(product.price).toLocaleString()} сум
            </div>
            
            {product.description && (
              <div style={{ 
                marginBottom: 24, 
                color: '#555', 
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                fontSize: 15
              }}>
                {product.description}
              </div>
            )}
            
            {product.telegram_order_link && (
              <a href={product.telegram_order_link} target="_blank" rel="noreferrer" style={buyButtonStyle}>
                Buyurtma berish
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const backButtonStyle = {
  background: 'transparent',
  border: 'none',
  fontSize: 16,
  fontWeight: 500,
  color: '#10b981',
  cursor: 'pointer',
  padding: '8px 0'
}

const buyButtonStyle = {
  display: 'block',
  textAlign: 'center',
  padding: '14px',
  borderRadius: 8,
  background: '#10b981',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: 16,
  transition: 'all 0.2s'
}
