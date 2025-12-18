import React, { useEffect, useState, createContext, useContext } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { fetchCategories, fetchProducts, media } from './api'
import ProductDetail from './ProductDetail'

// Savatcha Context
const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export default function App() {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(prev => prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ))
    }
  }

  const clearCart = () => setCart([])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </CartContext.Provider>
  )
}

function HomePage() {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const { cartCount } = useCart()

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

  const [visibleCount, setVisibleCount] = useState(20)

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length

  const loadMore = () => {
    setVisibleCount(prev => prev + 20)
  }

  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh', paddingBottom: 32 }}>
      <div style={{ background: '#fff', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/cart" style={{ textDecoration: 'none', position: 'relative', flexShrink: 0 }}>
            <div style={{ fontSize: 28, color: '#333' }}>🛒</div>
            {cartCount > 0 && (
              <div style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: 'rgba(47, 88, 74, 1)',
                color: '#fff',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600
              }}>
                {cartCount}
              </div>
            )}
          </Link>
          <div style={{ position: 'relative', flex: 1 }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
          {visibleProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        
        {hasMore && (
          <div style={{ textAlign: 'center', padding: 16 }}>
            <button onClick={loadMore} style={{
              padding: '12px 32px',
              borderRadius: 8,
              border: 'none',
              background: 'rgba(47, 88, 74, 1)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14
            }}>
              Yana yuklash ({filteredProducts.length - visibleCount})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function CategoryFilter({ categories, activeCategory, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, overflowX: 'auto', paddingBottom: 8 }}>
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
    padding: '8px 16px',
    borderRadius: 20,
    border: 'none',
    background: active ? 'rgba(47, 88, 74, 1)' : '#f3f4f6',
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
  const { addToCart } = useCart()
  
  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: 16, 
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative' }}>
          {imgUrl ? (
            <img 
              src={imgUrl} 
              alt={product.name} 
              loading="lazy"
              style={{ width: '100%', height: 220, objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ width: '100%', height: 220, background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' }} />
          )}
          {product.video_url && (
            <a 
              href={product.video_url} 
              target="_blank" 
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '2px solid white',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 0, 0, 0.9)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </a>
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
      </Link>
      
      <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button 
          onClick={() => addToCart(product)}
          style={{
            ...buyStyle,
            background: 'rgba(47, 88, 74, 1)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Savatga qo'shish
        </button>
        {product.telegram_order_link && (
          <a href={product.telegram_order_link} target="_blank" rel="noreferrer" style={{
            ...buyStyle,
            background: '#f3f4f6',
            color: '#374151'
          }}>
            Buyurtma berish
          </a>
        )}
      </div>
    </div>
  )
}

// Telegram buyurtma linkini yaratish
function generateTelegramOrderLink(cart, total) {
  let message = 'Assalomu alaykum men ushbu buyumlarni buyurtma qilmoqchi edim:\n\n'
  
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`
    message += `   Narxi: ${Number(item.price).toLocaleString()} so'm\n`
    message += `   Miqdori: ${item.quantity} ta\n`
    message += `   Jami: ${(item.price * item.quantity).toLocaleString()} so'm\n\n`
  })
  
  message += `*Umumiy summa: ${total.toLocaleString()} so'm*`
  
  const telegramUsername = 'Organic_store_admini'
  const encodedMessage = encodeURIComponent(message)
  
  return `https://t.me/${telegramUsername}?text=${encodedMessage}`
}

const buyStyle = {
  textAlign: 'center',
  padding: '12px',
  borderRadius: 8,
  background: 'rgba(47, 88, 74, 1)',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: 14,
  marginTop: 'auto',
  transition: 'all 0.2s',
  display: 'block'
}

// Savatcha sahifasi
function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount } = useCart()
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh', paddingBottom: 32 }}>
      <div style={{ background: '#fff', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'rgba(47, 88, 74, 1)', fontWeight: 500, fontSize: 16 }}>
            ← Orqaga
          </Link>
          <h1 style={{ margin: 0, fontSize: 20 }}>Savat ({cartCount})</h1>
          {cart.length > 0 && (
            <button onClick={clearCart} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 500 }}>
              Tozalash
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px' }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, background: '#fff', borderRadius: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
            <p style={{ color: '#666', marginBottom: 24 }}>Savatingiz bo'sh</p>
            <Link to="/" style={{ ...buyStyle, display: 'inline-block', textDecoration: 'none' }}>
              Xarid qilishni boshlash
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 16 }}>
              {cart.map(item => (
                <CartItem key={item.id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
              ))}
            </div>
            
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 18, fontWeight: 600 }}>Jami:</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#111' }}>
                  {total.toLocaleString()} сум
                </span>
              </div>
              <a 
                href={generateTelegramOrderLink(cart, total)}
                target="_blank"
                rel="noreferrer"
                style={{
                  ...buyStyle,
                  width: '100%',
                  padding: '16px',
                  fontSize: 16,
                  textDecoration: 'none'
                }}
              >
                Buyurtma berish
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CartItem({ item, updateQuantity, removeFromCart }) {
  const imgUrl = media(item.image)
  
  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: 16, 
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      height: '100%'
    }}>
      {imgUrl ? (
        <img src={imgUrl} alt={item.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }} />
      ) : (
        <div style={{ width: '100%', height: 180, background: '#f3f4f6', borderRadius: 8 }} />
      )}
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{item.name}</h3>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>
          {Number(item.price).toLocaleString()} сум
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: '1px solid #ddd',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            -
          </button>
          <span style={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: '1px solid #ddd',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            +
          </button>
          <button 
            onClick={() => removeFromCart(item.id)}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: 20
            }}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
