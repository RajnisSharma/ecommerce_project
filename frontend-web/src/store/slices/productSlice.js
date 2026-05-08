import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productsAPI, recommendationsAPI } from '../../services/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getProducts(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products')
    }
  }
)

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getProduct(slug)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch product')
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getCategories()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch categories')
    }
  }
)

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getFeatured()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch featured products')
    }
  }
)

export const fetchRecommendations = createAsyncThunk(
  'products/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await recommendationsAPI.getPersonalized()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch recommendations')
    }
  }
)

const initialState = {
  products: [],
  product: null,
  categories: [],
  featuredProducts: [],
  recommendations: [],
  pagination: null,
  loading: false,
  error: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.results || action.payload
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false
        state.product = action.payload
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.results || action.payload
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload.results || action.payload
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload.results || action.payload
      })
  },
})

export const { clearProduct } = productSlice.actions
export default productSlice.reducer
