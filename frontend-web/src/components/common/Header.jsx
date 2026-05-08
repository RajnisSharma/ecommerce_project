import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCart, User, Heart, Menu, X, Bell } from 'lucide-react'
import { useState } from 'react'
import { logout } from '../../store/slices/authSlice'

export default function Header() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { itemCount } = useSelector((state) => state.cart)
  const { unreadCount } = useSelector((state) => state.notifications)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary-600">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-primary-600">
              Products
            </Link>
            {isAuthenticated && user?.is_staff && (
              <Link to="/admin" className="text-gray-600 hover:text-primary-600">
                Staff
              </Link>
            )}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <Link to="/wishlist" className="relative text-gray-600 hover:text-primary-600">
                  <Heart className="w-6 h-6" />
                </Link>
                <Link to="/cart" className="relative text-gray-600 hover:text-primary-600">
                  <ShoppingCart className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link to="/notifications" className="relative text-gray-600 hover:text-primary-600">
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                  <User className="w-6 h-6" />
                  <span className="hidden sm:inline">{user?.first_name || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-primary-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="text-gray-600 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                Products
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/orders" className="text-gray-600 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                    Orders
                  </Link>
                  <Link to="/profile" className="text-gray-600 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  {user?.is_staff && (
                    <Link to="/admin" className="text-gray-600 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                      Staff
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
