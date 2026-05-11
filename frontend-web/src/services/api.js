import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for token refresh
let isRefreshing = false
let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // If already refreshing, wait for it to complete
      if (isRefreshing) {
        try {
          await refreshPromise
          originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
          return api(originalRequest)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }

      isRefreshing = true
      refreshPromise = (async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token')
          if (!refreshToken) {
            throw new Error('No refresh token')
          }
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          })

          const { access } = response.data
          localStorage.setItem('access_token', access)
          return access
        } catch (err) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
          throw err
        } finally {
          isRefreshing = false
          refreshPromise = null
        }
      })()

      try {
        const access = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (data) => api.post('/auth/register/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => {
    // Handle FormData for avatar upload
    if (data instanceof FormData) {
      return api.patch('/auth/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.patch('/auth/profile/', data)
  },
  changePassword: (data) => api.post('/auth/password/change/', data),
  getAddresses: () => api.get('/auth/addresses/'),
  addAddress: (data) => api.post('/auth/addresses/', data),
  updateAddress: (id, data) => api.patch(`/auth/addresses/${id}/`, data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}/`),
  requestPasswordReset: (data) => api.post('/auth/password/reset/', data),
  verifyPasswordReset: (data) => api.post('/auth/password/reset/verify/', data),
}

// Staff/Admin API
export const adminAPI = {
  getStats: () => api.get('/auth/admin/stats/'),
  getUsers: () => api.get('/auth/admin/users/'),
  getProducts: (params) => api.get('/products/admin/', { params }),
  getOrders: () => api.get('/orders/admin/'),
}

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products/', { params }),
  getProduct: (slug) => api.get(`/products/${slug}/`),
  getCategories: () => api.get('/products/categories/'),
  getFeatured: () => api.get('/products/featured/'),
  getReviews: (productId) => api.get(`/products/${productId}/reviews/`),
  addReview: (productId, data) => api.post(`/products/${productId}/reviews/`, data),
}

// Orders API
export const ordersAPI = {
  getOrders: () => api.get('/orders/'),
  getOrder: (id) => api.get(`/orders/${id}/`),
  createOrder: (data) => api.post('/orders/', data),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel/`),
  getCart: () => api.get('/orders/cart/'),
  addToCart: (data) => api.post('/orders/cart/items/', data),
  updateCartItem: (id, data) => api.patch(`/orders/cart/items/${id}/`, data),
  removeCartItem: (id) => api.delete(`/orders/cart/items/${id}/remove/`),
  checkout: () => api.get('/orders/checkout/'),
}

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get('/products/wishlist/'),
  addToWishlist: (productId) => api.post('/products/wishlist/', { product_id: productId }),
  removeFromWishlist: (id) => api.delete(`/products/wishlist/${id}/`),
}

// Notifications API
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications/'),
  markAsRead: (id) => api.post(`/notifications/${id}/read/`),
  markAllAsRead: () => api.post('/notifications/read-all/'),
  deleteNotification: (id) => api.delete(`/notifications/${id}/`),
}

// Recommendations API
export const recommendationsAPI = {
  getPersonalized: () => api.get('/recommendations/personalized/'),
  getSimilar: (productId) => api.get(`/recommendations/similar/${productId}/`),
  getTrending: () => api.get('/recommendations/trending/'),
  getFrequentlyBought: (productId) => api.get(`/recommendations/frequently-bought/${productId}/`),
}

export default api
