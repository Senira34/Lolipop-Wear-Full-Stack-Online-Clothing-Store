import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { API_URL } from '../services/api'

function NewArrival() {
  const navigate = useNavigate()
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch latest products from all categories
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(`${API_URL}/products`)
        const data = await response.json()
        
        if (data.success) {
          // Get the 5 most recent products (sorted by createdAt)
          const sortedProducts = data.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
          setNewArrivals(sortedProducts)
        }
      } catch (error) {
        console.error('Error fetching new arrivals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewArrivals()
  }, [])

  return (
    <>
      {/* New Arrivals Section */}
      <section className="py-24 px-4 md:px-16 lg:px-24 xl:px-32 bg-white">
        <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">New Arrivals</h1>
        <p className="text-slate-600 mb-10 text-center">Explore the latest additions to our collection.</p>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading new arrivals...</p>
          </div>
        ) : newArrivals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available yet.</p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-6">
            {newArrivals.map((item) => (
              <div key={item.id} className="group w-56 cursor-pointer">
                <img 
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-top"
                  src={item.image} 
                  alt={item.name}
                />
                <div className="mt-2">
                  <p 
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="text-sm text-slate-700 cursor-pointer hover:text-indigo-600"
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

      {/* Promotional Banner */}
      <section className="py-8 px-4 md:px-16 lg:px-24 xl:px-32 bg-slate-50">
        <div className="w-full flex items-center justify-center space-x-2 max-w-md mx-auto py-2.5 rounded-lg font-medium text-sm text-white text-center bg-linear-to-r from-indigo-600 to-purple-600">
          <p>Get 20% OFF on Your First Order! <span className="underline cursor-pointer hover:text-indigo-300 transition"><Link to="/women">Shop now</Link></span></p>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5.5h13.092M8.949 1l5.143 4.5L8.949 10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>
    </>
  )
}

export default NewArrival
