// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch Request Demo User
export const fetchRequestDemoUser = createAsyncThunk('fetchRequestDemoUser', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/demo-requests', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete Request Demo User

export const deleteRequestDemoUser = createAsyncThunk('deleteRequestDemoUser', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/demo-requests/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appRequestDemoUserSlice = createSlice({
  name: 'appRequestDemoUser',
  initialState: {
    requestDemoUsers: {
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      deleting: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchRequestDemoUser.pending, state => {
      state.requestDemoUsers.loading = true
    })
    builder.addCase(fetchRequestDemoUser.fulfilled, (state, action) => {
      state.requestDemoUsers = action.payload
      state.requestDemoUsers.loading = false
      state.requestDemoUsers.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchRequestDemoUser.rejected, state => {
      state.requestDemoUsers.loading = false
    })

    builder.addCase(deleteRequestDemoUser.pending, state => {
      state.requestDemoUsers.deleting = true
    })
    builder.addCase(deleteRequestDemoUser.fulfilled, (state, action) => {
      state.requestDemoUsers.data = state.requestDemoUsers.data.filter(
        requestDemoUser => requestDemoUser.id !== action.payload.data.id
      )
      state.requestDemoUsers.deleting = false
      state.requestDemoUsers.total = state.requestDemoUsers.total - 1
    })
    builder.addCase(deleteRequestDemoUser.rejected, state => {
      state.requestDemoUsers.deleting = false
    })
  }
})

export default appRequestDemoUserSlice.reducer
