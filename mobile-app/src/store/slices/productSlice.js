import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getProducts(params);
      return response.data.results || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getProducts({ is_featured: true });
      return response.data.results || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch featured products');
    }
  }
);

const initialState = {
  products: [],
  featuredProducts: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      });
  },
});

export default productSlice.reducer;
