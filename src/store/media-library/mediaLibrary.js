// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

export const fetchMediaAssets = createAsyncThunk('fetchMediaAssets', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/media-assets/super-admin', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Fetch Media Folder
export const fetchMediaFolder = createAsyncThunk('fetchMediaFolder', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/media-folder', {
      params
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

// Add Media Folder
export const addMediaFolder = createAsyncThunk('addMediaFolder', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/media-folder/super-admin', {
      name: data.name,
      parentId: data.parentId
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

// ** Update MediaAssets
export const updateMediaAssets = createAsyncThunk('updateMediaAssets', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/media-assets/${data.id}/super-admin`, data)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// upload Image
export const createMediaAssets = createAsyncThunk(
  'uploadImage',
  async ({ files, parentId = null }, { rejectWithValue }) => {
    try {
      const formData = new FormData()

      files.forEach((fileObj, index) => {
        formData.append(`files`, fileObj.image)
        formData.append(`files[${index}].name`, fileObj.name || fileObj.image.name)
        formData.append(`files[${index}].alternativeText`, fileObj.alternativeText || '')
        formData.append(`files[${index}].caption`, fileObj.caption || '')
        formData.append(`files[${index}].parentId`, parentId || '')
      })

      const res = await api.post('/v1/media-assets/super-admin/upload-multiple', formData, {
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

// ** Delete Media Asset

export const deleteMediaAssets = createAsyncThunk('deleteMediaAssets', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/media-assets/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete Bulk Media Asset

export const deleteManyMediaAssets = createAsyncThunk('deleteBulkMediaAssets', async (ids, { rejectWithValue }) => {
  try {
    const res = await api.put('/v1/media-assets/delete-multiple/super-admin', { ids })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete Bulk Media Folder

export const deleteManyMediaFolder = createAsyncThunk('deleteBulkMediaFolder', async (ids, { rejectWithValue }) => {
  try {
    const res = await api.put('/v1/media-folder/delete-multiple/super-admin', { ids })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appMediaAssetsSlice = createSlice({
  name: 'appMediaAssets',
  initialState: {
    mediaAssets: {
      data: [],
      total: 0,
      page: 1,
      pageSize: 30,
      loading: false,
      creating: false,
      updating: false,
      deleting: false
    },
    mediaFolder: {
      data: [],
      loading: false,
      creating: false,
      updating: false,
      deleting: false
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchMediaAssets.pending, state => {
      state.mediaAssets.loading = true
    })
    builder.addCase(fetchMediaAssets.fulfilled, (state, action) => {
      state.mediaAssets = action.payload
      state.mediaAssets.loading = false
      state.mediaAssets.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchMediaAssets.rejected, state => {
      state.mediaAssets.loading = false
    })
    builder.addCase(createMediaAssets.pending, state => {
      state.mediaAssets.creating = true
    })
    builder.addCase(createMediaAssets.fulfilled, (state, action) => {
      state.mediaAssets.data.push(action.payload.data)
      state.mediaAssets.creating = false
    })
    builder.addCase(createMediaAssets.rejected, state => {
      state.mediaAssets.creating = false
    })

    builder.addCase(updateMediaAssets.pending, state => {
      state.mediaAssets.updating = true
    })
    builder.addCase(updateMediaAssets.fulfilled, (state, action) => {
      state.mediaAssets.data = state.mediaAssets.data.map(mediaAsset => {
        if (mediaAsset.id === action.payload.data.id) {
          return action.payload.data
        }

        return mediaAsset
      })
      state.mediaAssets.updating = false
    })
    builder.addCase(updateMediaAssets.rejected, state => {
      state.mediaAssets.updating = false
    })

    builder.addCase(deleteMediaAssets.pending, state => {
      state.mediaAssets.deleting = true
    })
    builder.addCase(deleteMediaAssets.fulfilled, (state, action) => {
      state.mediaAssets.data = state.mediaAssets.data.filter(mediaAsset => mediaAsset.id !== action.payload.data.id)
      state.mediaAssets.deleting = false
      state.mediaAssets.total = state.mediaAssets.total - 1
    })
    builder.addCase(deleteMediaAssets.rejected, state => {
      state.mediaAssets.deleting = false
    })

    builder.addCase(deleteManyMediaAssets.pending, state => {
      state.mediaAssets.deleting = true
    })
    builder.addCase(deleteManyMediaAssets.fulfilled, (state, action) => {
      const deletedIds = action.payload.data.deletedMediaAssets.map(item => item.id)
      state.mediaAssets.data = state.mediaAssets.data.filter(item => !deletedIds.includes(item.id))
      state.mediaAssets.deleting = false
      state.mediaAssets.total -= action.payload.data.deletedMediaAssets.length
    })
    builder.addCase(deleteManyMediaAssets.rejected, state => {
      state.mediaAssets.deleting = false
    })
    builder.addCase(fetchMediaFolder.pending, state => {
      state.mediaFolder.loading = true
    })
    builder.addCase(fetchMediaFolder.fulfilled, (state, action) => {
      state.mediaFolder.data = action.payload.data.mediaFolders
      state.mediaFolder.loading = false
    })
    builder.addCase(fetchMediaFolder.rejected, state => {
      state.mediaFolder.loading = false
    })
    builder.addCase(deleteManyMediaFolder.pending, state => {
      state.mediaFolder.deleting = true
    })
    builder.addCase(deleteManyMediaFolder.fulfilled, state => {
      state.mediaFolder.deleting = false
    })
    builder.addCase(deleteManyMediaFolder.rejected, state => {
      state.mediaFolder.deleting = false
    })
  }
})

export default appMediaAssetsSlice.reducer
