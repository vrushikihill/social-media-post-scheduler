// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch Social Media
export const fetchMedia = createAsyncThunk('appMedia/fetchMedia', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/social-media', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create Social Media
export const createMedia = createAsyncThunk('appMedia/createMedia', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/social-media', {
      facebook: data.facebook,
      instagram: data.instagram,
      whatsapp: data.whatsapp,
      playStore: data.playStore,
      appStore: data.appStore
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update Social Media
export const updateMedia = createAsyncThunk('appMedia/updateMedia', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/social-media/${data.id}`, {
      id: data.id,
      facebook: data.facebook,
      instagram: data.instagram,
      whatsapp: data.whatsapp,
      playStore: data.playStore,
      appStore: data.appStore
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appMediaSlice = createSlice({
  name: 'appMedia',
  initialState: {
    socialMedia: {
      data: null,
      media: null,
      loading: false,
      creating: false,
      updating: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchMedia.pending, state => {
      state.socialMedia.loading = true
    })
    builder.addCase(fetchMedia.fulfilled, (state, action) => {
      state.socialMedia.data = action.payload.data
      state.socialMedia.loading = false
    })

    builder.addCase(fetchMedia.rejected, state => {
      state.socialMedia.loading = false
    })

    builder.addCase(createMedia.pending, state => {
      state.socialMedia.creating = true
    })
    builder.addCase(createMedia.fulfilled, (state, action) => {
      state.socialMedia.data = action.payload.data
      state.socialMedia.creating = false
    })
    builder.addCase(createMedia.rejected, state => {
      state.socialMedia.creating = false
    })

    builder.addCase(updateMedia.pending, state => {
      state.socialMedia.updating = true
    })
    builder.addCase(updateMedia.fulfilled, (state, action) => {
      const updated = action.payload.data
      const currentData = Array.isArray(state.socialMedia.data) ? state.socialMedia.data : []

      state.socialMedia.data = currentData.map(media => {
        return media.id === updated.id ? updated : media
      })
      state.socialMedia.updating = false
    })

    builder.addCase(updateMedia.rejected, state => {
      state.socialMedia.updating = false
    })
  }
})

export default appMediaSlice.reducer
