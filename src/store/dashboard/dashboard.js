// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch dashboard data
export const fetchDashboard = createAsyncThunk('appSetting/fetchDashboard', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/general/super-admin/dashboard', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appDashboardSlice = createSlice({
  name: 'appDashboard',
  initialState: {
    dashboard: {
      data: null,
      loading: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchDashboard.pending, state => {
      state.dashboard.loading = true
    })
    builder.addCase(fetchDashboard.fulfilled, (state, action) => {
      state.dashboard = action.payload
      state.dashboard.loading = false
    })
    builder.addCase(fetchDashboard.rejected, state => {
      state.dashboard.loading = false
    })
  }
})

export default appDashboardSlice.reducer
