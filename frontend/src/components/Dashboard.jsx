import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0
  })

  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    price: '',
    category: 'men',
    subcategory: '',
    image: '',
    description: '',
    fabric: '',
    fit: 'Regular Fit',
    sizes: [],
    colors: [],
    stock: '',
    rating: 0
  })

  const [imageFiles, setImageFiles] = useState([null, null, null, null])
  const [imagePreviews, setImagePreviews] = useState(['', '', '', ''])

  useEffect(() => {
    if (!user || !isAdmin()) navigate('/')
  }, [user, isAdmin, navigate])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
        setStats(prev => ({ ...prev, totalProducts: data.data.length }))
      }
    } catch (err) {
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/users')
      ])
      
      const [productsData, ordersData, usersData] = await Promise.all([
        productsRes.json(),
        ordersRes.json(),
        usersRes.json()
      ])

      setStats({
        totalProducts: productsData.success ? productsData.data.length : 0,
        totalOrders: ordersData.success ? ordersData.data.length : 0,
        totalUsers: usersData.success ? usersData.data.length : 0
      })
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      if (data.success) setOrders(data.data)
    } catch (err) {
      setError('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await response.json()
      if (data.success) {
        setSuccess('Order status updated successfully!')
        fetchOrders()
        fetchStats()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.message || 'Failed to update order status')
      }
    } catch (err) {
      setError('Failed to update order status')
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        setSuccess('Order deleted successfully!')
        fetchOrders()
        fetchStats()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.message || 'Failed to delete order')
      }
    } catch (err) {
      setError('Failed to delete order')
    }
  }

  useEffect(() => {
    if (activeTab === 'products') fetchProducts()
    else if (activeTab === 'orders') fetchOrders()
    else if (activeTab === 'overview') fetchStats()
  }, [activeTab])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProductForm({ ...productForm, [name]: value })
  }

  const handleImageChange = (e, index) => {
    const file = e.target.files[0]
    if (file) {
      const newImageFiles = [...imageFiles]
      newImageFiles[index] = file
      setImageFiles(newImageFiles)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImagePreviews = [...imagePreviews]
        newImagePreviews[index] = reader.result
        setImagePreviews(newImagePreviews)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = (index) => {
    const newImageFiles = [...imageFiles]
    const newImagePreviews = [...imagePreviews]
    newImageFiles[index] = null
    newImagePreviews[index] = ''
    setImageFiles(newImageFiles)
    setImagePreviews(newImagePreviews)
  }

  const handleSizeToggle = (size) => {
    const sizes = productForm.sizes.includes(size)
      ? productForm.sizes.filter(s => s !== size)
      : [...productForm.sizes, size]
    setProductForm({ ...productForm, sizes })
  }

  const handleColorAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault()
      const color = e.target.value.trim()
      if (!productForm.colors.includes(color)) {
        setProductForm({ ...productForm, colors: [...productForm.colors, color] })
      }
      e.target.value = ''
    }
  }

  const removeColor = (colorToRemove) => {
    setProductForm({
      ...productForm,
      colors: productForm.colors.filter(c => c !== colorToRemove)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!productForm.id || !productForm.name || !productForm.price || !productForm.stock) {
        setError('Please fill in all required fields (ID, Name, Price, Stock)')
        setLoading(false)
        return
      }

      const images = imagePreviews.filter(img => img !== '')
      
      if (images.length === 0) {
        setError('Please upload at least one product image')
        setLoading(false)
        return
      }

      const productId = parseInt(productForm.id)
      const productPrice = parseFloat(productForm.price)
      const productStock = parseInt(productForm.stock)

      if (isNaN(productId) || productId <= 0) {
        setError('Product ID must be a valid positive number')
        setLoading(false)
        return
      }

      if (isNaN(productPrice) || productPrice <= 0) {
        setError('Price must be a valid positive number')
        setLoading(false)
        return
      }

      if (isNaN(productStock) || productStock < 0) {
        setError('Stock must be a valid number (0 or greater)')
        setLoading(false)
        return
      }

      const productData = {
        ...productForm,
        images: images,
        image: images[0],
        id: productId,
        price: productPrice,
        offerPrice: productForm.offerPrice ? parseFloat(productForm.offerPrice) : undefined,
        stock: productStock
      }

      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products'
      
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(editingProduct ? 'Product updated successfully!' : 'Product added successfully!')
        setProductForm({
          id: '', name: '', price: '', offerPrice: '', category: 'men',
          image: '', description: '', fabric: '', fit: 'Regular Fit',
          sizes: [], colors: [], stock: '', rating: 0
        })
        setImageFiles([null, null, null, null])
        setImagePreviews(['', '', '', ''])
        setEditingProduct(null)
        fetchProducts()
        fetchStats()
        setTimeout(() => {
          setShowAddProduct(false)
          setSuccess('')
        }, 2000)
      } else {
        setError(data.message || (editingProduct ? 'Failed to update product' : 'Failed to add product'))
      }
    } catch (err) {
      setError(editingProduct ? 'Failed to update product. Please try again.' : 'Failed to add product. Please try again.')
      console.error('Error saving product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        setSuccess('Product deleted successfully!')
        fetchProducts()
        fetchStats()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.message || 'Failed to delete product')
      }
    } catch (err) {
      setError('Failed to delete product')
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description || '',
      fabric: product.fabric || '',
      fit: product.fit || 'Regular Fit',
      sizes: product.sizes || [],
      colors: product.colors || [],
      stock: product.stock,
      rating: product.rating || 0
    })
    
    if (product.images && product.images.length > 0) {
      const previews = ['', '', '', '']
      product.images.forEach((img, index) => {
        if (index < 4) previews[index] = img
      })
      setImagePreviews(previews)
    } else if (product.image) {
      setImagePreviews([product.image, '', '', ''])
    }
    
    setShowAddProduct(true)
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setProductForm({
      id: '', name: '', price: '', offerPrice: '', category: 'men',
      image: '', description: '', fabric: '', fit: 'Regular Fit',
      sizes: [], colors: [], stock: '', rating: 0
    })
    setImageFiles([null, null, null, null])
    setImagePreviews(['', '', '', ''])
    setShowAddProduct(false)
  }

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const fitOptions = ['Regular Fit', 'Slim Fit', 'Oversized', 'Relaxed Fit']

  const StatCard = ({ title, value, icon, gradient }) => (
    <div className={`${gradient} rounded-xl p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
        </div>
        {icon}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-600">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="flex gap-4 p-4 border-b">
            {['overview', 'products', 'orders'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-medium ${
                  activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Products" value={stats.totalProducts} gradient="bg-gradient-to-br from-indigo-500 to-indigo-600" icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-80">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                    <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                } />
                <StatCard title="Total Orders" value={stats.totalOrders} gradient="bg-gradient-to-br from-purple-500 to-purple-600" icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-80">
                    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                  </svg>
                } />
                <StatCard title="Total Users" value={stats.totalUsers} gradient="bg-gradient-to-br from-pink-500 to-pink-600" icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-80">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                } />
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Manage Products</h2>
                  <button onClick={() => setShowAddProduct(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14"/><path d="M12 5v14"/>
                    </svg>
                    Add Product
                  </button>
                </div>

                {/* Add/Edit Product Modal */}
                {showAddProduct && (
                  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-indigo-600">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        <button onClick={handleCancelEdit}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                          </svg>
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Product ID *</label>
                            <input type="number" name="id" value={productForm.id} onChange={handleInputChange} 
                              className="w-full border rounded-lg px-4 py-2" required disabled={!!editingProduct} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Category *</label>
                            <select name="category" value={productForm.category} onChange={handleInputChange} 
                              className="w-full border rounded-lg px-4 py-2" required>
                              <option value="men">Men</option>
                              <option value="women">Women</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Subcategory</label>
                            <input type="text" name="subcategory" value={productForm.subcategory} onChange={handleInputChange} 
                              placeholder="e.g., T-Shirts" className="w-full border rounded-lg px-4 py-2" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Product Name *</label>
                          <input type="text" name="name" value={productForm.name} onChange={handleInputChange} 
                            className="w-full border rounded-lg px-4 py-2" required />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Price *</label>
                          <input type="number" name="price" value={productForm.price} onChange={handleInputChange} 
                            step="0.01" className="w-full border rounded-lg px-4 py-2" required />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Product Images * (Upload 4 images)</label>
                          <div className="grid grid-cols-2 gap-4">
                            {[0, 1, 2, 3].map((index) => (
                              <div key={index} className="border-2 border-dashed rounded-lg p-4 text-center hover:border-indigo-400">
                                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, index)} 
                                  className="hidden" id={`image-${index}`} required={index === 0 && !imagePreviews[0]} />
                                <label htmlFor={`image-${index}`} className="cursor-pointer">
                                  {imagePreviews[index] ? (
                                    <div className="relative group">
                                      <img src={imagePreviews[index]} alt={`Preview ${index + 1}`} className="max-h-32 w-full object-cover rounded-lg" />
                                      <button type="button" onClick={(e) => { e.preventDefault(); handleRemoveImage(index) }}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100">×</button>
                                      <p className="text-xs text-indigo-600 font-medium mt-1">Image {index + 1}</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-gray-400">
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                                        <circle cx="9" cy="9" r="2"/>
                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                      </svg>
                                      <p className="text-xs">Image {index + 1}</p>
                                      <p className="text-xs text-gray-400">{index === 0 ? 'Required' : 'Optional'}</p>
                                    </div>
                                  )}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea name="description" value={productForm.description} onChange={handleInputChange} 
                            rows="3" className="w-full border rounded-lg px-4 py-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Fabric</label>
                            <input type="text" name="fabric" value={productForm.fabric} onChange={handleInputChange} 
                              className="w-full border rounded-lg px-4 py-2" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Fit</label>
                            <select name="fit" value={productForm.fit} onChange={handleInputChange} 
                              className="w-full border rounded-lg px-4 py-2">
                              {fitOptions.map(fit => <option key={fit} value={fit}>{fit}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Sizes</label>
                          <div className="flex gap-2 flex-wrap">
                            {sizeOptions.map(size => (
                              <button key={size} type="button" onClick={() => handleSizeToggle(size)}
                                className={`px-4 py-2 rounded-lg border-2 ${productForm.sizes.includes(size) 
                                  ? 'bg-indigo-600 text-white border-indigo-600' 
                                  : 'bg-white text-gray-700 border-gray-300'}`}>
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Colors (Press Enter to add)</label>
                          <input type="text" onKeyPress={handleColorAdd} placeholder="Type color and press Enter" 
                            className="w-full border rounded-lg px-4 py-2" />
                          <div className="flex gap-2 flex-wrap mt-2">
                            {productForm.colors.map(color => (
                              <span key={color} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {color}
                                <button type="button" onClick={() => removeColor(color)}>×</button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Stock *</label>
                          <input type="number" name="stock" value={productForm.stock} onChange={handleInputChange} 
                            className="w-full border rounded-lg px-4 py-2" required />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <button type="submit" disabled={loading} 
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50">
                            {loading ? (editingProduct ? 'Updating...' : 'Adding...') : (editingProduct ? 'Update Product' : 'Add Product')}
                          </button>
                          <button type="button" onClick={handleCancelEdit} 
                            className="px-6 py-3 border text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Products List */}
                {loading && !showAddProduct ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12 text-gray-600">No products yet. Add your first product!</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <div key={product.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h3 className="font-semibold mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold text-indigo-600">${product.offerPrice || product.price}</span>
                            {product.offerPrice && <span className="text-sm text-gray-400 line-through">${product.price}</span>}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditProduct(product)} 
                              className="flex-1 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-200">
                              Edit
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} 
                              className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Manage Orders</h2>
                  <div className="text-sm text-gray-600">
                    Total Orders: <span className="font-semibold text-indigo-600">{orders.length}</span>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-600">No orders yet.</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order._id} className="bg-white border rounded-xl p-6 hover:shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold mb-1">Order #{order._id.slice(-8).toUpperCase()}</h3>
                            <p className="text-sm text-gray-500">Customer: <span className="font-medium">{order.user?.name || 'N/A'}</span></p>
                            <p className="text-sm text-gray-500">Email: <span className="font-medium">{order.user?.email || 'N/A'}</span></p>
                            <p className="text-sm text-gray-500 mt-1">
                              Date: {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-indigo-600">Rs{order.totalPrice?.toFixed(2)}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                              order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-700' :
                              order.orderStatus === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                              order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.orderStatus || 'Pending'}
                            </span>
                          </div>
                        </div>

                        <div className="border-t pt-4 mb-4">
                          <h4 className="text-sm font-semibold mb-2">Order Items:</h4>
                          <div className="space-y-2">
                            {order.orderItems?.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.name || 'Product'} x {item.quantity}</span>
                                <span className="font-medium">Rs{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t pt-4 mb-4">
                          <h4 className="text-sm font-semibold mb-2">Shipping Address:</h4>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress?.name && <><strong>{order.shippingAddress.name}</strong><br /></>}
                            {order.shippingAddress?.phone && <>{order.shippingAddress.phone}<br /></>}
                            {order.shippingAddress?.street}<br />
                            {order.shippingAddress?.city} {order.shippingAddress?.zipCode}<br />
                            {order.shippingAddress?.country}
                          </p>
                        </div>

                        <div className="flex gap-2 pt-4 border-t">
                          <select value={order.orderStatus || 'Pending'} onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="flex-1 border rounded-lg px-4 py-2 text-sm">
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button onClick={() => { setSelectedOrder(order); setShowOrderDetails(true) }}
                            className="bg-indigo-100 text-indigo-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-200">
                            View Details
                          </button>
                          <button onClick={() => handleDeleteOrder(order._id)}
                            className="bg-red-100 text-red-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-200">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Order Details Modal */}
                {showOrderDetails && selectedOrder && (
                  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-indigo-600">Order Details</h3>
                        <button onClick={() => setShowOrderDetails(false)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Order Information</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Order ID</p>
                              <p className="font-medium">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Status</p>
                              <p className="font-medium capitalize">{selectedOrder.status}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Order Date</p>
                              <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Payment Status</p>
                              <p className="font-medium">{selectedOrder.isPaid ? 'Paid' : 'Pending'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Customer Information</h4>
                          <div className="text-sm space-y-1">
                            <p><span className="text-gray-600">Name:</span> <span className="font-medium">{selectedOrder.user?.name}</span></p>
                            <p><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedOrder.user?.email}</span></p>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Shipping Address</h4>
                          <p className="text-sm text-gray-700">
                            {selectedOrder.shippingAddress?.street}<br />
                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}<br />
                            {selectedOrder.shippingAddress?.country}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Order Items</h4>
                          <div className="space-y-3">
                            {selectedOrder.items?.map((item, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{item.product?.name}</p>
                                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-indigo-50 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold">Total Amount</p>
                            <p className="text-2xl font-bold text-indigo-600">${selectedOrder.totalPrice?.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      <button onClick={() => setShowOrderDetails(false)}
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium">
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
