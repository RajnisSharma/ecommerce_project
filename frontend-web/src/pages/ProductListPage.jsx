import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { fetchProducts, fetchCategories } from '../store/slices/productSlice'
import ProductCard from '../components/product/ProductCard'
import ProductFilter from '../components/product/ProductFilter'
import Loader from '../components/common/Loader'

export default function ProductListPage() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, categories, pagination, loading } = useSelector((state) => state.products)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    brand: searchParams.get('brand') || '',
    size: searchParams.get('size') || '',
    fabric: searchParams.get('fabric') || '',
    product_type: searchParams.get('product_type') || '',
    color: searchParams.get('color') || '',
    pattern: searchParams.get('pattern') || '',
    fit: searchParams.get('fit') || '',
    occasion: searchParams.get('occasion') || '',
    age_group: searchParams.get('age_group') || '',
    sleeve_type: searchParams.get('sleeve_type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    discount: searchParams.get('discount') || '',
    min_rating: searchParams.get('min_rating') || '',
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
    if (filters.category) params.category_slug = filters.category
    if (filters.gender) params.gender = filters.gender
    if (filters.brand) params.brand = filters.brand
    if (filters.size) params.size = filters.size
    if (filters.fabric) params.fabric = filters.fabric
    if (filters.product_type) params.product_type = filters.product_type
    if (filters.color) params.color = filters.color
    if (filters.pattern) params.pattern = filters.pattern
    if (filters.fit) params.fit = filters.fit
    if (filters.occasion) params.occasion = filters.occasion
    if (filters.age_group) params.age_group = filters.age_group
    if (filters.sleeve_type) params.sleeve_type = filters.sleeve_type
    if (filters.min_price) params.min_price = filters.min_price
    if (filters.max_price) params.max_price = filters.max_price
    if (filters.discount) params.discount_percentage__gte = filters.discount
    if (filters.min_rating) params.min_rating = filters.min_rating
    if (filters.fast_delivery) params.fast_delivery = true
    if (filters.search) params.search = filters.search
    if (filters.in_stock) params.in_stock = true
    if (filters.ordering) params.ordering = filters.ordering

    dispatch(fetchProducts(params))

    // Update URL
    const urlParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) urlParams.set(key, value)
    })
    setSearchParams(urlParams)
  }, [filters, dispatch, setSearchParams])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filters.search}
            onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>
          <select
            value={filters.ordering}
            onChange={(e) => handleFilterChange({ ...filters, ordering: e.target.value })}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            categories={categories}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <Loader className="h-96" />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
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
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                      Previous
                    </button>
                  )}
                  {pagination.next && (
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
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
