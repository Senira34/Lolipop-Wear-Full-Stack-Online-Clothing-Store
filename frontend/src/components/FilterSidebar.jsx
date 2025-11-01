import React, { useState, useEffect } from 'react'

const FilterSidebar = ({ 
  gender, 
  onFilterChange, 
  selectedCategories = [],
  selectedSizes = [],
  selectedColors = [],
  selectedFits = [],
  priceRange = [0, 200]
}) => {
  const [showCategories, setShowCategories] = useState(true)
  const [showSize, setShowSize] = useState(true)
  const [showColor, setShowColor] = useState(true)
  const [showFit, setShowFit] = useState(true)
  const [showPriceRange, setShowPriceRange] = useState(true)
  
  const [categories, setCategories] = useState([])
  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [fits, setFits] = useState([])
  const [categoryCounts, setCategoryCounts] = useState({})
  const [localPriceRange, setLocalPriceRange] = useState(priceRange)

  // Fetch dynamic filters from backend
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/filters/${gender}`)
        const data = await response.json()
        
        if (data.success) {
          setCategories(data.data.subcategories || [])
          setSizes(data.data.sizes || [])
          setColors(data.data.colors || [])
          setFits(data.data.fits || [])
          setCategoryCounts(data.data.categoryCounts || {})
        }
      } catch (error) {
        console.error('Error fetching filters:', error)
        // Set default values if API fails
        setCategories([])
        setSizes(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'])
        setColors(['#FFFFFF', '#F5F5DC', '#000000', '#1E3A8A', '#0000FF', '#DC2626', '#2563EB', '#6B7280', '#16A34A', '#9CA3AF'])
        setFits(['Regular Fit', 'Slim Fit', 'Oversized', 'Relaxed Fit'])
      }
    }

    fetchFilters()
  }, [gender])

  const handleCategoryToggle = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    onFilterChange({ type: 'categories', value: newCategories })
  }

  const handleSizeToggle = (size) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size]
    onFilterChange({ type: 'sizes', value: newSizes })
  }

  const handleColorToggle = (color) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color]
    onFilterChange({ type: 'colors', value: newColors })
  }

  const handleFitToggle = (fit) => {
    const newFits = selectedFits.includes(fit)
      ? selectedFits.filter(f => f !== fit)
      : [...selectedFits, fit]
    onFilterChange({ type: 'fits', value: newFits })
  }

  const handlePriceRangeChange = (value) => {
    setLocalPriceRange([0, parseInt(value)])
  }

  const applyPriceFilter = () => {
    onFilterChange({ type: 'priceRange', value: localPriceRange })
  }

  const clearAllFilters = () => {
    onFilterChange({ type: 'clear' })
    setLocalPriceRange([0, 200])
  }

  const getColorStyle = (color) => {
    return {
      backgroundColor: color,
      border: color === '#FFFFFF' ? '1px solid #E5E7EB' : 'none'
    }
  }

  return (
    <div className="hidden lg:block w-64 shrink-0">
      <div className="bg-white rounded-lg p-4 shadow-sm sticky top-4">
        
        {/* Clear All Filters */}
        {(selectedCategories.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0 || selectedFits.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="w-full mb-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
          >
            Clear All Filters
          </button>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div 
              className="flex items-center justify-between cursor-pointer mb-3"
              onClick={() => setShowCategories(!showCategories)}
            >
              <h3 className="font-semibold text-gray-800 text-sm">CATEGORIES</h3>
              <svg 
                className={`w-4 h-4 transition-transform ${showCategories ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {showCategories && (
              <div className="space-y-2 text-sm">
                {categories.map((category) => (
                  <label 
                    key={category} 
                    className="flex items-center justify-between hover:text-indigo-600 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 group-hover:text-indigo-600">{category}</span>
                    </div>
                    {categoryCounts[category] && (
                      <span className="text-gray-400 text-xs">({categoryCounts[category]})</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Size Filter */}
        {sizes.length > 0 && (
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div 
              className="flex items-center justify-between cursor-pointer mb-3"
              onClick={() => setShowSize(!showSize)}
            >
              <h3 className="font-semibold text-gray-800 text-sm">SIZE</h3>
              <svg 
                className={`w-4 h-4 transition-transform ${showSize ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {showSize && (
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`px-3 py-1.5 text-xs border rounded transition ${
                      selectedSizes.includes(size)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-300 hover:border-indigo-600 hover:text-indigo-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Color Filter */}
        {colors.length > 0 && (
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div 
              className="flex items-center justify-between cursor-pointer mb-3"
              onClick={() => setShowColor(!showColor)}
            >
              <h3 className="font-semibold text-gray-800 text-sm">COLOR</h3>
              <svg 
                className={`w-4 h-4 transition-transform ${showColor ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {showColor && (
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleColorToggle(color)}
                    className={`w-8 h-8 rounded-full transition ${
                      selectedColors.includes(color)
                        ? 'ring-2 ring-indigo-600 ring-offset-2'
                        : 'hover:ring-2 hover:ring-gray-400'
                    }`}
                    style={getColorStyle(color)}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Fit Filter */}
        {fits.length > 0 && (
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div 
              className="flex items-center justify-between cursor-pointer mb-3"
              onClick={() => setShowFit(!showFit)}
            >
              <h3 className="font-semibold text-gray-800 text-sm">FIT</h3>
              <svg 
                className={`w-4 h-4 transition-transform ${showFit ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {showFit && (
              <div className="space-y-2 text-sm">
                {fits.map((fit) => (
                  <label key={fit} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedFits.includes(fit)}
                      onChange={() => handleFitToggle(fit)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                    />
                    <span className="text-gray-700">{fit}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price Filter */}
        <div className="pb-4">
          <div 
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => setShowPriceRange(!showPriceRange)}
          >
            <h3 className="font-semibold text-gray-800 text-sm">PRICE RANGE</h3>
            <svg 
              className={`w-4 h-4 transition-transform ${showPriceRange ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {showPriceRange && (
            <div className="space-y-3">
              <input 
                type="range" 
                min="0" 
                max="10000" 
                value={localPriceRange[1]}
                onChange={(e) => handlePriceRangeChange(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-sm text-gray-700">
                <span>Rs {localPriceRange[0]}</span>
                <span>Rs {localPriceRange[1]}</span>
              </div>
              <button 
                onClick={applyPriceFilter}
                className="w-full py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
              >
                Apply Filter
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default FilterSidebar
