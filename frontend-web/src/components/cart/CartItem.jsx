import { Minus, Plus, Trash2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { updateCartItem, removeCartItem } from '../../store/slices/cartSlice'
import toast from 'react-hot-toast'

export default function CartItem({ item }) {
  const dispatch = useDispatch()

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return
    dispatch(updateCartItem({ itemId: item.id, quantity: newQuantity }))
      .unwrap()
      .catch(() => toast.error('Failed to update quantity'))
  }

  const handleRemove = () => {
    dispatch(removeCartItem(item.id))
      .unwrap()
      .then(() => toast.success('Item removed from cart'))
      .catch(() => toast.error('Failed to remove item'))
  }

  const product = item.product
  const imageUrl = product?.primary_image?.image || '/placeholder-product.jpg'

  return (
    <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-800">
      <img
        src={imageUrl}
        alt={product?.name}
        className="w-20 h-20 object-cover rounded"
      />

      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{product?.name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{product?.sku}</p>
        <p className="text-primary-600 dark:text-primary-400 font-semibold">${product?.price}</p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          disabled={item.quantity <= 1}
        >
          <Minus className="w-4 h-4 dark:text-gray-300" />
        </button>
        <span className="w-8 text-center font-medium dark:text-gray-100">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Plus className="w-4 h-4 dark:text-gray-300" />
        </button>
      </div>

      <div className="text-right">
        <p className="font-semibold text-gray-900 dark:text-gray-100">${item.subtotal}</p>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-600 mt-2"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
