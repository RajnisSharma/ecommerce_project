import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI } from '../../services/api';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  loading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.items = action.payload.items || [];
      state.total = action.payload.total || 0;
    });
  },
});

export default cartSlice.reducer;
