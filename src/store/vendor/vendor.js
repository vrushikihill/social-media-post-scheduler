// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch vendor
export const fetchOrganizationVendor = createAsyncThunk(
  'appSetting/fetchOrganizationVendor',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get(`/v1/vendor/super-admin/${params.id}`, { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Fetch Invoice by vendor Id
export const fetchPurchaseOrderByVendorId = createAsyncThunk(
  'fetchPurchaseOrderByVendorId',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.get(`/v1/vendor/purchase-order/${data.id}`, {
        params: {
          startDate: data.startDate,
          endDate: data.endDate,
          search: data.search
        }
      })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Fetch Bills by vendor Id
export const fetchPurchaseBillByVendorId = createAsyncThunk(
  'fetchPurchaseBillByVendorId',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.get(`/v1/vendor/purchase-bill/${data.id}`, {
        params: {
          startDate: data.startDate,
          endDate: data.endDate,
          search: data.search
        }
      })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Slice
export const appVendorSlice = createSlice({
  name: 'appVendor',
  initialState: {
    vendors: {
      data: [],
      purchaseOrders: [],
      purchaseBills: [],
      vendor: null,
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      singleLoading: false,
      drawerOpen: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchOrganizationVendor.pending, state => {
      state.vendors.loading = true
    })
    builder.addCase(fetchOrganizationVendor.fulfilled, (state, action) => {
      state.vendors = action.payload
      state.vendors.loading = false
      state.vendors.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchOrganizationVendor.rejected, state => {
      state.vendors.loading = false
    })

    builder.addCase(fetchPurchaseOrderByVendorId.pending, state => {
      state.vendors.singleLoading = true
    })
    builder.addCase(fetchPurchaseOrderByVendorId.fulfilled, (state, action) => {
      state.vendors.purchaseOrders = action.payload.data
      state.vendors.singleLoading = false
    })
    builder.addCase(fetchPurchaseOrderByVendorId.rejected, (state, action) => {
      state.vendors.singleLoading = false
      state.vendors.error = action.payload
    })

    builder.addCase(fetchPurchaseBillByVendorId.pending, state => {
      state.vendors.singleLoading = true
    })
    builder.addCase(fetchPurchaseBillByVendorId.fulfilled, (state, action) => {
      state.vendors.purchaseBills = action.payload.data
      state.vendors.singleLoading = false
    })
    builder.addCase(fetchPurchaseBillByVendorId.rejected, (state, action) => {
      state.vendors.singleLoading = false
      state.vendors.error = action.payload
    })
  }
})

export default appVendorSlice.reducer
