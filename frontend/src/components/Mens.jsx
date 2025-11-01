import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../services/api'

function Mens() {
  const navigate = useNavigate()
  const [mensClothing, setMensClothing] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch men's products from backend
  useEffect(() => {
    const fetchMensProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products/category/men`)
        const data = await response.json()
        
        if (data.success) {
          // Get first 5 products for home page
          setMensClothing(data.data.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching mens products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMensProducts()
  }, [])

  return (
    <section className="py-20 px-4 md:px-16 lg:px-24 xl:px-32 bg-slate-100">
      <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">Men's Clothing</h1>
      <p className="text-slate-600 mb-10 text-center">Upgrade your wardrobe with our premium collection</p>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : mensClothing.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No men's products available yet.</p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-6">
          {mensClothing.map((item) => (
            <div key={item.id} className="group w-56 cursor-pointer">
              <div 
                onClick={() => navigate(`/product/${item.id}`)}
                className="overflow-hidden rounded-lg"
              >
                <img 
                  className="rounded-lg w-full group-hover:shadow-xl group-hover:scale-110 duration-300 transition-all h-72 object-cover object-top"
                  src={item.image} 
                  alt={item.name}
                />
              </div>
              <div className="mt-2">
                <p 
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="text-sm text-slate-800 cursor-pointer hover:text-indigo-600"
                >
                  {item.name}
                </p>
                <div className="mt-2">
                  <p className="text-xl font-semibold text-slate-900">
                    Rs {item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    or 3 X Rs {(item.price / 3).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} with{' '}
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-white text-[10px] font-semibold" style={{ backgroundColor: '#1a1a2e' }}>
                      Mintpay
                    </span>
                    {' '}or{' '}
                    <span className="text-purple-600 font-semibold">KOKO</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Mens
