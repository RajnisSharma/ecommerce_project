import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { fetchProducts, fetchCategories } from '../store/slices/productSlice'
import ProductCard from '../components/product/ProductCard'
import ProductFilter from '../components/product/ProductFilter'
import Loader from '../components/common/Loader'

export default function ProductListPage() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, categories, pagination, loading } = useSelector((state) => state.products)
  const [showFilters, setShowFilters] = useState(false)

  // Helper to parse comma-separated URL params into arrays
  const parseArrayParam = (param) => {
    const value = searchParams.get(param)
    return value ? value.split(',') : []
  }

  const [filters, setFilters] = useState({
    category: parseArrayParam('category'),
    gender: parseArrayParam('gender'),
    brand: parseArrayParam('brand'),
    size: parseArrayParam('size'),
    fabric: parseArrayParam('fabric'),
    product_type: parseArrayParam('product_type'),
    color: parseArrayParam('color'),
    pattern: parseArrayParam('pattern'),
    fit: parseArrayParam('fit'),
    occasion: parseArrayParam('occasion'),
    age_group: parseArrayParam('age_group'),
    sleeve_type: parseArrayParam('sleeve_type'),
    price_range: parseArrayParam('price_range'),
    discount: parseArrayParam('discount'),
    min_rating: parseArrayParam('min_rating'),
    fast_delivery: searchParams.get('fast_delivery') === 'true',
    search: searchParams.get('search') || '',
    in_stock: searchParams.get('in_stock') === 'true',
    ordering: searchParams.get('ordering') || '',
  })

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const params = {}

    // Handle array filters - send as comma-separated for backend
    if (filters.category.length > 0) params.category_slug = filters.category.join(',')
    if (filters.gender.length > 0) params.gender = filters.gender.join(',')
    if (filters.brand.length > 0) params.brand = filters.brand.join(',')
    if (filters.size.length > 0) params.size = filters.size.join(',')
    if (filters.fabric.length > 0) params.fabric = filters.fabric.join(',')
    if (filters.product_type.length > 0) params.product_type = filters.product_type.join(',')
    if (filters.color.length > 0) params.color = filters.color.join(',')
    if (filters.pattern.length > 0) params.pattern = filters.pattern.join(',')
    if (filters.fit.length > 0) params.fit = filters.fit.join(',')
    if (filters.occasion.length > 0) params.occasion = filters.occasion.join(',')
    if (filters.age_group.length > 0) params.age_group = filters.age_group.join(',')
    if (filters.sleeve_type.length > 0) params.sleeve_type = filters.sleeve_type.join(',')

    // Handle price ranges - convert to min/max
    if (filters.price_range.length > 0) {
      // Use the first selected price range (single selection for price)
      const range = filters.price_range[0]
      if (range === '0-500') {
        params.min_price = 0
        params.max_price = 500
      } else if (range === '500-1000') {
        params.min_price = 500
        params.max_price = 1000
      } else if (range === '1000-2000') {
        params.min_price = 1000
        params.max_price = 2000
      } else if (range === '2000-5000') {
        params.min_price = 2000
        params.max_price = 5000
      } else if (range === '5000-10000') {
        params.min_price = 5000
        params.max_price = 10000
      } else if (range === '10000+') {
        params.min_price = 10000
      }
    }

    // Handle discount - use the highest selected discount
    if (filters.discount.length > 0) {
      const maxDiscount = Math.max(...filters.discount.map(d => parseInt(d)))
      params.discount_percentage__gte = maxDiscount
    }

    // Handle rating - use the lowest selected rating
    if (filters.min_rating.length > 0) {
      const minRating = Math.min(...filters.min_rating.map(r => parseInt(r)))
      params.min_rating = minRating
    }

    if (filters.fast_delivery) params.fast_delivery = true
    if (filters.search) params.search = filters.search
    if (filters.in_stock) params.in_stock = true
    if (filters.ordering) params.ordering = filters.ordering

    dispatch(fetchProducts(params))

    // Update URL - serialize arrays as comma-separated
    const urlParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        urlParams.set(key, value.join(','))
      } else if (typeof value === 'boolean' && value) {
        urlParams.set(key, 'true')
      } else if (value && !Array.isArray(value)) {
        urlParams.set(key, value)
      }
    })
    setSearchParams(urlParams)
  }, [filters, dispatch, setSearchParams])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    setShowFilters(false) // Close mobile filter panel
  }

  // Count active filters (excluding search and ordering)
  const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'search' || key === 'ordering') return count
    if (Array.isArray(value)) return count + value.length
    if (typeof value === 'boolean') return count + (value ? 1 : 0)
    return count
  }, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            value={filters.search}
            onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 ${showFilters ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'} hover:text-primary-600 dark:hover:text-primary-400`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <select
            value={filters.ordering}
            onChange={(e) => handleFilterChange({ ...filters, ordering: e.target.value })}
            className="border dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">Sort by</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-created_at">Newest First</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onApply={handleApplyFilters}
            categories={categories}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <Loader className="h-96" />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No products found.</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && (
                <div className="flex justify-center mt-8 space-x-2">
                  {pagination.previous && (
                    <button className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300">
                      Previous
                    </button>
                  )}
                  {pagination.next && (
                    <button className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300">
                      Next
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
