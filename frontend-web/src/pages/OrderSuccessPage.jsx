import { Link, useParams } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

export default function OrderSuccessPage() {
  const { orderId } = useParams()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
        <p className="text-gray-500 mb-8">Order ID: {orderId}</p>
        
        <div className="space-y-4">
          <Link to={`/orders/${orderId}`} className="flex items-center justify-center w-full btn-primary">
            <Package className="w-5 h-5 mr-2" />
            View Order Details
          </Link>
          <Link to="/products" className="flex items-center justify-center text-primary-600 hover:text-primary-700">
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}
