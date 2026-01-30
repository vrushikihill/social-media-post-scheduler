// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch bannerDetail
export const fetchBannerDetail = createAsyncThunk(
  'appWebBanner/fetchBannerDetail',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/v1/banner', { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Create bannerDetail
export const createBanner = createAsyncThunk('appWebBanner/createBanner', async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData()

    if (data.background?.[0]) formData.append('background', data.background[0])
    if (data.previewFrontImageUrl?.[0]) formData.append('previewFrontImageUrl', data.previewFrontImageUrl[0])
    if (data.previewBackImageUrl?.[0]) formData.append('previewBackImageUrl', data.previewBackImageUrl[0])

    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('buttonText', data.buttonText)
    formData.append('buttonLink', data.buttonLink)

    const res = await api.post('/v1/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

// ** Update bannerDetail
export const updateBanner = createAsyncThunk('appWebBanner/updateBanner', async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData()

    if (data.background?.[0]) formData.append('background', data.background[0])
    if (data.previewFrontImageUrl?.[0]) formData.append('previewFrontImageUrl', data.previewFrontImageUrl[0])
    if (data.previewBackImageUrl?.[0]) formData.append('previewBackImageUrl', data.previewBackImageUrl[0])

    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('buttonText', data.buttonText)
    formData.append('buttonLink', data.buttonLink)

    const res = await api.put(`/v1/banner/${data.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appWebBannerSlice = createSlice({
  name: 'appWebBanner',
  initialState: {
    bannerDetails: {
      data: null,
      bannerDetail: null,
      loading: false,
      creating: false,
      updating: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchBannerDetail.pending, state => {
      state.bannerDetails.loading = true
    })
    builder.addCase(fetchBannerDetail.fulfilled, (state, action) => {
      state.bannerDetails.data = action.payload.data
      state.bannerDetails.loading = false
    })
    builder.addCase(fetchBannerDetail.rejected, state => {
      state.bannerDetails.loading = false
    })

    builder.addCase(createBanner.pending, state => {
      state.bannerDetails.creating = true
    })
    builder.addCase(createBanner.fulfilled, (state, action) => {
      state.bannerDetails.data = action.payload.data
      state.bannerDetails.creating = false
    })
    builder.addCase(createBanner.rejected, state => {
      state.bannerDetails.creating = false
    })

    builder.addCase(updateBanner.pending, state => {
      state.bannerDetails.updating = true
    })
    builder.addCase(updateBanner.fulfilled, (state, action) => {
      state.bannerDetails.data = action.payload.data
      state.bannerDetails.updating = false
    })
    builder.addCase(updateBanner.rejected, state => {
      state.bannerDetails.updating = false
    })
  }
})

export default appWebBannerSlice.reducer
