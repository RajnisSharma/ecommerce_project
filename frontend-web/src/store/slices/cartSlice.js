import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ordersAPI } from '../../services/api'

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getCart()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.addToCart({ product_id: productId, quantity })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add to cart')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.updateCartItem(itemId, { quantity })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update cart')
    }
  }
)

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.removeCartItem(itemId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove item')
    }
  }
)

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || []
        state.total = action.payload.total || 0
        state.itemCount = action.payload.item_count || 0
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || []
        state.total = action.payload.total || 0
        state.itemCount = action.payload.item_count || 0
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || []
        state.total = action.payload.total || 0
        state.itemCount = action.payload.item_count || 0
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || []
        state.total = action.payload.total || 0
        state.itemCount = action.payload.item_count || 0
      })
  },
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer
