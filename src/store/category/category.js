// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

export const fetchOrganizationsCategory = createAsyncThunk(
  'appSetting/fetchOrganizationsCategory',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get(`/v1/category/super-admin/${params.id}`, { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Fetch category
export const fetchCategory = createAsyncThunk('appSetting/fetchCategory', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/category/super-admin', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create Category
export const createCategory = createAsyncThunk('appSetting/createCategory', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/category/super-admin', {
      name: data.name,
      subCategory: data.subCategory,
      mediaId: data.mediaId
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update Category
export const updateCategory = createAsyncThunk('appSetting/updateCategory', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/category/super-admin/${data.id}`, {
      name: data.name,
      subCategory: data.subCategory,
      mediaId: data.mediaId
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** isDisabled Category
export const isDisabledCategory = createAsyncThunk(
  'appSetting/isDisabledCategory',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(`/v1/category/disabled/${data.id}`, {
        isDisabled: data.isDisabled
      })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Relation On Category

// export const relationsCategory = createAsyncThunk('appSetting/relation', async (id, { rejectWithValue }) => {
//   try {
//     const res = await api.get(`/v1/category/${id}/relation`)

//     return res.data
//   } catch (err) {
//     return rejectWithValue(err)
//   }
// })

// ** Delete Category

export const deleteCategory = createAsyncThunk('appSetting/deleteCategory', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/category/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appCategorySlice = createSlice({
  name: 'appCategory',
  initialState: {
    categories: {
      data: [],
      relation: null,
      category: null,
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      creating: false,
      updating: false,
      deleting: false,
      editData: null,
      drawerOpen: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchOrganizationsCategory.pending, state => {
      state.categories.loading = true
    })
    builder.addCase(fetchOrganizationsCategory.fulfilled, (state, action) => {
      state.categories = action.payload
      state.categories.loading = false
      state.categories.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchOrganizationsCategory.rejected, state => {
      state.categories.loading = false
    })

    builder.addCase(fetchCategory.pending, state => {
      state.categories.loading = true
    })
    builder.addCase(fetchCategory.fulfilled, (state, action) => {
      state.categories = action.payload
      state.categories.loading = false
      state.categories.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchCategory.rejected, state => {
      state.categories.loading = false
    })

    builder.addCase(createCategory.pending, state => {
      state.categories.creating = true
    })
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.categories.data = [action.payload.data, ...state.categories.data]
      state.categories.creating = false
    })
    builder.addCase(createCategory.rejected, state => {
      state.categories.creating = false
    })

    builder.addCase(updateCategory.pending, state => {
      state.categories.updating = true
    })
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.categories.data = state.categories.data.map(category => {
        if (category.id === action.payload.data.id) {
          return action.payload.data
        }

        return category
      })

      state.categories.updating = false
    })
    builder.addCase(updateCategory.rejected, state => {
      state.categories.updating = false
    })

    builder.addCase(isDisabledCategory.pending, state => {
      state.categories.updating = true
    })
    builder.addCase(isDisabledCategory.fulfilled, (state, action) => {
      state.categories.data = state.categories.data.map(category => {
        if (category.id === action.payload.data.id) {
          return action.payload.data
        }

        return category
      })

      state.categories.updating = false
    })
    builder.addCase(isDisabledCategory.rejected, state => {
      state.categories.updating = false
    })

    // builder.addCase(relationsCategory.pending, state => {
    //   state.categories.loading = true
    // })
    // builder.addCase(relationsCategory.fulfilled, (state, action) => {
    //   state.categories.loading = false
    //   state.categories.relation = action.payload.data
    // })
    // builder.addCase(relationsCategory.rejected, state => {
    //   state.categories.loading = false
    // })

    builder.addCase(deleteCategory.pending, state => {
      state.categories.deleting = true
    })
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.categories.data = state.categories.data.filter(category => category.id !== action.payload.data.id)
      state.categories.deleting = false
      state.categories.total = state.categories.total - 1
    })
    builder.addCase(deleteCategory.rejected, state => {
      state.categories.deleting = false
    })
  }
})

export default appCategorySlice.reducer
