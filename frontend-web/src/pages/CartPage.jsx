import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { fetchCart } from '../store/slices/cartSlice'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import Loader from '../components/common/Loader'

export default function CartPage() {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const { items, loading } = cart

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  if (loading) {
    return <Loader className="h-96" />
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you have not added any items yet.</p>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-8 dark:text-gray-100">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div className="lg:col-span-1">
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
