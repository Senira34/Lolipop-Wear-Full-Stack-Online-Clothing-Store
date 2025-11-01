import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// --- Reusable Button Styles ---
const btnBase = "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition"
const btnPrimary = `${btnBase} bg-indigo-600 text-white hover:bg-indigo-700`
const btnSecondary = `${btnBase} border border-gray-300 text-gray-700 hover:bg-gray-50`

const MyOrders = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login')
      return
    }

    // Check if redirected from successful payment
    if (location.state?.showSuccess) {
      setShowSuccessMessage(true)
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title)
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
      return () => clearTimeout(timer)
    }

    fetchOrders()
  }, [user, navigate, location.state]) // location.state is the specific dependency

  const fetchOrders = async () => {
    // Guard clause: Don't fetch if user is not available
    if (!user?._id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const endpoint = `/api/orders/user/${user._id}`
      const response = await fetch(endpoint)
      const data = await response.json()

      if (data.success) {
        setOrders(data.data || [])
      } else {
        setError(data.message || 'Failed to fetch orders')
      }
    } catch (err) {
      setError('An error occurred while loading your orders.')
    } finally {
      setLoading(false)
    }
  }

  // Helper functions passed to OrderCard
  const getStatusColor = (status) => {
    const colors = {
      'Processing': 'bg-blue-100 text-blue-800',
      'Confirmed': 'bg-green-100 text-green-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  // --- Render Logic ---

  if (loading) {
    return (
      <FullScreenCenter>
        <LoadingSpinner />
        <p className="text-gray-600">Loading your orders...</p>
      </FullScreenCenter>
    )
  }

  if (error) {
    return (
      <FullScreenCenter>
        <ErrorMessage error={error} onRetry={fetchOrders} />
      </FullScreenCenter>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {showSuccessMessage && (
          <SuccessMessage 
            onClose={() => setShowSuccessMessage(false)} 
            message="Your order has been placed successfully. You will receive a confirmation email shortly."
          />
        )}
        
        <PageHeader 
          title="My Orders" 
          description="Track and manage your orders" 
        />

        {orders.length === 0 ? (
          <EmptyOrders onShopClick={() => navigate('/')} />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard 
                key={order._id} 
                order={order} 
                formatDate={formatDate}
                getStatusColor={getStatusColor}
                onViewDetails={() => navigate(`/order/${order._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// --- Child Components ---

const FullScreenCenter = ({ children }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
    <div className="text-center">
      {children}
    </div>
  </div>
)

const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
)

const ErrorMessage = ({ error, onRetry }) => (
  <>
    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <IconAlert className="text-red-600" />
    </div>
    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{error}</h2>
    <button onClick={onRetry} className={`mt-4 ${btnPrimary}`}>
      Try Again
    </button>
  </>
)

const SuccessMessage = ({ message, onClose }) => (
  <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <IconCheck className="h-6 w-6 text-green-500" />
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium text-green-800">Payment Successful!</h3>
        <p className="mt-1 text-sm text-green-700">{message}</p>
      </div>
      <div className="ml-auto pl-3">
        <button onClick={onClose} className="inline-flex text-green-500 hover:text-green-700">
          <IconClose className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
)

const PageHeader = ({ title, description }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
      <IconPackage className="text-indigo-600" />
      {title}
    </h1>
    <p className="text-gray-600 mt-2">{description}</p>
  </div>
)

const EmptyOrders = ({ onShopClick }) => (
  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
    <IconEmptyCart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
    <h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h2>
    <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
    <button onClick={onShopClick} className={`${btnPrimary} rounded-full px-6 py-3`}>
      Start Shopping
    </button>
  </div>
)

const OrderCard = ({ order, formatDate, getStatusColor, onViewDetails }) => {
  const deliveryStatusText = order.isDelivered 
    ? `Delivered on ${formatDate(order.deliveredAt)}`
    : order.orderStatus === 'Shipped' 
      ? 'In transit'
      : 'Preparing your order'

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
      {/* Order Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase">Order ID</p>
              <p className="font-mono font-semibold text-gray-800">{order._id.slice(-8)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Order Date</p>
              <p className="font-medium text-gray-800">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Total</p>
              <p className="font-semibold text-gray-800">Rs {order.totalPrice?.toFixed(2)}</p>
            </div>
          </div>
          <div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus || 'Processing'}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-6 py-4">
        <div className="space-y-3">
          {order.orderItems?.length > 0 ? (
            order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 pb-3 border-b border-gray-100 last:border-0">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x Rs {item.price?.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold text-gray-800">
                  Rs {(item.quantity * item.price)?.toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No items in this order</p>
          )}
        </div>
      </div>

      {/* Order Footer */}
      <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <IconTruck />
          <span>{deliveryStatusText}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onViewDetails} className={btnSecondary}>
            View Details
          </button>
          {order.orderStatus === 'Delivered' && (
            <button className={btnPrimary}>
              Reorder
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// --- SVG Icons ---

const IconAlert = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" x2="12" y1="8" y2="12"/>
    <line x1="12" x2="12.01" y1="16" y2="16"/>
  </svg>
)

const IconCheck = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const IconClose = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
)

const IconPackage = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 3h5v5"/>
    <path d="M8 3H3v5"/>
    <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/>
    <path d="m15 9 6-6"/>
  </svg>
)

const IconEmptyCart = ({ className = "w-24 h-24" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
)

const IconTruck = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13 16V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1m8-1a1 1 0 0 1-1 1H9m4-1V8a1 1 0 0 1 1-1h2.586a1 1 0 0 1 .707.293l3.414 3.414a1 1 0 0 1 .293.707V16a1 1 0 0 1-1 1h-1m-6-1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m-6 0h6m-6 0v-2m6 2v-2m-3 2h-3"/>
  </svg>
)

export default MyOrders
