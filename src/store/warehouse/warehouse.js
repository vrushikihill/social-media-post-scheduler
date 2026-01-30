// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch organizations warehouse
export const fetchOrganizationsWarehouse = createAsyncThunk(
  'appSetting/fetchOrganizationsWarehouse',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get(`/v1/warehouse/super-admin/${params.id}`, { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Fetch warehouse
export const fetchWarehouse = createAsyncThunk('appSetting/fetchWarehouse', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/warehouse/super-admin', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create warehouse
export const createWarehouse = createAsyncThunk('appSetting/createWarehouse', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/warehouse/super-admin', {
      warehouseName: data.warehouseName,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      branch: data.branch,
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

// ** Update Warehouse
export const updateWarehouse = createAsyncThunk('appSetting/updateWarehouse', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/warehouse/super-admin/${data.id}`, {
      warehouseName: data.warehouseName,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      branch: data.branch,
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

// ** Relation On Warehouse

export const relationsWarehouse = createAsyncThunk('appSetting/relation', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/v1/warehouse/super-admin/${id}/relation`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete Warehouse

export const deleteWarehouse = createAsyncThunk('appSetting/deleteWarehouse', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/warehouse/super-admin/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appWarehouseSlice = createSlice({
  name: 'appWarehouse',
  initialState: {
    warehouses: {
      data: [],
      relation: null,
      warehouse: null,
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
    builder.addCase(fetchOrganizationsWarehouse.pending, state => {
      state.warehouses.loading = true
    })
    builder.addCase(fetchOrganizationsWarehouse.fulfilled, (state, action) => {
      state.warehouses = action.payload
      state.warehouses.loading = false
      state.warehouses.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchOrganizationsWarehouse.rejected, state => {
      state.warehouses.loading = false
    })

    builder.addCase(fetchWarehouse.pending, state => {
      state.warehouses.loading = true
    })
    builder.addCase(fetchWarehouse.fulfilled, (state, action) => {
      state.warehouses = action.payload
      state.warehouses.loading = false
      state.warehouses.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchWarehouse.rejected, state => {
      state.warehouses.loading = false
    })

    builder.addCase(createWarehouse.pending, state => {
      state.warehouses.creating = true
    })
    builder.addCase(createWarehouse.fulfilled, (state, action) => {
      state.warehouses.data = [action.payload.data, ...state.warehouses.data]
      state.warehouses.creating = false
    })
    builder.addCase(createWarehouse.rejected, state => {
      state.warehouses.creating = false
    })

    builder.addCase(updateWarehouse.pending, state => {
      state.warehouses.updating = true
    })
    builder.addCase(updateWarehouse.fulfilled, (state, action) => {
      state.warehouses.data = state.warehouses.data.map(warehouse => {
        if (warehouse.id === action.payload.data.id) {
          return action.payload.data
        }

        return warehouse
      })

      state.warehouses.updating = false
    })
    builder.addCase(updateWarehouse.rejected, state => {
      state.warehouses.updating = false
    })

    builder.addCase(relationsWarehouse.pending, state => {
      state.warehouses.loading = true
    })
    builder.addCase(relationsWarehouse.fulfilled, (state, action) => {
      state.warehouses.loading = false
      state.warehouses.relation = action.payload.data
    })
    builder.addCase(relationsWarehouse.rejected, state => {
      state.warehouses.loading = false
    })

    builder.addCase(deleteWarehouse.pending, state => {
      state.warehouses.deleting = true
    })
    builder.addCase(deleteWarehouse.fulfilled, (state, action) => {
      state.warehouses.data = state.warehouses.data.filter(warehouse => warehouse.id !== action.payload.data.id)
      state.warehouses.deleting = false
      state.warehouses.total = state.warehouses.total - 1
    })
    builder.addCase(deleteWarehouse.rejected, state => {
      state.warehouses.deleting = false
    })
  }
})

export default appWarehouseSlice.reducer
