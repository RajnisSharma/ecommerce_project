import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react'
import AdminSidebar from '../components/admin/AdminSidebar'
import { fetchAdminStats } from '../store/slices/adminSlice'

export default function AdminDashboardPage() {
  const dispatch = useDispatch()
  const { stats } = useSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAdminStats())
  }, [dispatch])

  const statCards = [
    { icon: DollarSign, label: 'Total Revenue', value: `$${Number(stats?.totalRevenue || 0).toFixed(2)}`, color: 'bg-green-100 text-green-600' },
    { icon: ShoppingBag, label: 'Total Orders', value: stats?.totalOrders || 0, color: 'bg-blue-100 text-blue-600' },
    { icon: Users, label: 'Total Users', value: stats?.totalUsers || 0, color: 'bg-purple-100 text-purple-600' },
    { icon: Package, label: 'Products', value: stats?.totalProducts || 0, color: 'bg-orange-100 text-orange-600' },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, idx) => {
            const Icon = card.icon
            return (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-semibold text-lg mb-4">Orders by Status</h2>
            <div className="space-y-3">
              {Object.entries(stats?.ordersByStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize text-gray-600">{status}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-semibold text-lg mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {(stats?.recentOrders || []).map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-sm text-gray-500">{order.customer_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total_amount}</p>
                    <p className="text-sm capitalize text-gray-500">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
