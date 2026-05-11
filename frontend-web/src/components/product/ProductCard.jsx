import { Link } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { addToCart } from '../../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../../store/slices/wishlistSlice'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { items, productIds } = useSelector((state) => state.wishlist)

  // Check if this product is in wishlist
  const isInWishlist = productIds.includes(product.id)
  const wishlistItem = items.find(item => item.product.id === product.id)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist())
    }
  }, [dispatch, isAuthenticated])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }
    dispatch(addToCart({ productId: product.id, quantity: 1 }))
      .unwrap()
      .then(() => toast.success('Added to cart'))
      .catch(() => toast.error('Failed to add to cart'))
  }

  const handleWishlistToggle = async (event) => {
    event.preventDefault()
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

  const imageUrl = product.primary_image?.image || '/placeholder-product.jpg'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link to={`/products/${product.slug}`} className="relative block bg-gray-100 dark:bg-gray-700 flex items-center justify-center h-48">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-2"
        />
        {product.compare_at_price && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Sale
          </span>
        )}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isInWishlist
              ? 'text-red-500 fill-red-500'
              : 'text-gray-600 dark:text-gray-400 hover:text-red-400'
              }`}
          />
        </button>
      </Link>

      <div className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{product.category_name}</p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
            {product.average_rating > 0 ? product.average_rating.toFixed(1) : 'No ratings'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${product.price}</span>
            {product.compare_at_price && (
              <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                ${product.compare_at_price}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="btn-primary text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
