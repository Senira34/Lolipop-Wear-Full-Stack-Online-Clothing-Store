import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Productdetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, buyNow } = useCart()
  const [activeTab, setActiveTab] = useState('description')
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [thumbnail, setThumbnail] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showNotification, setShowNotification] = useState(false)

  // Fetch product from API
  useEffect(() => {
    // Scroll to top when component mounts or product ID changes
    window.scrollTo(0, 0)
    
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`)
        const data = await response.json()
        
        if (data.success) {
          const productData = data.data
          setProduct(productData)
          
          // Set thumbnail - use first image from images array or fallback to single image
          const productImages = productData.images && productData.images.length > 0 
            ? productData.images 
            : productData.image 
              ? [productData.image, productData.image, productData.image, productData.image]
              : []
          
          if (productImages.length > 0) {
            setThumbnail(productImages[0])
          }
        } else {
          setProduct(null)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Set default size and color when product loads
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0])
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0])
      }
    }
  }, [product])

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Please select a size')
      return
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      alert('Please select a color')
      return
    }
    
    addToCart(product, selectedSize, selectedColor, quantity)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  // Handle Buy Now
  const handleBuyNow = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Please select a size')
      return
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      alert('Please select a color')
      return
    }
    
    buyNow(product, selectedSize, selectedColor, quantity)
  }

  // Get product images - handle both images array and single image
  const getProductImages = () => {
    if (!product) return []
    
    if (product.images && product.images.length > 0) {
      return product.images
    } else if (product.image) {
      // Fallback: create array with single image repeated
      return [product.image, product.image, product.image, product.image]
    }
    
    return []
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Product Not Found</h1>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-8 bg-slate-50 min-h-screen">
      <p className="text-sm text-gray-600 mb-6">
        <span className="cursor-pointer hover:text-indigo-600" onClick={() => navigate('/')}>Home</span> /
        <span className="cursor-pointer hover:text-indigo-600" onClick={() => navigate(-1)}> Products</span> /
        <span> {product.category}</span> /
        <span className="text-indigo-500"> {product.name}</span>
      </p>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mt-4">
        {/* Image Section */}
        <div className="flex gap-3 flex-1">
          <div className="flex flex-col gap-3">
            {getProductImages().map((image, index) => (
              <div 
                key={index} 
                onClick={() => setThumbnail(image)} 
                className={`border max-w-24 rounded overflow-hidden cursor-pointer transition ${
                  thumbnail === image ? 'border-indigo-500 border-2' : 'border-gray-300'
                }`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="border border-gray-300 flex-1 max-w-xl rounded overflow-hidden bg-white ">
            <img src={thumbnail} alt="Selected product" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="text-sm w-full lg:w-1/2">
          <h1 className="text-3xl font-medium text-slate-900">{product.name}</h1>

          <div className="flex items-center gap-0.5 mt-2">
            {Array(5).fill('').map((_, i) => (
              product.rating > i ? (
                <svg key={i} width="16" height="15" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#615fff" />
                </svg>
              ) : (
                <svg key={i} width="16" height="15" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z" fill="#615fff" fillOpacity="0.35" />
                </svg>
              )
            ))}
            <p className="text-base ml-2 text-gray-600">({product.rating})</p>
          </div>

          <div className="mt-6">
            <p className="text-3xl font-semibold text-slate-900">
              MRP: Rs {product.price?.toFixed(2)}
            </p>
            <span className="text-gray-500 text-xs">(inclusive of all taxes)</span>
          </div>

          {product.description && (
            <>
              <p className="text-base font-semibold mt-8 text-slate-900">About Product</p>
              {typeof product.description === 'string' ? (
                <p className="text-gray-600 mt-2">{product.description}</p>
              ) : Array.isArray(product.description) ? (
                <ul className="list-disc ml-4 text-gray-600 mt-2 space-y-1">
                  {product.description.map((desc, index) => (
                    <li key={index}>{desc}</li>
                  ))}
                </ul>
              ) : null}
            </>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="text-base font-semibold text-slate-900 mb-3">Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
                      selectedSize === size
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="text-base font-semibold text-slate-900 mb-3">Select Color</p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
                      selectedColor === color
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mt-6">
            <p className="text-base font-semibold text-slate-900 mb-3">Quantity</p>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-32">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
              >
                -
              </button>
              <span className="px-6 py-2 bg-white font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center mt-8 gap-4 text-base">
            <button 
              onClick={handleAddToCart}
              className="w-full py-3.5 cursor-pointer font-medium bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition rounded-lg"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="w-full py-3.5 cursor-pointer font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition rounded-lg"
            >
              Buy now
            </button>
          </div>

          {/* Success Notification */}
          {showNotification && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slide-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Added to cart successfully!</span>
            </div>
          )}

          {/* Shipping and Return Information */}
          <div className="mt-8 space-y-4 border-t border-gray-200 pt-6">
            {/* Free Shipping */}
            <div className="flex gap-3">
              <div className="shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 16V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1m8-1a1 1 0 0 1-1 1H9m4-1V8a1 1 0 0 1 1-1h2.586a1 1 0 0 1 .707.293l3.414 3.414a1 1 0 0 1 .293.707V16a1 1 0 0 1-1 1h-1m-6-1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m-6 0h6m-6 0v-2m6 2v-2m-3 2h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Free Shipping</h3>
                <p className="text-gray-600 text-sm mt-1">Free standard shipping on orders over Rs.6000</p>
              </div>
            </div>

            {/* Exchange From Physical Outlets */}
            <div className="flex gap-3">
              <div className="shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  Exchange From Physical Outlets
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-300 text-white rounded-full text-xs cursor-help">?</span>
                </h3>
                <p className="text-gray-600 text-sm mt-1">Learn More.</p>
              </div>
            </div>

            {/* For International Customers */}
            <div className="flex gap-3">
              <div className="shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">For International Customers</h3>
                <p className="text-gray-600 text-sm mt-1">Your total bill value will be converted to LKR (Sri Lankan Rupees) at checkout based on the current exchange rate.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-6xl mx-auto w-full px-6 mt-12">
        <div className="border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 px-2 text-sm font-semibold transition-colors relative ${
                activeTab === 'description' 
                  ? 'text-slate-900 border-b-2 border-slate-900' 
                  : 'text-gray-500 hover:text-slate-700'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('fabric')}
              className={`pb-4 px-2 text-sm font-semibold transition-colors relative ${
                activeTab === 'fabric' 
                  ? 'text-slate-900 border-b-2 border-slate-900' 
                  : 'text-gray-500 hover:text-slate-700'
              }`}
            >
              Fit and Fabric
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 px-2 text-sm font-semibold transition-colors relative ${
                activeTab === 'shipping' 
                  ? 'text-slate-900 border-b-2 border-slate-900' 
                  : 'text-gray-500 hover:text-slate-700'
              }`}
            >
              Shipping & Return
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'description' && (
            <div className="text-gray-600 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Product Description</h3>
              <p>
                {product.name} is crafted with attention to detail and quality. This premium piece combines 
                style with comfort, making it perfect for any occasion.
              </p>
              {product.description && (
                typeof product.description === 'string' ? (
                  <p>{product.description}</p>
                ) : Array.isArray(product.description) ? (
                  <ul className="list-disc ml-6 space-y-2">
                    {product.description.map((desc, index) => (
                      <li key={index}>{desc}</li>
                    ))}
                  </ul>
                ) : null
              )}
              <p>
                Whether you're dressing up for a special event or keeping it casual, this versatile piece 
                will elevate your wardrobe. Designed for the modern individual who values both fashion and functionality.
              </p>
            </div>
          )}

          {activeTab === 'fabric' && (
            <div className="text-gray-600 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Fit and Fabric Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Fabric</h4>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>High-quality premium material</li>
                    <li>Breathable and comfortable</li>
                    <li>Durable construction</li>
                    <li>Easy to maintain</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Fit</h4>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>True to size</li>
                    <li>Comfortable fit</li>
                    <li>Available in multiple sizes</li>
                    <li>Size guide available</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-slate-900 mb-2">Care Instructions</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Machine wash cold with similar colors</li>
                  <li>Tumble dry low or hang to dry</li>
                  <li>Iron on low heat if needed</li>
                  <li>Do not bleach</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="text-gray-600 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Shipping Information</h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Free standard shipping on orders over Rs.6000</li>
                  <li>Standard delivery: 5-7 business days</li>
                  <li>Express delivery: 2-3 business days (additional charges apply)</li>
                  <li>International shipping available</li>
                  <li>Order tracking provided via email</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Return & Exchange Policy</h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li>30-day return policy from date of delivery</li>
                  <li>Items must be unworn, unwashed, and in original condition with tags attached</li>
                  <li>Free returns for defective or damaged items</li>
                  <li>Exchange available at physical outlets</li>
                  <li>Refunds processed within 7-10 business days</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">International Orders</h3>
                <p>
                  For international customers, your total bill will be converted to LKR (Sri Lankan Rupees) 
                  at checkout based on the current exchange rate. Additional customs duties may apply depending 
                  on your country's regulations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Productdetails
