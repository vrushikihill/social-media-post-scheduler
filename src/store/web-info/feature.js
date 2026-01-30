// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch feature
export const fetchFeatures = createAsyncThunk('appFeature/fetchFeatures', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/app-feature', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create feature
export const createFeature = createAsyncThunk('appFeature/createFeature', async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    if (data.image?.[0]) formData.append('image', data.image[0])
    formData.append('title', data.title)

    const res = await api.post('/v1/app-feature', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

// ** Update feature
export const updateFeature = createAsyncThunk('appFeature/updateFeature', async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    if (data.image?.[0]) formData.append('image', data.image[0])
    formData.append('title', data.title)

    const res = await api.put(`/v1/app-feature/${data.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

// ** Delete feature
export const deleteFeature = createAsyncThunk('appFeature/deleteFeature', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/app-feature/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appFeatureSlice = createSlice({
  name: 'appFeature',
  initialState: {
    features: {
      data: null,
      feature: null,
      loading: false,
      creating: false,
      updating: false,
      deleting: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchFeatures.pending, state => {
      state.features.loading = true
    })
    builder.addCase(fetchFeatures.fulfilled, (state, action) => {
      state.features.data = action.payload.data
      state.features.loading = false
    })
    builder.addCase(fetchFeatures.rejected, state => {
      state.features.loading = false
    })

    builder.addCase(createFeature.pending, state => {
      state.features.creating = true
    })
    builder.addCase(createFeature.fulfilled, (state, action) => {
      state.features.data = action.payload.data
      state.features.creating = false
    })
    builder.addCase(createFeature.rejected, state => {
      state.features.creating = false
    })

    builder.addCase(updateFeature.pending, state => {
      state.features.updating = true
    })
    builder.addCase(updateFeature.fulfilled, (state, action) => {
      state.features.data = action.payload.data
      state.features.updating = false
    })
    builder.addCase(updateFeature.rejected, state => {
      state.features.updating = false
    })

    builder.addCase(deleteFeature.pending, state => {
      state.features.deleting = true
    })
    builder.addCase(deleteFeature.fulfilled, (state, action) => {
      state.features.data = state.features.data.filter(feature => feature.id !== action.payload.data.id)
      state.features.deleting = false
    })
    builder.addCase(deleteFeature.rejected, state => {
      state.features.deleting = false
    })
  }
})

export default appFeatureSlice.reducer
