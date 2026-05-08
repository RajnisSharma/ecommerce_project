import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react'
import { fetchFeaturedProducts, fetchRecommendations } from '../store/slices/productSlice'
import ProductCard from '../components/product/ProductCard'
import Loader from '../components/common/Loader'

export default function HomePage() {
  const dispatch = useDispatch()
  const { featuredProducts, recommendations, loading } = useSelector((state) => state.products)
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchFeaturedProducts())
    if (isAuthenticated) {
      dispatch(fetchRecommendations())
    }
  }, [dispatch, isAuthenticated])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to Our Store
              </h1>
              <p className="text-lg mb-6 text-primary-100">
                Discover amazing products at unbeatable prices. Shop the latest trends and enjoy a seamless shopping experience.
              </p>
              <Link to="/products" className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div className="hidden md:block">
              <img
                src="/hero-image.jpg"
                alt="Shopping"
                className="rounded-lg shadow-lg"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-sm">
              <Truck className="w-10 h-10 text-primary-600" />
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-gray-500">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-sm">
              <Shield className="w-10 h-10 text-primary-600" />
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-gray-500">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-sm">
              <Headphones className="w-10 h-10 text-primary-600" />
              <div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-gray-500">Dedicated support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
          {loading ? (
            <Loader className="h-64" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(featuredProducts || []).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recommendations */}
      {isAuthenticated && (recommendations || []).length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Recommended for You</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(recommendations || []).slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
