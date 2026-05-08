import { useState } from 'react'
import { ChevronDown, ChevronUp, Star } from 'lucide-react'

export default function ProductFilter({ filters, onFilterChange, categories }) {
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
  })

  const handlePriceChange = (e) => {
    const { name, value } = e.target
    onFilterChange({ ...filters, [name]: value })
  }

  const handleCategoryChange = (categorySlug) => {
    onFilterChange({
      ...filters,
      category: filters.category === categorySlug ? '' : categorySlug,
    })
  }

  const toggleFilter = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: filters[key] === value ? '' : value,
    })
  }

  const clearFilters = () => {
    onFilterChange({
      category: '',
      gender: '',
      brand: '',
      size: '',
      fabric: '',
      product_type: '',
      color: '',
      pattern: '',
      fit: '',
      occasion: '',
      age_group: '',
      sleeve_type: '',
      min_price: '',
      max_price: '',
      min_rating: '',
      discount: '',
      fast_delivery: false,
      in_stock: false,
      search: '',
    })
  }

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

  const renderFilterSection = (title, key, options, isSingle = true) => (
    <div className="border-b pb-4 mb-4">
      <button
        onClick={() => setExpanded({ ...expanded, [key]: !expanded[key] })}
        className="flex items-center justify-between w-full mb-2"
      >
        <span className="font-medium uppercase text-sm tracking-wide">{title}</span>
        {expanded[key] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {expanded[key] && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {options.map((option) => {
            const value = typeof option === 'string' ? option.toLowerCase() : option.value
            const label = typeof option === 'string' ? option : option.label
            return (
              <label key={value} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type={isSingle ? 'radio' : 'checkbox'}
                  name={key}
                  checked={filters[key] === value}
                  onChange={() => toggleFilter(key, value)}
                  className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear all
        </button>
      </div>

      {/* Categories */}
      <div className="border-b pb-4 mb-4">
        <button
          onClick={() => setExpanded({ ...expanded, category: !expanded.category })}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="font-medium uppercase text-sm tracking-wide">Categories</span>
          {expanded.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.category && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {(categories || []).map((category) => (
              <label key={category.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.category === category.slug}
                  onChange={() => handleCategoryChange(category.slug)}
                  className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
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

      {/* Price Range */}
      <div className="border-b pb-4 mb-4">
        <button
          onClick={() => setExpanded({ ...expanded, price: !expanded.price })}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="font-medium uppercase text-sm tracking-wide">Price</span>
          {expanded.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.price && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <select
                name="min_price"
                value={filters.min_price}
                onChange={handlePriceChange}
                className="flex-1 px-2 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Min</option>
                <option value="100">₹100</option>
                <option value="500">₹500</option>
                <option value="1000">₹1000</option>
                <option value="2000">₹2000</option>
                <option value="5000">₹5000</option>
              </select>
              <span className="text-gray-400">to</span>
              <select
                name="max_price"
                value={filters.max_price}
                onChange={handlePriceChange}
                className="flex-1 px-2 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Max</option>
                <option value="500">₹500</option>
                <option value="1000">₹1000</option>
                <option value="2000">₹2000</option>
                <option value="5000">₹5000</option>
                <option value="10000">₹10000+</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Discount */}
      <div className="border-b pb-4 mb-4">
        <button
          onClick={() => setExpanded({ ...expanded, discount: !expanded.discount })}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="font-medium uppercase text-sm tracking-wide">Discount</span>
          {expanded.discount ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.discount && (
          <div className="space-y-2">
            {discountOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="radio"
                  name="discount"
                  checked={filters.discount === option.value}
                  onChange={() => toggleFilter('discount', option.value)}
                  className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Customer Ratings */}
      <div className="border-b pb-4 mb-4">
        <button
          onClick={() => setExpanded({ ...expanded, rating: !expanded.rating })}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="font-medium uppercase text-sm tracking-wide">Customer Ratings</span>
          {expanded.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.rating && (
          <div className="space-y-2">
            {[
              { value: '4', label: '4★ & above' },
              { value: '3', label: '3★ & above' },
            ].map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.min_rating === option.value}
                  onChange={() => toggleFilter('min_rating', option.value)}
                  className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 flex items-center">
                  {option.label}
                  <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" />
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Delivery */}
      <div>
        <button
          onClick={() => setExpanded({ ...expanded, delivery: !expanded.delivery })}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="font-medium uppercase text-sm tracking-wide">Delivery</span>
          {expanded.delivery ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.delivery && (
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="checkbox"
              checked={filters.fast_delivery}
              onChange={(e) => onFilterChange({ ...filters, fast_delivery: e.target.checked })}
              className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Delivery in 1 day</span>
          </label>
        )}
      </div>
    </div>
  )
}
