// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch about
export const fetchAboutUs = createAsyncThunk('appAbout/fetchAboutUs', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/web-about-us', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create about
export const createAboutUs = createAsyncThunk('appAbout/createAboutUs', async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    if (data.image?.[0]) formData.append('image', data.image[0])
    formData.append('text', data.text)

    const res = await api.post('/v1/web-about-us', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

// ** Update about
export const updateAboutUs = createAsyncThunk('appAbout/updateAboutUs', async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    if (data.image?.[0]) formData.append('image', data.image[0])
    formData.append('text', data.text)

    const res = await api.put(`/v1/web-about-us/${data.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

// ** Slice
export const appAboutSlice = createSlice({
  name: 'appAbout',
  initialState: {
    aboutUs: {
      data: null,
      about: null,
      loading: false,
      creating: false,
      updating: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchAboutUs.pending, state => {
      state.aboutUs.loading = true
    })
    builder.addCase(fetchAboutUs.fulfilled, (state, action) => {
      state.aboutUs.data = action.payload.data
      state.aboutUs.loading = false
    })
    builder.addCase(fetchAboutUs.rejected, state => {
      state.aboutUs.loading = false
    })

    builder.addCase(createAboutUs.pending, state => {
      state.aboutUs.creating = true
    })
    builder.addCase(createAboutUs.fulfilled, (state, action) => {
      state.aboutUs.data = action.payload.data
      state.aboutUs.creating = false
    })
    builder.addCase(createAboutUs.rejected, state => {
      state.aboutUs.creating = false
    })

    builder.addCase(updateAboutUs.pending, state => {
      state.aboutUs.updating = true
    })
    builder.addCase(updateAboutUs.fulfilled, (state, action) => {
      state.aboutUs.data = action.payload.data
      state.aboutUs.updating = false
    })
    builder.addCase(updateAboutUs.rejected, state => {
      state.aboutUs.updating = false
    })
  }
})

export default appAboutSlice.reducer
