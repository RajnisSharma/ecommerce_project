import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Gift } from 'lucide-react'

export default function CartSummary({ cart }) {
  const subtotal = cart.total || 0
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-800 p-6">
      <h3 className="font-semibold text-lg mb-4 dark:text-gray-100">Order Summary</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="font-medium dark:text-gray-100">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Shipping</span>
          <span className="font-medium dark:text-gray-100">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
          <span className="font-medium dark:text-gray-100">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t dark:border-gray-700 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg dark:text-gray-100">Total</span>
          <span className="font-bold text-xl text-primary-600 dark:text-primary-400">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {shipping === 0 ? (
        <div className="flex items-center text-green-600 dark:text-green-400 text-sm mb-4">
          <Gift className="w-4 h-4 mr-2" />
          <span>You qualified for free shipping!</span>
        </div>
      ) : (
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
          <Truck className="w-4 h-4 mr-2" />
          <span>Add ${(100 - subtotal).toFixed(2)} more for free shipping</span>
        </div>
      )}

      <Link
        to="/checkout"
        className="w-full btn-primary flex items-center justify-center space-x-2"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
