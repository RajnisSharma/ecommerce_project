import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin } from 'lucide-react'
import { ordersAPI } from '../services/api'
import { fetchCart } from '../store/slices/cartSlice'
import { createOrder } from '../store/slices/orderSlice'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((state) => state.cart)
  const [loading, setLoading] = useState(true)
  const [checkoutData, setCheckoutData] = useState(null)
  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: '',
    payment_method: 'card',
  })

  useEffect(() => {
    dispatch(fetchCart())
    ordersAPI.checkout()
      .then((res) => {
        setCheckoutData(res.data)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load checkout')
        navigate('/cart')
      })
  }, [dispatch, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await dispatch(createOrder(formData)).unwrap()
      navigate(`/order-success/${result.id}`)
    } catch (error) {
      const message = typeof error === 'string' ? error : Object.values(error || {}).flat().join(', ')
      toast.error(message || 'Failed to create order')
    }
  }

  if (loading) return <Loader className="h-96" />
  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const { subtotal, shipping_cost, tax_amount, total } = checkoutData || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 mr-2 text-primary-600" />
              <h2 className="font-semibold text-lg">Shipping Address</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                value={formData.shipping_name} onChange={(e) => setFormData({ ...formData, shipping_name: e.target.value })} />
              <input type="tel" placeholder="Phone" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                value={formData.shipping_phone} onChange={(e) => setFormData({ ...formData, shipping_phone: e.target.value })} />
              <input type="text" placeholder="Address" required className="col-span-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                value={formData.shipping_address} onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })} />
              <input type="text" placeholder="City" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                value={formData.shipping_city} onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })} />
              <input type="text" placeholder="State" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                value={formData.shipping_state} onChange={(e) => setFormData({ ...formData, shipping_state: e.target.value })} />
              <input type="text" placeholder="Postal Code" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                value={formData.shipping_postal_code} onChange={(e) => setFormData({ ...formData, shipping_postal_code: e.target.value })} />
              <input type="text" placeholder="Country" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                value={formData.shipping_country} onChange={(e) => setFormData({ ...formData, shipping_country: e.target.value })} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
              <h2 className="font-semibold text-lg">Payment Method</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="card" checked={formData.payment_method === 'card'}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} className="mr-3" />
                <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="paypal" checked={formData.payment_method === 'paypal'}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} className="mr-3" />
                <span>PayPal</span>
              </label>
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-3 text-lg">
            Place Order - ${total?.toFixed(2)}
          </button>
        </form>

        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${subtotal?.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shipping_cost === 0 ? 'Free' : `$${shipping_cost?.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>${tax_amount?.toFixed(2)}</span></div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-2xl text-primary-600">${total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
