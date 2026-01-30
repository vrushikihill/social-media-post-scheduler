// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'

// ** API

// ** Fetch departments
export const fetchDeal = createAsyncThunk('appSetting/fetchDeal', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/deal', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create Deal
export const createDeal = createAsyncThunk('appAppManagement/createDeal', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/deal', {
      product: data.product,
      discount: data.discount,
      status: data.status
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete Bulk Deal

export const deleteBulkDeals = createAsyncThunk('appManagement/deleteBulkDeals', async (ids, { rejectWithValue }) => {
  try {
    const res = await api.put('/v1/deal/delete-multiple', ids)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Repeat Deal
export const repeatDeal = createAsyncThunk('appManagement/repeatDeal', async (id, { rejectWithValue }) => {
  try {
    const res = await api.post(`/v1/deal/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appDealSlice = createSlice({
  name: 'appDeal',
  initialState: {
    deals: {
      data: [],
      deal: null,
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      creating: false,
      updating: false,
      repeating: false,
      deleting: false
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchDeal.pending, state => {
      state.deals.loading = true
    })
    builder.addCase(fetchDeal.fulfilled, (state, action) => {
      state.deals = action.payload
      state.deals.loading = false
      state.deals.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchDeal.rejected, state => {
      state.deals.loading = false
    })

    builder.addCase(createDeal.pending, state => {
      state.deals.creating = true
    })
    builder.addCase(createDeal.fulfilled, (state, action) => {
      state.deals.data.push(action.payload.data)
      state.deals.creating = false
    })
    builder.addCase(createDeal.rejected, state => {
      state.deals.creating = false
    })

    builder.addCase(repeatDeal.pending, state => {
      state.deals.repeating = true
    })
    builder.addCase(repeatDeal.fulfilled, (state, action) => {
      if (action.payload.data) {
        state.deals.data.push(action.payload.data)
      }
      state.deals.repeating = false
    })
    builder.addCase(repeatDeal.rejected, state => {
      state.deals.repeating = false
    })

    builder.addCase(deleteBulkDeals.pending, state => {
      state.deals.deleting = true
    })
    builder.addCase(deleteBulkDeals.fulfilled, (state, action) => {
      const deletedIds = action.payload.data.deletedDeal.map(deal => deal.id)
      state.deals.data = state.deals.data.filter(deal => !deletedIds.includes(deal.id))
      state.deals.deleting = false
      state.deals.total -= action.payload.data.deletedDeal.length
    })
    builder.addCase(deleteBulkDeals.rejected, state => {
      state.deals.deleting = false
    })
  }
})

export default appDealSlice.reducer
