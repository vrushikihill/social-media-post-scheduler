// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'

// ** API

// ** Fetch departments
export const fetchAboutUs = createAsyncThunk('appAppManagement/fetchAboutUs', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/about-us', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create Contact
export const createAboutUs = createAsyncThunk('appAppManagement/createAboutUs', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/about-us', {
      text: data.text
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update AboutUs
export const updateAboutUs = createAsyncThunk('appSales/updateAboutUs', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/about-us/${data.id}`, {
      text: data.text
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appAboutUsSlice = createSlice({
  name: 'appAboutUs',
  initialState: {
    aboutUs: {
      data: null,
      loading: false,
      creating: false,
      updating: false,
      deleting: false
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
  }
})

export default appAboutUsSlice.reducer
