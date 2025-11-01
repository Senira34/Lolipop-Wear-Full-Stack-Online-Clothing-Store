import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order
  const paymentIntentId = location.state?.paymentIntentId

  // Debug logging
  console.log('OrderSuccess - Full location.state:', location.state)
  console.log('OrderSuccess - Order data:', order)
  console.log('OrderSuccess - Payment Intent ID:', paymentIntentId)

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="flex-1 text-white">
                <h1 className="text-2xl font-bold mb-0.5">Payment Successful!</h1>
                <p className="text-green-50 text-sm">Your order has been confirmed and will be processed shortly.</p>
              </div>
            </div>
          </div>

          {/* Order Receipt */}
          <div className="p-6">
            {/* Order Info Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Order Receipt</h2>
                <p className="text-sm text-gray-600">
                  Order ID: <span className="font-mono font-semibold text-gray-800">
                    #{order?._id?.slice(-8).toUpperCase() || paymentIntentId?.slice(-8).toUpperCase() || 'N/A'}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Date: <span className="font-medium text-gray-800">
                    {order?.createdAt ? formatDate(order.createdAt) : formatDate(new Date())}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Payment Status: <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold ml-1">
                    PAID
                  </span>
                </p>
              </div>
              <div className="text-right">
                <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                  <p className="text-xs text-indigo-600 uppercase font-semibold">Total Amount</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    Rs {(order?.totalPrice || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {order?.orderItems && order.orderItems.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  Order Items
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-gray-600">
                            Quantity: {item.quantity} × Rs {(item.price || 0).toFixed(2)}
                          </p>
                          {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-gray-800 text-sm">Rs {((item.quantity || 0) * (item.price || 0)).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Address */}
            {order?.shippingAddress && (
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Shipping Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 text-sm">{order.shippingAddress.name}</p>
                  {order.shippingAddress.phone && (
                    <p className="text-sm text-gray-600 mt-1">📞 {order.shippingAddress.phone}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city} {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" x2="12" y1="2" y2="22"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Price Breakdown
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">Rs {(order?.itemsPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">{(order?.shippingPrice || 0) === 0 ? 'FREE' : `Rs ${(order?.shippingPrice || 0).toFixed(2)}`}</span>
                </div>
                {(order?.taxPrice || 0) > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium">Rs {(order?.taxPrice || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t-2 border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between text-base font-bold text-gray-800">
                    <span>Total</span>
                    <span>Rs {(order?.totalPrice || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="5" rx="2"/>
                  <line x1="2" x2="22" y1="10" y2="10"/>
                </svg>
                Payment Method
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 font-medium text-sm">{order?.paymentMethod || 'Card Payment'}</p>
                {paymentIntentId && (
                  <p className="text-xs text-gray-500 mt-1">Transaction ID: {paymentIntentId.slice(-12)}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
              <button
                onClick={() => navigate('/')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/my-orders')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 3h5v5"/>
                  <path d="M8 3H3v5"/>
                  <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/>
                  <path d="m15 9 6-6"/>
                </svg>
                My Orders
              </button>
              <button
                onClick={() => window.print()}
                className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-lg border-2 border-gray-300 transition flex items-center justify-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect width="12" height="8" x="6" y="14"/>
                </svg>
                Print Receipt
              </button>
            </div>

            {/* Email Confirmation Notice */}
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 shrink-0 mt-0.5">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <div>
                  <p className="font-semibold text-blue-900 text-sm">Order Confirmation Sent</p>
                  <p className="text-xs text-blue-700 mt-1">
                    A detailed receipt has been sent to your email. Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3 text-base">📦 What's Next?</h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <div className="shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Order Processing</p>
                    <p className="text-xs text-gray-600">We'll prepare your order within 24 hours</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Tracking Information</p>
                    <p className="text-xs text-gray-600">You'll receive tracking details via email once shipped</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="shrink-0 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Delivery</p>
                    <p className="text-xs text-gray-600">Expected delivery in 3-5 business days</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="mt-6 text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Need help with your order?{' '}
                <button
                  onClick={() => navigate('/contact')}
                  className="text-indigo-600 hover:underline font-semibold"
                >
                  Contact Support
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
