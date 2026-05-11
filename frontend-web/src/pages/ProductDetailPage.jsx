import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Heart, Share2, Star, ShoppingCart, Check } from 'lucide-react'
import { fetchProduct, clearProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../store/slices/wishlistSlice'
import ReviewList from '../components/product/ReviewList'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { product, loading } = useSelector((state) => state.products)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { items, productIds } = useSelector((state) => state.wishlist)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    dispatch(fetchProduct(slug))
    return () => dispatch(clearProduct())
  }, [dispatch, slug])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist())
    }
  }, [dispatch, isAuthenticated])

  // Check if this product is in wishlist
  const isInWishlist = product && productIds.includes(product.id)
  const wishlistItem = items.find(item => item.product.id === product?.id)

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }
    dispatch(addToCart({ productId: product.id, quantity }))
      .unwrap()
      .then(() => toast.success('Added to cart'))
      .catch(() => toast.error('Failed to add to cart'))
  }

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist')
      return
    }

    if (isInWishlist && wishlistItem) {
      // Remove from wishlist
      dispatch(removeFromWishlist(wishlistItem.id))
        .unwrap()
        .then(() => toast.success('Removed from wishlist'))
        .catch(() => toast.error('Failed to remove from wishlist'))
    } else {
      // Add to wishlist
      dispatch(addToWishlist(product.id))
        .unwrap()
        .then(() => toast.success('Added to wishlist'))
        .catch(() => toast.error('Failed to add to wishlist'))
    }
  }

  if (loading) return <Loader className="h-96" />
  if (!product) return <div className="text-center py-12">Product not found</div>

  const images = product.images || []
  const reviews = product.reviews || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
            <img
              src={images[selectedImage]?.image || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-auto max-h-[600px] object-contain"
            />
          </div>
          <div className="flex space-x-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-primary-600' : 'border-transparent'
                  }`}
              >
                <img src={img.image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">{product.category?.name}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(product.average_rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              {product.average_rating > 0 ? `${product.average_rating.toFixed(1)} (${reviews.length} reviews)` : 'No reviews'}
            </span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            {product.compare_at_price && (
              <span className="text-xl text-gray-500 line-through">${product.compare_at_price}</span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100">-</button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100">+</button>
            </div>
            <span className="text-sm text-gray-500">
              {product.stock_quantity > 0 ? (
                <span className="flex items-center text-green-600"><Check className="w-4 h-4 mr-1" /> In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </span>
          </div>

          <div className="flex space-x-4 mb-8">
            <button onClick={handleAddToCart} disabled={product.stock_quantity === 0} className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50">
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-3 border rounded-lg hover:bg-gray-50 transition-colors ${isInWishlist ? 'border-red-200 bg-red-50' : ''}`}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-5 h-5 transition-colors ${isInWishlist ? 'text-red-500 fill-red-500' : ''}`} />
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50"><Share2 className="w-5 h-5" /></button>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
            <ReviewList reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  )
}
