// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'

// ** API

// ** Fetch Order
export const fetchPurchaseOrder = createAsyncThunk(
  'appSetting/fetchPurchaseOrder',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/v1/purchase-order/super-admin/all', { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Slice
export const appPurchaseOrderSlice = createSlice({
  name: 'appOrder',
  initialState: {
    purchaseOrders: {
      data: [],
      purchaseOrder: null,
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      creating: false,
      updating: false,
      deleting: false,
      singleLoading: false
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchPurchaseOrder.pending, state => {
      state.purchaseOrders.loading = true
    })
    builder.addCase(fetchPurchaseOrder.fulfilled, (state, action) => {
      state.purchaseOrders = action.payload
      state.purchaseOrders.loading = false
      state.purchaseOrders.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchPurchaseOrder.rejected, state => {
      state.purchaseOrders.loading = false
    })
  }
})

export default appPurchaseOrderSlice.reducer
