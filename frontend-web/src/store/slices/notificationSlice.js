import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notificationsAPI } from '../../services/api'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsAPI.getNotifications()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch notifications')
    }
  }
)

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      await notificationsAPI.markAsRead(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to mark as read')
    }
  }
)

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationsAPI.markAllAsRead()
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to mark all as read')
    }
  }
)

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
      state.unreadCount += 1
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload.results || action.payload
        state.unreadCount = state.notifications.filter(n => !n.is_read).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload)
        if (notification) {
          notification.is_read = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.is_read = true)
        state.unreadCount = 0
      })
  },
})

export const { addNotification, updateUnreadCount } = notificationSlice.actions
export default notificationSlice.reducer
