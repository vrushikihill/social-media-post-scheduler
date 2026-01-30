// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'

// ** API

// ** Fetch Order
export const fetchOrganizationsOrder = createAsyncThunk(
  'appOrder/fetchOrganizationsOrder',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get(`/v1/orders/super-admin/${params.id}`, { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Fetch Total Order
export const fetchOrder = createAsyncThunk('appOrder/fetchOrder', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/orders/super-admin/all', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete Bulk Orders

export const deleteBulkOrders = createAsyncThunk('appInventory/deleteBulkOrders', async (ids, { rejectWithValue }) => {
  try {
    const res = await api.put('/v1/orders/delete-multiple', ids)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appOrdersSlice = createSlice({
  name: 'appOrder',
  initialState: {
    orders: {
      data: [],
      order: null,
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      singleLoading: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchOrder.pending, state => {
      state.orders.loading = true
    })
    builder.addCase(fetchOrder.fulfilled, (state, action) => {
      state.orders = action.payload
      state.orders.loading = false
      state.orders.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchOrder.rejected, state => {
      state.orders.loading = false
    })

    builder.addCase(fetchOrganizationsOrder.pending, state => {
      state.orders.loading = true
    })
    builder.addCase(fetchOrganizationsOrder.fulfilled, (state, action) => {
      state.orders = action.payload
      state.orders.loading = false
      state.orders.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchOrganizationsOrder.rejected, state => {
      state.orders.loading = false
    })

    builder.addCase(deleteBulkOrders.pending, state => {
      state.orders.deleting = true
    })
    builder.addCase(deleteBulkOrders.fulfilled, (state, action) => {
      const deletedIds = action.payload.data.deletedOrders.map(item => item.id)
      state.orders.data = state.orders.data.filter(item => !deletedIds.includes(item.id))
      state.orders.deleting = false
      state.orders.total -= action.payload.data.deletedOrders.length
    })
    builder.addCase(deleteBulkOrders.rejected, state => {
      state.orders.deleting = false
    })
  }
})

export default appOrdersSlice.reducer
