import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { wishlistAPI } from '../services/api'
import ProductCard from '../components/product/ProductCard'
import Loader from '../components/common/Loader'

export default function WishlistPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    wishlistAPI.getWishlist()
      .then((response) => setItems(response.data.results || response.data))
      .catch(() => toast.error('Failed to load wishlist'))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (wishlistId) => {
    try {
      await wishlistAPI.removeFromWishlist(wishlistId)
      setItems((current) => current.filter((item) => item.id !== wishlistId))
      toast.success('Removed from wishlist')
    } catch {
      toast.error('Failed to remove item')
    }
  }

  if (loading) return <Loader className="h-96" />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <ProductCard product={item.product} />
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 text-red-600"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
