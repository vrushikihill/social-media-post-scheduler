// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch organizations
export const fetchOrganizations = createAsyncThunk(
  'appSetting/fetchOrganizations',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/v1/organizations', { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Fetch user organizations
export const fetchUserOrganization = createAsyncThunk(
  'appSetting/fetchUserOrganization',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get(`/v1/organizations/${params.id}`, { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Update organization
export const updateOrganization = createAsyncThunk(
  'appSetting/updateOrganization',
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      if (data.image) {
        formData.append('file', data.image)
      }
      if (data.name) {
        formData.append('name', data.name)
      }
      if (data.url) {
        formData.append('url', data.url)
      }

      const res = await api.put(`/v1/organizations/super-admin/${data.id}`, formData, {
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

// ** Delete organizations
export const deleteOrganization = createAsyncThunk('appSetting/deleteOrganization', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/organizations/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const organizationSlice = createSlice({
  name: 'appSetting',
  initialState: {
    organizations: {
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchOrganizations.pending, state => {
      state.organizations.loading = true
    })
    builder.addCase(fetchOrganizations.fulfilled, (state, action) => {
      state.organizations = action.payload
      state.organizations.loading = false
      state.organizations.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchOrganizations.rejected, state => {
      state.organizations.loading = false
    })

    builder.addCase(fetchUserOrganization.pending, state => {
      state.organizations.loading = true
    })
    builder.addCase(fetchUserOrganization.fulfilled, (state, action) => {
      state.organizations = action.payload
      state.organizations.loading = false
      state.organizations.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchUserOrganization.rejected, state => {
      state.organizations.loading = false
    })

    builder.addCase(updateOrganization.pending, state => {
      state.organizations.loading = true
    })
    builder.addCase(updateOrganization.fulfilled, (state, action) => {
      state.organizations.data = state.organizations.data.map(organization =>
        organization.id === action.payload.data.id ? action.payload.data : organization
      )
      state.organizations.loading = false
    })
    builder.addCase(updateOrganization.rejected, state => {
      state.organizations.loading = false
    })

    builder.addCase(deleteOrganization.pending, state => {
      state.organizations.loading = true
    })
    builder.addCase(deleteOrganization.fulfilled, (state, action) => {
      state.organizations.data = state.organizations.data.filter(organization => organization.id !== action.payload.id)
      state.organizations.loading = false
    })
    builder.addCase(deleteOrganization.rejected, state => {
      state.organizations.loading = false
    })
  }
})

export default organizationSlice.reducer
