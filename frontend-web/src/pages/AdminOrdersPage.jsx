import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Eye } from 'lucide-react'
import AdminSidebar from '../components/admin/AdminSidebar'
import { fetchAdminOrders } from '../store/slices/adminSlice'
import Loader from '../components/common/Loader'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrdersPage() {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAdminOrders())
  }, [dispatch])

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-8">Orders</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? <Loader className="h-64" /> : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 font-medium">{order.order_number}</td>
                    <td className="px-6 py-4">{order.user?.email || 'Customer'}</td>
                    <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">${order.total_amount}</td>
                    <td className="px-6 py-4">
                      <button className="text-primary-600 hover:text-primary-700"><Eye className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
