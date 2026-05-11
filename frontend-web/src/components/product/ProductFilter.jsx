import { useState } from 'react'
import { ChevronDown, ChevronUp, Star, X } from 'lucide-react'

export default function ProductFilter({ filters, onFilterChange, categories, onApply }) {
  const [expanded, setExpanded] = useState({
    category: true,
    gender: false,
    brand: false,
    size: false,
    fabric: false,
    type: false,
    color: false,
    pattern: false,
    fit: false,
    occasion: false,
    age: false,
    sleeve: false,
    price: true,
    discount: false,
    rating: false,
    delivery: false,
    stock: false,
  })

  // Helper to toggle array values (multi-select)
  const toggleArrayFilter = (key, value) => {
    const currentValues = filters[key] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    onFilterChange({ ...filters, [key]: newValues })
  }

  // Helper to toggle single value in array (for price ranges)
  const toggleSingleInArray = (key, value) => {
    const currentValues = filters[key] || []
    const newValues = currentValues.includes(value)
      ? []
      : [value]
    onFilterChange({ ...filters, [key]: newValues })
  }

  // Check if filter is active
  const isChecked = (key, value) => {
    const values = filters[key] || []
    return values.includes(value)
  }

  const clearFilters = () => {
    onFilterChange({
      category: [],
      gender: [],
      brand: [],
      size: [],
      fabric: [],
      product_type: [],
      color: [],
      pattern: [],
      fit: [],
      occasion: [],
      age_group: [],
      sleeve_type: [],
      price_range: [],
      min_rating: [],
      discount: [],
      fast_delivery: false,
      in_stock: false,
      search: filters.search, // Keep search term
      ordering: filters.ordering, // Keep sorting
    })
  }

  const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'search' || key === 'ordering') return count
    if (Array.isArray(value)) return count + value.length
    if (typeof value === 'boolean') return count + (value ? 1 : 0)
    return count + (value ? 1 : 0)
  }, 0)

  const genderOptions = [
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'unisex', label: 'Unisex' },
    { value: 'kids', label: 'Kids' },
  ]

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38']
  const colorOptions = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Grey', 'Brown', 'Orange', 'Beige', 'Navy']
  const brandOptions = ['Nike', 'Adidas', 'Puma', 'Levi\'s', 'Zara', 'H&M', 'Uniqlo', 'Mango', 'Forever 21', 'Calvin Klein']
  const fabricOptions = ['Cotton', 'Polyester', 'Silk', 'Wool', 'Linen', 'Denim', 'Rayon', 'Nylon', 'Velvet', 'Satin']
  const patternOptions = ['Solid', 'Striped', 'Checked', 'Printed', 'Floral', 'Geometric', 'Polka Dot', 'Abstract', 'Camouflage']
  const fitOptions = ['Slim', 'Regular', 'Loose', 'Oversized', 'Skinny', 'Straight', 'Bootcut', 'Relaxed']
  const occasionOptions = ['Casual', 'Formal', 'Party', 'Wedding', 'Office', 'Sports', 'Travel', 'Daily Wear', 'Festive']
  const sleeveOptions = ['Full Sleeve', 'Half Sleeve', 'Sleeveless', '3/4 Sleeve', 'Cap Sleeve', 'Roll-up Sleeve']
  const ageOptions = ['0-2 yrs', '2-5 yrs', '5-10 yrs', '10-16 yrs', '16+ yrs', 'Adult']
  const discountOptions = [
    { value: '10', label: '10% or more' },
    { value: '20', label: '20% or more' },
    { value: '30', label: '30% or more' },
    { value: '40', label: '40% or more' },
    { value: '50', label: '50% or more' },
  ]
  const priceRangeOptions = [
    { value: '0-500', label: 'Under ₹500' },
    { value: '500-1000', label: '₹500 - ₹1000' },
    { value: '1000-2000', label: '₹1000 - ₹2000' },
    { value: '2000-5000', label: '₹2000 - ₹5000' },
    { value: '5000-10000', label: '₹5000 - ₹10000' },
    { value: '10000+', label: 'Over ₹10000' },
  ]
  const ratingOptions = [
    { value: '4', label: '4★ & above' },
    { value: '3', label: '3★ & above' },
    { value: '2', label: '2★ & above' },
  ]

  const renderFilterSection = (title, key, options) => {
    const activeCount = (filters[key] || []).length
    return (
      <div className="border-b dark:border-gray-700 pb-4 mb-4">
        <button
          onClick={() => setExpanded({ ...expanded, [key]: !expanded[key] })}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="font-medium uppercase text-sm tracking-wide dark:text-gray-200">
            {title}
            {activeCount > 0 && (
              <span className="ml-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs px-2 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </span>
          {expanded[key] ? <ChevronUp className="w-4 h-4 dark:text-gray-400" /> : <ChevronDown className="w-4 h-4 dark:text-gray-400" />}
        </button>
        {expanded[key] && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {options.map((option) => {
              const value = typeof option === 'string' ? option.toLowerCase() : option.value
              const label = typeof option === 'string' ? option : option.label
              return (
                <label key={value} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={isChecked(key, value)}
                    onChange={() => toggleArrayFilter(key, value)}
                    className="mr-2 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 h-4 w-4 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-800 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg dark:text-gray-100">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-b dark:border-gray-700 pb-4 mb-4">
        <button
          onClick={() => setExpanded({ ...expanded, category: !expanded.category })}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="font-medium uppercase text-sm tracking-wide dark:text-gray-200">
            Categories
            {(filters.category || []).length > 0 && (
              <span className="ml-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs px-2 py-0.5 rounded-full">
                {(filters.category || []).length}
              </span>
            )}
          </span>
          {expanded.category ? <ChevronUp className="w-4 h-4 dark:text-gray-400" /> : <ChevronDown className="w-4 h-4 dark:text-gray-400" />}
        </button>
        {expanded.category && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {(categories || []).map((category) => (
              <label key={category.id} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                <input
                  type="checkbox"
                  checked={isChecked('category', category.slug)}
                  onChange={() => toggleArrayFilter('category', category.slug)}
                  className="mr-2 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 h-4 w-4 dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Gender */}
      {renderFilterSection('Gender', 'gender', genderOptions)}

      {/* Brand */}
      {renderFilterSection('Brand', 'brand', brandOptions)}

      {/* Size */}
      {renderFilterSection('Size', 'size', sizeOptions)}

      {/* Fabric */}
      {renderFilterSection('Fabric', 'fabric', fabricOptions)}

      {/* Type */}
      {renderFilterSection('Type', 'product_type', [
        { value: 't-shirt', label: 'T-shirt' },
        { value: 'shirt', label: 'Shirt' },
        { value: 'jeans', label: 'Jeans' },
        { value: 'trousers', label: 'Trousers' },
        { value: 'shorts', label: 'Shorts' },
        { value: 'dress', label: 'Dress' },
        { value: 'skirt', label: 'Skirt' },
        { value: 'jacket', label: 'Jacket' },
        { value: 'sweater', label: 'Sweater' },
        { value: 'suit', label: 'Suit' },
      ])}

      {/* Color */}
      {renderFilterSection('Color', 'color', colorOptions)}

      {/* Pattern */}
      {renderFilterSection('Pattern', 'pattern', patternOptions)}

      {/* Fit */}
      {renderFilterSection('Fit', 'fit', fitOptions)}

      {/* Occasion */}
      {renderFilterSection('Occasion', 'occasion', occasionOptions)}

      {/* Age/Size */}
      {renderFilterSection('Age/Size', 'age_group', ageOptions)}

      {/* Sleeve Type */}
      {renderFilterSection('Sleeve Type', 'sleeve_type', sleeveOptions)}

      {/* Price Range - Checkbox Version */}
      <div className="border-b dark:border-gray-700 pb-4 mb-4">
        <button
          onClick={() => setExpanded({ ...expanded, price: !expanded.price })}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="font-medium uppercase text-sm tracking-wide dark:text-gray-200">
            Price
            {(filters.price_range || []).length > 0 && (
              <span className="ml-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs px-2 py-0.5 rounded-full">
                {(filters.price_range || []).length}
              </span>
            )}
          </span>
          {expanded.price ? <ChevronUp className="w-4 h-4 dark:text-gray-400" /> : <ChevronDown className="w-4 h-4 dark:text-gray-400" />}
        </button>
        {expanded.price && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {priceRangeOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                <input
                  type="checkbox"
                  checked={isChecked('price_range', option.value)}
                  onChange={() => toggleSingleInArray('price_range', option.value)}
                  className="mr-2 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 h-4 w-4 dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Discount */}
      <div className="border-b dark:border-gray-700 pb-4 mb-4">
        <button
          onClick={() => setExpanded({ ...expanded, discount: !expanded.discount })}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="font-medium uppercase text-sm tracking-wide dark:text-gray-200">
            Discount
            {(filters.discount || []).length > 0 && (
              <span className="ml-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs px-2 py-0.5 rounded-full">
                {(filters.discount || []).length}
              </span>
            )}
          </span>
          {expanded.discount ? <ChevronUp className="w-4 h-4 dark:text-gray-400" /> : <ChevronDown className="w-4 h-4 dark:text-gray-400" />}
        </button>
        {expanded.discount && (
          <div className="space-y-2">
            {discountOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                <input
                  type="checkbox"
                  checked={isChecked('discount', option.value)}
                  onChange={() => toggleArrayFilter('discount', option.value)}
                  className="mr-2 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 h-4 w-4 dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Customer Ratings */}
      <div className="border-b dark:border-gray-700 pb-4 mb-4">
        <button
          onClick={() => setExpanded({ ...expanded, rating: !expanded.rating })}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="font-medium uppercase text-sm tracking-wide dark:text-gray-200">
            Customer Ratings
            {(filters.min_rating || []).length > 0 && (
              <span className="ml-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs px-2 py-0.5 rounded-full">
                {(filters.min_rating || []).length}
              </span>
            )}
          </span>
          {expanded.rating ? <ChevronUp className="w-4 h-4 dark:text-gray-400" /> : <ChevronDown className="w-4 h-4 dark:text-gray-400" />}
        </button>
        {expanded.rating && (
          <div className="space-y-2">
            {ratingOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                <input
                  type="checkbox"
                  checked={isChecked('min_rating', option.value)}
                  onChange={() => toggleArrayFilter('min_rating', option.value)}
                  className="mr-2 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 h-4 w-4 dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                  {option.label}
                  <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" />
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Availability / Stock */}
      <div className="border-b dark:border-gray-700 pb-4 mb-4">
        <button
          onClick={() => setExpanded({ ...expanded, stock: !expanded.stock })}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="font-medium uppercase text-sm tracking-wide dark:text-gray-200">Availability</span>
          {expanded.stock ? <ChevronUp className="w-4 h-4 dark:text-gray-400" /> : <ChevronDown className="w-4 h-4 dark:text-gray-400" />}
        </button>
        {expanded.stock && (
          <label className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
            <input
              type="checkbox"
              checked={filters.in_stock}
              onChange={(e) => onFilterChange({ ...filters, in_stock: e.target.checked })}
              className="mr-2 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 h-4 w-4 dark:bg-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
          </label>
        )}
      </div>

      {/* Delivery */}
      <div className="mb-4">
        <button
          onClick={() => setExpanded({ ...expanded, delivery: !expanded.delivery })}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="font-medium uppercase text-sm tracking-wide dark:text-gray-200">Delivery</span>
          {expanded.delivery ? <ChevronUp className="w-4 h-4 dark:text-gray-400" /> : <ChevronDown className="w-4 h-4 dark:text-gray-400" />}
        </button>
        {expanded.delivery && (
          <label className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
            <input
              type="checkbox"
              checked={filters.fast_delivery}
              onChange={(e) => onFilterChange({ ...filters, fast_delivery: e.target.checked })}
              className="mr-2 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 h-4 w-4 dark:bg-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Fast Delivery</span>
          </label>
        )}
      </div>

      {/* Apply Button - Mobile Only */}
      {onApply && (
        <button
          onClick={onApply}
          className="lg:hidden w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors mb-4"
        >
          Apply {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''} Filters
        </button>
      )}
    </div>
  )
}
