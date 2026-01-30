// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch sub-category
export const fetchSubCategory = createAsyncThunk('appSetting/fetchSubCategory', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/sub-category/super-admin', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create sub-category
export const createSubCategory = createAsyncThunk('appSetting/createSubCategory', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/sub-category/super-admin', data)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** update sub-category
export const updateSubCategory = createAsyncThunk('appSetting/updateSubCategory', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/sub-category/super-admin/${data.id}`, data)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** isDisabled Sub Category

export const isDisabledSubCategory = createAsyncThunk(
  'appSetting/isDisabledSubCategory',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(`/v1/sub-category/disabled/${data.id}`, {
        disabled: data.isDisabled
      })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Relations sub-category
export const relationsSubCategory = createAsyncThunk(
  'appSetting/relationsSubCategory',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/v1/sub-category/${id}/relations`)

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** delete sub-category
export const deleteSubCategory = createAsyncThunk('appSetting/deleteSubCategory', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/sub-category/super-admin/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appCategorySlice = createSlice({
  name: 'appSubCategory',
  initialState: {
    subCategories: {
      data: [],
      loading: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchSubCategory.pending, state => {
      state.subCategories.loading = true
    })
    builder.addCase(fetchSubCategory.fulfilled, (state, action) => {
      state.subCategories = action.payload
      state.subCategories.loading = false
    })
    builder.addCase(fetchSubCategory.rejected, state => {
      state.subCategories.loading = false
    })

    builder.addCase(createSubCategory.pending, state => {
      state.subCategories.loading = true
    })
    builder.addCase(createSubCategory.fulfilled, (state, action) => {
      state.subCategories.data.push(action.payload.data)
      state.subCategories.loading = false
    })
    builder.addCase(createSubCategory.rejected, state => {
      state.subCategories.loading = false
    })

    builder.addCase(updateSubCategory.pending, state => {
      state.subCategories.loading = true
    })
    builder.addCase(updateSubCategory.fulfilled, (state, action) => {
      const index = state.subCategories.data.findIndex(item => item.id === action.payload.data.id)
      if (index !== -1) {
        state.subCategories.data[index] = action.payload.data
      }
      state.subCategories.loading = false
    })
    builder.addCase(updateSubCategory.rejected, state => {
      state.subCategories.loading = false
    })

    builder.addCase(isDisabledSubCategory.pending, state => {
      state.subCategories.updating = true
    })
    builder.addCase(isDisabledSubCategory.fulfilled, (state, action) => {
      state.subCategories.data = state.subCategories.data.map(subCategory => {
        if (subCategory.id === action.payload.data.id) {
          return action.payload.data
        }

        return subCategory
      })

      state.subCategories.updating = false
    })
    builder.addCase(isDisabledSubCategory.rejected, state => {
      state.subCategories.updating = false
    })

    builder.addCase(relationsSubCategory.pending, state => {
      state.subCategories.loading = true
    })
    builder.addCase(relationsSubCategory.fulfilled, (state, action) => {
      state.subCategories.relations = action.payload.data
      state.subCategories.loading = false
    })
    builder.addCase(relationsSubCategory.rejected, state => {
      state.subCategories.loading = false
    })

    builder.addCase(deleteSubCategory.pending, state => {
      state.subCategories.loading = true
    })
    builder.addCase(deleteSubCategory.fulfilled, (state, action) => {
      state.subCategories.data = state.subCategories.data.filter(item => item.id !== action.payload.data.id)
      state.subCategories.loading = false
    })
    builder.addCase(deleteSubCategory.rejected, state => {
      state.subCategories.loading = false
    })
  }
})

export default appCategorySlice.reducer
