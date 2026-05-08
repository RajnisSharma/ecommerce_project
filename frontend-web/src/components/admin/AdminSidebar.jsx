import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Users, label: 'Users', path: '/admin/users' },
]

export default function AdminSidebar() {
  const location = useLocation()
  const dispatch = useDispatch()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-3 hover:bg-gray-800 transition-colors ${
                isActive ? 'bg-gray-800 border-l-4 border-primary-500' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-6 mt-6">
        <a
          href="/django-admin/"
          className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Django Admin</span>
        </a>
      </div>

      <div className="absolute bottom-0 w-64 p-6">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
