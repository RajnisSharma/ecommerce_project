import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../services/api'

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials)
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      const profile = await authAPI.getProfile()
      return profile.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed')
    }
  }
)

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch profile')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update profile')
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.changePassword(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to change password')
    }
  }
)

export const fetchAddresses = createAsyncThunk(
  'auth/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getAddresses()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch addresses')
    }
  }
)

export const addAddress = createAsyncThunk(
  'auth/addAddress',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.addAddress(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add address')
    }
  }
)

export const updateAddress = createAsyncThunk(
  'auth/updateAddress',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateAddress(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update address')
    }
  }
)

export const deleteAddress = createAsyncThunk(
  'auth/deleteAddress',
  async (id, { rejectWithValue }) => {
    try {
      await authAPI.deleteAddress(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete address')
    }
  }
)

const initialState = {
  user: null,
  addresses: [],
  isAuthenticated: Boolean(localStorage.getItem('access_token')),
  loading: false,
  error: null,
  successMessage: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.addresses = []
      state.isAuthenticated = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },
    setCredentials: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearError: (state) => {
      state.error = null
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.user = null
        state.isAuthenticated = false
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.successMessage = 'Profile updated successfully'
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false
        state.successMessage = 'Password changed successfully'
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false
        state.addresses = action.payload
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Add Address
      .addCase(addAddress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false
        state.addresses.push(action.payload)
        state.successMessage = 'Address added successfully'
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Address
      .addCase(updateAddress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false
        const index = state.addresses.findIndex(a => a.id === action.payload.id)
        if (index !== -1) {
          state.addresses[index] = action.payload
        }
        state.successMessage = 'Address updated successfully'
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false
        state.addresses = state.addresses.filter(a => a.id !== action.payload)
        state.successMessage = 'Address deleted successfully'
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, setCredentials, clearError, clearSuccessMessage } = authSlice.actions
export default authSlice.reducer
