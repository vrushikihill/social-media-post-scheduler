// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch organizations Branch
export const fetchOrganizationsBranch = createAsyncThunk(
  'appSetting/fetchOrganizationsBranch',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get(`/v1/branch/super-admin/${params.id}`, { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Fetch Branch
export const fetchBranch = createAsyncThunk('appSetting/fetchBranch', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/branch/super-admin', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create Branch
export const createBranch = createAsyncThunk('appSetting/createBranch', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/branch/super-admin', {
      branchName: data.branchName,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      pinCode: data.pinCode
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update Category
export const updateBranch = createAsyncThunk('appSetting/updateBranch', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/branch/super-admin/${data.id}`, {
      branchName: data.branchName,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      pinCode: data.pinCode,
      enabled: data.enabled,
      isDisabled: data.isDisabled
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Relation On Branch

export const relationsBranch = createAsyncThunk('appSetting/relation', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/v1/branch/super-admin/${id}/relation`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete Branch

export const deleteBranch = createAsyncThunk('appSetting/deleteBranch', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/branch/super-admin/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appBranchSlice = createSlice({
  name: 'appBranch',
  initialState: {
    branches: {
      data: [],
      relation: null,
      branch: null,
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
    builder.addCase(fetchOrganizationsBranch.pending, state => {
      state.branches.loading = true
    })
    builder.addCase(fetchOrganizationsBranch.fulfilled, (state, action) => {
      state.branches = action.payload
      state.branches.loading = false
      state.branches.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchOrganizationsBranch.rejected, state => {
      state.branches.loading = false
    })

    builder.addCase(fetchBranch.pending, state => {
      state.branches.loading = true
    })
    builder.addCase(fetchBranch.fulfilled, (state, action) => {
      state.branches = action.payload
      state.branches.loading = false
      state.branches.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchBranch.rejected, state => {
      state.branches.loading = false
    })

    builder.addCase(createBranch.pending, state => {
      state.branches.creating = true
    })
    builder.addCase(createBranch.fulfilled, (state, action) => {
      state.branches.data = [action.payload.data, ...state.branches.data]
      state.branches.creating = false
    })
    builder.addCase(createBranch.rejected, state => {
      state.branches.creating = false
    })

    builder.addCase(updateBranch.pending, state => {
      state.branches.updating = true
    })
    builder.addCase(updateBranch.fulfilled, (state, action) => {
      state.branches.data = state.branches.data.map(branch => {
        if (branch.id === action.payload.data.id) {
          return action.payload.data
        }

        return branch
      })

      state.branches.updating = false
    })
    builder.addCase(updateBranch.rejected, state => {
      state.branches.updating = false
    })

    builder.addCase(relationsBranch.pending, state => {
      state.branches.loading = true
    })
    builder.addCase(relationsBranch.fulfilled, (state, action) => {
      state.branches.loading = false
      state.branches.relation = action.payload.data
    })
    builder.addCase(relationsBranch.rejected, state => {
      state.branches.loading = false
    })

    builder.addCase(deleteBranch.pending, state => {
      state.branches.deleting = true
    })
    builder.addCase(deleteBranch.fulfilled, (state, action) => {
      state.branches.data = state.branches.data.filter(branch => branch.id !== action.payload.data.id)
      state.branches.deleting = false
      state.branches.total = state.branches.total - 1
    })
    builder.addCase(deleteBranch.rejected, state => {
      state.branches.deleting = false
    })
  }
})

export default appBranchSlice.reducer
