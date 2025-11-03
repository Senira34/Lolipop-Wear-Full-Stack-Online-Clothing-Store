import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const [promoCode, setPromoCode] = useState('')
  window.scrollTo(0, 0);

  const getSubtotal = () => {
    return getCartTotal()
  }

  const getShippingFee = () => {
    return getSubtotal() > 100 ? 0 : 5.99
  }

  const getTotal = () => {
    return getSubtotal() + getShippingFee()
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some items to get started!</p>
            <Link to="/" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Table Header - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 text-sm">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                  <div className="col-span-1 text-center">Remove</div>
                </div>

                {/* Cart Items */}
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-6 border-b border-gray-200 items-center">
                    {/* Product Info */}
                    <div className="md:col-span-5 flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">Size: {item.size} | Color: {item.color}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="md:col-span-2 flex md:justify-center">
                      <span className="md:hidden font-semibold text-gray-700 mr-2">Price:</span>
                      <span className="text-gray-800 font-medium">Rs {item.price.toFixed(2)}</span>
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2 flex md:justify-center items-center gap-2">
                      <span className="md:hidden font-semibold text-gray-700 mr-2">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 bg-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="md:col-span-2 flex md:justify-center">
                      <span className="md:hidden font-semibold text-gray-700 mr-2">Total:</span>
                      <span className="text-gray-800 font-semibold">Rs {(item.price * item.quantity).toFixed(2)}</span>
                    </div>

                    {/* Remove */}
                    <div className="md:col-span-1 flex md:justify-center">
                      <button 
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                        title="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Have a promo code?</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code" 
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">
                      Apply
                    </button>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">Rs {getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping Fee</span>
                    <span className="font-medium">
                      {getShippingFee() === 0 ? 'Free' : `Rs ${getShippingFee().toFixed(2)}`}
                    </span>
                  </div>
                  {getSubtotal() < 100 && (
                    <p className="text-xs text-green-600">Free shipping on orders over Rs 100!</p>
                  )}
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-bold text-gray-800 mb-6">
                  <span>Total</span>
                  <span>Rs {getTotal().toFixed(2)}</span>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-full transition mb-3"
                >
                  Proceed to Checkout
                </button>

                <Link to="/" className="block text-center text-indigo-600 hover:underline text-sm">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart