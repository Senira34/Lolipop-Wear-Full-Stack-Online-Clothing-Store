import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FilterSidebar from '../components/FilterSidebar'

const MensClothing = () => {
  const navigate = useNavigate()
  const [mensClothing, setMensClothing] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedFits, setSelectedFits] = useState([])
  const [priceRange, setPriceRange] = useState([0, 10000])

  useEffect(() => {
    const fetchMensProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/category/men')
        const data = await response.json()
        if (data.success) {
          setMensClothing(data.data)
          setFilteredProducts(data.data)
        }
      } catch (error) {
        console.error('Error fetching mens products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMensProducts()
  }, [])

  useEffect(() => {
    let filtered = [...mensClothing]

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.subcategory))
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes && product.sizes.some(size => selectedSizes.includes(size))
      )
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        product.colors && product.colors.some(color => selectedColors.includes(color))
      )
    }

    if (selectedFits.length > 0) {
      filtered = filtered.filter(product => selectedFits.includes(product.fit))
    }

    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    setFilteredProducts(filtered)
  }, [mensClothing, selectedCategories, selectedSizes, selectedColors, selectedFits, priceRange])

  const handleFilterChange = ({ type, value }) => {
    switch (type) {
      case 'categories':
        setSelectedCategories(value)
        break
      case 'sizes':
        setSelectedSizes(value)
        break
      case 'colors':
        setSelectedColors(value)
        break
      case 'fits':
        setSelectedFits(value)
        break
      case 'priceRange':
        setPriceRange(value)
        break
      case 'clear':
        setSelectedCategories([])
        setSelectedSizes([])
        setSelectedColors([])
        setSelectedFits([])
        setPriceRange([0, 10000])
        break
      default:
        break
    }
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedSizes.length > 0 || 
                          selectedColors.length > 0 || selectedFits.length > 0

  return (
    <section className="py-8 px-4 md:px-16 lg:px-24 bg-slate-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Men's Clothing</h1>
      <p className="text-gray-600 mb-8">Upgrade your wardrobe with our premium collection</p>

      <div className="flex gap-8">
        <FilterSidebar
          gender="men"
          onFilterChange={handleFilterChange}
          selectedCategories={selectedCategories}
          selectedSizes={selectedSizes}
          selectedColors={selectedColors}
          selectedFits={selectedFits}
          priceRange={priceRange}
        />

        <div className="flex-1">
          {!loading && (
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredProducts.length} of {mensClothing.length} products
              {hasActiveFilters && <span className="ml-2 text-indigo-600 font-medium">(Filtered)</span>}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 mb-2">No products found matching your filters</p>
              <button
                onClick={() => handleFilterChange({ type: 'clear' })}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((item) => (
                <div key={item.id} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer">
                  <div className="overflow-hidden" onClick={() => navigate(`/product/${item.id}`)}>
                    <img 
                      className="w-full h-72 object-cover object-top group-hover:scale-110 transition duration-300"
                      src={item.image} 
                      alt={item.name}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium mb-1 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">{item.fabric || 'Premium Quality'}</p>
                    <p className="text-lg font-bold text-gray-900">
                      Rs {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      or 3 X Rs {(item.price / 3).toLocaleString('en-US', { minimumFractionDigits: 2 })} with{' '}
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-white text-[10px] font-semibold bg-gray-900">
                        Mintpay
                      </span>
                      {' '}or{' '}
                      <span className="text-purple-600 font-semibold">KOKO</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default MensClothing