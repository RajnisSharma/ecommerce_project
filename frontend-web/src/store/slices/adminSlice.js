import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { adminAPI } from '../../services/api'

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getStats()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch stats')
    }
  }
)

export const fetchAdminProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getProducts({ page_size: 100 })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products')
    }
  }
)

export const fetchAdminOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getOrders()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders')
    }
  }
)

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getUsers()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch users')
    }
  }
)

const initialState = {
  stats: null,
  products: [],
  orders: [],
  users: [],
  loading: false,
  error: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.results || action.payload
      })
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.results || action.payload
      })
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.results || action.payload
      })
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default adminSlice.reducer
