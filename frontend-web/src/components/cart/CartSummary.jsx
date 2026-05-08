import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Gift } from 'lucide-react'

export default function CartSummary({ cart }) {
  const subtotal = cart.total || 0
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (8%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-xl text-primary-600">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {shipping === 0 ? (
        <div className="flex items-center text-green-600 text-sm mb-4">
          <Gift className="w-4 h-4 mr-2" />
          <span>You qualified for free shipping!</span>
        </div>
      ) : (
        <div className="flex items-center text-gray-500 text-sm mb-4">
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
