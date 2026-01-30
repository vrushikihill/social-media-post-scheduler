// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'

// ** API

// ** Fetch Pricing Plans
export const fetchPricingPlans = createAsyncThunk('fetchPricingPlans', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/pricing-plans', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Fetch Pricing Plans by id
export const fetchPricingPlansById = createAsyncThunk('fetchPricingPlansById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/v1/pricing-plans/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create Pricing Plans
export const createPricingPlans = createAsyncThunk('createPricingPlans', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/pricing-plans', data)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update Pricing Plans
export const updatePricingPlans = createAsyncThunk('updatePricingPlans', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/pricing-plans/${data.id}`, data)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update Pricing Plans Status
export const updatePricingPlansStatus = createAsyncThunk(
  'updatePricingPlansStatus',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(`/v1/pricing-plans/status/${data.id}`, {
        status: data.status
      })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Delete Pricing Plans

export const deletePricingPlans = createAsyncThunk('deletePricingPlans', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/pricing-plans/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appPricingPlansSlice = createSlice({
  name: 'appPricingPlans',
  initialState: {
    pricingPlans: {
      data: [],
      pricingPlan: null,
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      creating: false,
      updating: false,
      deleting: false
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchPricingPlans.pending, state => {
      state.pricingPlans.loading = true
    })
    builder.addCase(fetchPricingPlans.fulfilled, (state, action) => {
      state.pricingPlans = action.payload
      state.pricingPlans.loading = false
      state.pricingPlans.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchPricingPlans.rejected, state => {
      state.pricingPlans.loading = false
    })

    builder.addCase(fetchPricingPlansById.pending, state => {
      state.pricingPlans.singleLoading = true
    })
    builder.addCase(fetchPricingPlansById.fulfilled, (state, action) => {
      state.pricingPlans.pricingPlan = action.payload.data
      state.pricingPlans.singleLoading = false
    })
    builder.addCase(fetchPricingPlansById.rejected, (state, action) => {
      state.pricingPlans.singleLoading = false
      state.pricingPlans.error = action.payload
    })

    builder.addCase(createPricingPlans.pending, state => {
      state.pricingPlans.creating = true
    })
    builder.addCase(createPricingPlans.fulfilled, (state, action) => {
      state.pricingPlans.data = [action.payload.data, ...state.pricingPlans.data]
      state.pricingPlans.creating = false
    })
    builder.addCase(createPricingPlans.rejected, state => {
      state.pricingPlans.creating = false
    })

    builder.addCase(updatePricingPlans.pending, state => {
      state.pricingPlans.updating = true
    })
    builder.addCase(updatePricingPlans.fulfilled, (state, action) => {
      state.pricingPlans.data = state.pricingPlans.data.map(pricingPlan => {
        if (pricingPlan.id === action.payload.data.id) {
          return action.payload.data
        }

        return pricingPlan
      })
      state.pricingPlans.updating = false
    })
    builder.addCase(updatePricingPlans.rejected, state => {
      state.pricingPlans.updating = false
    })

    builder.addCase(updatePricingPlansStatus.pending, state => {
      state.pricingPlans.updating = true
    })
    builder.addCase(updatePricingPlansStatus.fulfilled, (state, action) => {
      state.pricingPlans.data = state.pricingPlans.data.map(pricingPlan => {
        if (pricingPlan.id === action.payload.data.id) {
          return action.payload.data
        }

        return pricingPlan
      })
      state.pricingPlans.updating = false
    })
    builder.addCase(updatePricingPlansStatus.rejected, state => {
      state.pricingPlans.updating = false
    })

    builder.addCase(deletePricingPlans.pending, state => {
      state.pricingPlans.deleting = true
    })
    builder.addCase(deletePricingPlans.fulfilled, (state, action) => {
      state.pricingPlans.data = state.pricingPlans.data.filter(pricingPlan => pricingPlan.id !== action.payload.data.id)
      state.pricingPlans.deleting = false
      state.pricingPlans.total = state.pricingPlans.total - 1
    })
    builder.addCase(deletePricingPlans.rejected, state => {
      state.pricingPlans.deleting = false
    })
  }
})

export default appPricingPlansSlice.reducer
