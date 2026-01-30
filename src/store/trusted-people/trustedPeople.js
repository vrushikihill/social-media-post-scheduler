// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

export const fetchTrustedPeople = createAsyncThunk('fetchTrustedPeople', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/trusted-people', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update Trusted People
export const updateTrustedPeople = createAsyncThunk('updateTrustedPeople', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/trusted-people/${data.id}`, data)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// upload Image
export const createTrustedPeople = createAsyncThunk(
  'uploadTrustedPeopleImage',
  async ({ files }, { rejectWithValue }) => {
    try {
      const formData = new FormData()

      files.forEach((fileObj, index) => {
        formData.append(`files`, fileObj.image)
        formData.append(`files[${index}].name`, fileObj.name || fileObj.image.name)
        formData.append(`files[${index}].alternativeText`, fileObj.alternativeText || '')
        formData.append(`files[${index}].caption`, fileObj.caption || '')
      })

      const res = await api.post('/v1/trusted-people/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Delete Trusted People

export const deleteTrustedPeople = createAsyncThunk('deleteTrustedPeople', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/trusted-people/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete Bulk Media Asset

export const deleteManyTrustedPeople = createAsyncThunk('deleteBulkTrustedPeople', async (ids, { rejectWithValue }) => {
  try {
    const res = await api.put('/v1/trusted-people/delete-multiple', { ids })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appTrustedPeopleSlice = createSlice({
  name: 'appTrustedPeople',
  initialState: {
    trustedPeoples: {
      data: [],
      total: 0,
      page: 1,
      pageSize: 30,
      loading: false,
      creating: false,
      updating: false,
      deleting: false
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchTrustedPeople.pending, state => {
      state.trustedPeoples.loading = true
    })
    builder.addCase(fetchTrustedPeople.fulfilled, (state, action) => {
      state.trustedPeoples = action.payload
      state.trustedPeoples.loading = false
      state.trustedPeoples.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchTrustedPeople.rejected, state => {
      state.trustedPeoples.loading = false
    })
    builder.addCase(createTrustedPeople.pending, state => {
      state.trustedPeoples.creating = true
    })
    builder.addCase(createTrustedPeople.fulfilled, (state, action) => {
      state.trustedPeoples.data.push(action.payload.data)
      state.trustedPeoples.creating = false
    })
    builder.addCase(createTrustedPeople.rejected, state => {
      state.trustedPeoples.creating = false
    })

    builder.addCase(updateTrustedPeople.pending, state => {
      state.trustedPeoples.updating = true
    })
    builder.addCase(updateTrustedPeople.fulfilled, (state, action) => {
      state.trustedPeoples.data = state.trustedPeoples.data.map(mediaAsset => {
        if (mediaAsset.id === action.payload.data.id) {
          return action.payload.data
        }

        return mediaAsset
      })
      state.trustedPeoples.updating = false
    })
    builder.addCase(updateTrustedPeople.rejected, state => {
      state.trustedPeoples.updating = false
    })

    builder.addCase(deleteTrustedPeople.pending, state => {
      state.trustedPeoples.deleting = true
    })
    builder.addCase(deleteTrustedPeople.fulfilled, (state, action) => {
      state.trustedPeoples.data = state.trustedPeoples.data.filter(
        mediaAsset => mediaAsset.id !== action.payload.data.id
      )
      state.trustedPeoples.deleting = false
      state.trustedPeoples.total = state.trustedPeoples.total - 1
    })
    builder.addCase(deleteTrustedPeople.rejected, state => {
      state.trustedPeoples.deleting = false
    })

    builder.addCase(deleteManyTrustedPeople.pending, state => {
      state.trustedPeoples.deleting = true
    })
    builder.addCase(deleteManyTrustedPeople.fulfilled, (state, action) => {
      const deletedIds = action.payload.data.deletedTrustedPeople.map(item => item.id)
      state.trustedPeoples.data = state.trustedPeoples.data.filter(item => !deletedIds.includes(item.id))
      state.trustedPeoples.deleting = false
      state.trustedPeoples.total -= action.payload.data.deletedTrustedPeople.length
    })
    builder.addCase(deleteManyTrustedPeople.rejected, state => {
      state.trustedPeoples.deleting = false
    })
  }
})

export default appTrustedPeopleSlice.reducer
