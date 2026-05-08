import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ordersAPI } from '../../services/api'

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrders()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders')
    }
  }
)

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrder(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch order')
    }
  }
)

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (data, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.createOrder(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create order')
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      await ordersAPI.cancelOrder(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel order')
    }
  }
)

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.results || action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const order = state.orders.find(o => o.id === action.payload)
        if (order) {
          order.status = 'cancelled'
        }
      })
  },
})

export const { clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer
