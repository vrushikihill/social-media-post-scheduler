// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch customer feedback
export const fetchCustomerFeedback = createAsyncThunk('fetchCustomerFeedback', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/customer-feedback', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create customer feedback
export const createCustomerFeedback = createAsyncThunk('createCustomerFeedback', async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData()

    formData.append('file', data.image[0]) // Ensure this matches backend `@UploadedFile()`
    formData.append('name', data.name)
    formData.append('feedback', data.feedback)
    formData.append('rating', data.rating)
    formData.append('userId', data.userId)

    const res = await api.post('/v1/customer-feedback', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update customer feedback
export const updateCustomerFeedback = createAsyncThunk('updateCustomerFeedback', async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData()

    if (data.image) formData.append('file', data.image[0]) // Ensure this matches backend `@UploadedFile()`
    formData.append('name', data.name)
    formData.append('feedback', data.feedback)
    formData.append('rating', data.rating)
    formData.append('userId', data.userId)

    const res = await api.put(`/v1/customer-feedback/${data.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete customer feedback

export const deleteCustomerFeedback = createAsyncThunk('deleteCustomerFeedback', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/customer-feedback/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appCustomerFeedbackSlice = createSlice({
  name: 'appCustomerFeedback',
  initialState: {
    customerFeedbacks: {
      data: [],
      customerFeedback: null,
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      creating: false,
      updating: false,
      deleting: false
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchCustomerFeedback.pending, state => {
      state.customerFeedbacks.loading = true
    })
    builder.addCase(fetchCustomerFeedback.fulfilled, (state, action) => {
      state.customerFeedbacks = action.payload
      state.customerFeedbacks.loading = false
      state.customerFeedbacks.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchCustomerFeedback.rejected, state => {
      state.customerFeedbacks.loading = false
    })

    builder.addCase(createCustomerFeedback.pending, state => {
      state.customerFeedbacks.creating = true
    })
    builder.addCase(createCustomerFeedback.fulfilled, (state, action) => {
      state.customerFeedbacks.data = [action.payload.data, ...state.customerFeedbacks.data]
      state.customerFeedbacks.creating = false
    })
    builder.addCase(createCustomerFeedback.rejected, state => {
      state.customerFeedbacks.creating = false
    })

    builder.addCase(updateCustomerFeedback.pending, state => {
      state.customerFeedbacks.updating = true
    })
    builder.addCase(updateCustomerFeedback.fulfilled, (state, action) => {
      state.customerFeedbacks.data = state.customerFeedbacks.data.map(customerFeedback => {
        if (customerFeedback.id === action.payload.data.id) {
          return action.payload.data
        }

        return customerFeedback
      })
      state.customerFeedbacks.updating = false
    })
    builder.addCase(updateCustomerFeedback.rejected, state => {
      state.customerFeedbacks.updating = false
    })

    builder.addCase(deleteCustomerFeedback.pending, state => {
      state.customerFeedbacks.deleting = true
    })
    builder.addCase(deleteCustomerFeedback.fulfilled, (state, action) => {
      state.customerFeedbacks.data = state.customerFeedbacks.data.filter(
        customerFeedback => customerFeedback.id !== action.payload.data.id
      )
      state.customerFeedbacks.deleting = false
      state.customerFeedbacks.total = state.customerFeedbacks.total - 1
    })
    builder.addCase(deleteCustomerFeedback.rejected, state => {
      state.customerFeedbacks.deleting = false
    })
  }
})

export default appCustomerFeedbackSlice.reducer
