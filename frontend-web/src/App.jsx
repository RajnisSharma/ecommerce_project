import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

// Layout
import Header from './components/common/Header'
import Footer from './components/common/Footer'

// Public Pages
import HomePage from './pages/HomePage'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

// Protected Pages
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import WishlistPage from './pages/WishlistPage'
import NotificationsPage from './pages/NotificationsPage'

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminUsersPage from './pages/AdminUsersPage'

// Routes
import PrivateRoute from './components/common/PrivateRoute'
import AdminRoute from './components/common/AdminRoute'
import { fetchProfile } from './store/slices/authSlice'
import { fetchCart } from './store/slices/cartSlice'
import { fetchNotifications } from './store/slices/notificationSlice'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      dispatch(fetchProfile())
      dispatch(fetchCart())
      dispatch(fetchNotifications())
    }
  }, [dispatch])

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes */}
            <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/order-success/:orderId" element={<PrivateRoute><OrderSuccessPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
            <Route path="/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App
