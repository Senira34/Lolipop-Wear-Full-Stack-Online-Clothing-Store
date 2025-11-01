import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Initialize Stripe (Replace with your actual publishable key)
const stripePromise = loadStripe('pk_test_51SNIm4LMZRE9GXBfPCIiYjvWI21KQ3QxIsOr2ksdsWEwm4eagIUrG5ZhGVxqPwt7NXwtwG8AcTqyiT0Btj8VJfUm00K51ghleP')

const CheckoutForm = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const notification = useNotification()
  const stripe = useStripe()
  const elements = useElements()
  
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  
  // Form data
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Sri Lanka'
  })

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    })
  }

  const getShippingFee = () => {
    return getCartTotal() > 6000 ? 0 : 500
  }

  const getTotal = () => {
    return getCartTotal() + getShippingFee()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
      notification.error('Please fill in all required fields')
      return
    }

    setProcessing(true)

    try {
      // Create payment intent on your backend
      const response = await fetch('http://localhost:5000/api/orders/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(getTotal() * 100), // Convert to cents
          shippingInfo,
          cartItems
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const data = await response.json()
      
      if (!data.success || !data.clientSecret) {
        throw new Error(data.message || 'Failed to initialize payment')
      }

      const { clientSecret } = data

      // Confirm the payment
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: shippingInfo.fullName,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              postal_code: shippingInfo.postalCode,
              country: 'LK'
            }
          },
        },
      })

      if (payload.error) {
        notification.error(`Payment failed: ${payload.error.message}`)
        setProcessing(false)
      } else {
        setSucceeded(true)
        setProcessing(false)
        notification.success('Payment successful! Processing your order...')
        
        // Create order in database after successful payment
        try {
          console.log('Creating order with user:', user)
          console.log('Cart total:', getCartTotal())
          console.log('Shipping fee:', getShippingFee())
          console.log('Total:', getTotal())
          
          const orderData = {
            user: user?._id || 'guest',
            orderItems: cartItems.map(item => ({
              product: item._id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image,
              size: item.size || 'M',
              color: item.color || 'Default'
            })),
            shippingAddress: {
              name: shippingInfo.fullName,
              phone: shippingInfo.phone,
              street: shippingInfo.address,
              city: shippingInfo.city,
              zipCode: shippingInfo.postalCode,
              country: shippingInfo.country
            },
            paymentMethod: 'Card',
            paymentResult: {
              id: payload.paymentIntent.id,
              status: payload.paymentIntent.status,
              emailAddress: shippingInfo.email
            },
            itemsPrice: getCartTotal(),
            shippingPrice: getShippingFee(),
            taxPrice: 0,
            totalPrice: getTotal(),
            isPaid: true,
            paidAt: new Date(),
            orderStatus: 'Processing'
          }

          console.log('Order data being sent:', JSON.stringify(orderData, null, 2))

          const orderResponse = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          })

          console.log('Order response status:', orderResponse.status)
          
          const orderResult = await orderResponse.json()
          console.log('Order response data:', orderResult)
          
          if (orderResult.success) {
            console.log('✅ Order created successfully with ID:', orderResult.data._id)
            console.log('Full order data:', orderResult.data)
            notification.success('Order placed successfully! Redirecting to order details...')
            // Clear cart and redirect to Order Success page with receipt
            setTimeout(() => {
              clearCart()
              navigate('/order-success', { 
                state: { 
                  order: orderResult.data,
                  paymentIntentId: payload.paymentIntent.id
                } 
              })
            }, 1500)
          } else {
            console.error('❌ Failed to create order:', orderResult.message)
            console.error('Error details:', orderResult.error)
            notification.warning(`Order saved with issues. Payment ID: ${payload.paymentIntent.id}`)
            // Still redirect to success page
            setTimeout(() => {
              clearCart()
              navigate('/order-success', { 
                state: { 
                  paymentIntentId: payload.paymentIntent.id 
                } 
              })
            }, 1500)
          }
        } catch (orderError) {
          console.error('❌ Error creating order:', orderError)
          notification.warning(`Payment successful but order creation failed. Payment ID: ${payload.paymentIntent.id}`)
          // Still redirect to success page
          setTimeout(() => {
            clearCart()
            navigate('/order-success', { 
              state: { 
                paymentIntentId: payload.paymentIntent.id 
              } 
            })
          }, 1500)
        }
      }
    } catch (err) {
      notification.error(err.message || 'An error occurred. Please try again.')
      setProcessing(false)
      console.error('Payment error:', err)
    }
  }

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: true,
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Shipping & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 16V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1m8-1a1 1 0 0 1-1 1H9m4-1V8a1 1 0 0 1 1-1h2.586a1 1 0 0 1 .707.293l3.414 3.414a1 1 0 0 1 .293.707V16a1 1 0 0 1-1 1h-1m-6-1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m-6 0h6m-6 0v-2m6 2v-2m-3 2h-3"/>
                  </svg>
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2"/>
                    <line x1="2" x2="22" y1="10" y2="10"/>
                  </svg>
                  Payment Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
                    <div className="p-4 border border-gray-300 rounded-lg">
                      <CardElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-3 pb-4 border-b border-gray-100">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">Size: {item.size} | Color: {item.color}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm text-gray-800">Rs {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <hr className="my-4" />

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">Rs {getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping Fee</span>
                    <span className="font-medium">
                      {getShippingFee() === 0 ? 'Free' : `Rs ${getShippingFee().toFixed(2)}`}
                    </span>
                  </div>
                  {getCartTotal() < 6000 && (
                    <p className="text-xs text-green-600">Free shipping on orders over Rs 6000!</p>
                  )}
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-bold text-gray-800 mb-6">
                  <span>Total</span>
                  <span>Rs {getTotal().toFixed(2)}</span>
                </div>

                <button 
                  type="submit"
                  disabled={processing || succeeded || !stripe}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : succeeded ? (
                    'Payment Successful!'
                  ) : (
                    'Complete Payment'
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                  <span className="text-xs text-gray-500">Secured by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

const Checkout = () => {
  const { cartItems } = useCart()
  const navigate = useNavigate()

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some items to proceed to checkout</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}

export default Checkout
