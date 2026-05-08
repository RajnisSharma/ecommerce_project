import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error('Network Error - Check if:', error.message);
      console.error('1. Backend server is running (py manage.py runserver)');
      console.error('2. IP address in constants.js is correct');
      console.error('3. Phone/Emulator is on same WiFi network');
    } else if (error.response.status === 401) {
      console.error('Unauthorized - Token expired or invalid');
      // Clear tokens on 401
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (data) => api.post('/auth/register/', data),
  getProfile: () => api.get('/auth/profile/'),
};

export const productsAPI = {
  getProducts: (params) => api.get('/products/', { params }),
  getProduct: (slug) => api.get(`/products/${slug}/`),
  getCategories: () => api.get('/products/categories/'),
};

export const ordersAPI = {
  getOrders: () => api.get('/orders/'),
  getCart: () => api.get('/orders/cart/'),
  addToCart: (data) => api.post('/orders/cart/items/', data),
};

export default api;
