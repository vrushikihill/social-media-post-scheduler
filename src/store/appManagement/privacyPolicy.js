// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'

// ** API

// ** Fetch PrivacyPolicy
export const fetchPrivacyPolicy = createAsyncThunk(
  'appAppManagement/fetchPrivacyPolicy',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/v1/privacy-policy', { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Create PrivacyPolicy
export const createPrivacyPolicy = createAsyncThunk(
  'appAppManagement/createPrivacyPolicy',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/v1/privacy-policy', {
        text: data.text
      })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Update PrivacyPolicy
export const updatePrivacyPolicy = createAsyncThunk(
  'appSales/updatePrivacyPolicy',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(`/v1/privacy-policy/${data.id}`, {
        text: data.text
      })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Slice
export const appPrivacyPolicySlice = createSlice({
  name: 'appPrivacyPolicy',
  initialState: {
    privacyPolicies: {
      data: null,
      loading: false,
      creating: false,
      updating: false,
      deleting: false
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchPrivacyPolicy.pending, state => {
      state.privacyPolicies.loading = true
    })
    builder.addCase(fetchPrivacyPolicy.fulfilled, (state, action) => {
      state.privacyPolicies.data = action.payload.data
      state.privacyPolicies.loading = false
    })
    builder.addCase(fetchPrivacyPolicy.rejected, state => {
      state.privacyPolicies.loading = false
    })

    builder.addCase(updatePrivacyPolicy.pending, state => {
      state.privacyPolicies.updating = true
    })
    builder.addCase(updatePrivacyPolicy.fulfilled, (state, action) => {
      state.privacyPolicies.data = action.payload.data
      state.privacyPolicies.updating = false
    })
    builder.addCase(updatePrivacyPolicy.rejected, state => {
      state.privacyPolicies.updating = false
    })

    builder.addCase(createPrivacyPolicy.pending, state => {
      state.privacyPolicies.creating = true
    })
    builder.addCase(createPrivacyPolicy.fulfilled, (state, action) => {
      state.privacyPolicies.data = action.payload.data
      state.privacyPolicies.creating = false
    })
    builder.addCase(createPrivacyPolicy.rejected, state => {
      state.privacyPolicies.creating = false
    })
  }
})

export default appPrivacyPolicySlice.reducer
