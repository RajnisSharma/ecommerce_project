import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI } from '../../services/api';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrders();
      return response.data.results || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
  },
});

export default orderSlice.reducer;
