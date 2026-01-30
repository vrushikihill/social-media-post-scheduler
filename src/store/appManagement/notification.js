// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'

// ** API

// ** Fetch departments
export const fetchNotification = createAsyncThunk(
  'appSetting/fetchNotification',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/v1/super-admin-notifications', { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Create Notification
export const createNotification = createAsyncThunk(
  'appAppManagement/createNotification',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/v1/super-admin-notifications', {
        organizations: data.organizations,
        title: data.title,
        description: data.description
      })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Repeat Notification
export const repeatNotification = createAsyncThunk(
  'appManagement/repeatNotification',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.post(`/v1/super-admin-notifications/${id}`)

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Slice
export const appNotificationSlice = createSlice({
  name: 'appNotification',
  initialState: {
    notifications: {
      data: [],
      notification: null,
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      creating: false,
      repeating: false,
      updating: false,
      deleting: false
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchNotification.pending, state => {
      state.notifications.loading = true
    })
    builder.addCase(fetchNotification.fulfilled, (state, action) => {
      state.notifications = action.payload
      state.notifications.loading = false
      state.notifications.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchNotification.rejected, state => {
      state.notifications.loading = false
    })

    builder.addCase(createNotification.pending, state => {
      state.notifications.creating = true
    })
    builder.addCase(createNotification.fulfilled, (state, action) => {
      state.notifications.data.push(action.payload.data)
      state.notifications.creating = false
    })
    builder.addCase(createNotification.rejected, state => {
      state.notifications.creating = false
    })

    builder.addCase(repeatNotification.pending, state => {
      state.notifications.repeating = true
    })
    builder.addCase(repeatNotification.fulfilled, (state, action) => {
      if (action.payload.data) {
        state.notifications.data.push(action.payload.data)
      }
      state.notifications.repeating = false
    })
    builder.addCase(repeatNotification.rejected, state => {
      state.notifications.repeating = false
    })
  }
})

export default appNotificationSlice.reducer
