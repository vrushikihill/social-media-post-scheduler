// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'

// ** API

// ** Fetch Pricing Plans
export const fetchTrialPricingPlans = createAsyncThunk(
  'fetchTrialPricingPlans',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/v1/trial-plans', { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Fetch Pricing Plans by id
export const fetchTrialPricingPlansById = createAsyncThunk(
  'fetchTrialPricingPlansById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/v1/trial-plans/${id}`)

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Create Pricing Plans
export const createTrialPricingPlans = createAsyncThunk(
  'createTrialPricingPlans',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/v1/trial-plans', data)

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Update Pricing Plans
export const updateTrialPricingPlans = createAsyncThunk(
  'updateTrialPricingPlans',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(`/v1/trial-plans/${data.id}`, data)

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Update Pricing Plans Status
export const updateTrialPricingPlansStatus = createAsyncThunk(
  'updateTrialPricingPlansStatus',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(`/v1/trial-plans/status/${data.id}`, {
        status: data.status
      })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Delete Pricing Plans

export const deleteTrialPricingPlans = createAsyncThunk('deletePricingPlans', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/trial-plans/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appTrialPricingPlansSlice = createSlice({
  name: 'appTrialPricingPlans',
  initialState: {
    trialPricingPlans: {
      data: [],
      trialPricingPlan: null,
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
    builder.addCase(fetchTrialPricingPlans.pending, state => {
      state.trialPricingPlans.loading = true
    })
    builder.addCase(fetchTrialPricingPlans.fulfilled, (state, action) => {
      state.trialPricingPlans = action.payload
      state.trialPricingPlans.loading = false
      state.trialPricingPlans.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchTrialPricingPlans.rejected, state => {
      state.trialPricingPlans.loading = false
    })

    builder.addCase(fetchTrialPricingPlansById.pending, state => {
      state.trialPricingPlans.singleLoading = true
    })
    builder.addCase(fetchTrialPricingPlansById.fulfilled, (state, action) => {
      state.trialPricingPlans.trialPricingPlan = action.payload.data
      state.trialPricingPlans.singleLoading = false
    })
    builder.addCase(fetchTrialPricingPlansById.rejected, (state, action) => {
      state.trialPricingPlans.singleLoading = false
      state.trialPricingPlans.error = action.payload
    })

    builder.addCase(createTrialPricingPlans.pending, state => {
      state.trialPricingPlans.creating = true
    })
    builder.addCase(createTrialPricingPlans.fulfilled, (state, action) => {
      state.trialPricingPlans.data = [action.payload.data, ...state.trialPricingPlans.data]
      state.trialPricingPlans.creating = false
    })
    builder.addCase(createTrialPricingPlans.rejected, state => {
      state.trialPricingPlans.creating = false
    })

    builder.addCase(updateTrialPricingPlans.pending, state => {
      state.trialPricingPlans.updating = true
    })
    builder.addCase(updateTrialPricingPlans.fulfilled, (state, action) => {
      state.trialPricingPlans.data = state.trialPricingPlans.data.map(trialPricingPlan => {
        if (trialPricingPlan.id === action.payload.data.id) {
          return action.payload.data
        }

        return trialPricingPlan
      })
      state.trialPricingPlans.updating = false
    })
    builder.addCase(updateTrialPricingPlans.rejected, state => {
      state.trialPricingPlans.updating = false
    })

    builder.addCase(updateTrialPricingPlansStatus.pending, state => {
      state.trialPricingPlans.updating = true
    })
    builder.addCase(updateTrialPricingPlansStatus.fulfilled, (state, action) => {
      state.trialPricingPlans.data = state.trialPricingPlans.data.map(trialPricingPlan => {
        if (trialPricingPlan.id === action.payload.data.id) {
          return action.payload.data
        }

        return trialPricingPlan
      })
      state.trialPricingPlans.updating = false
    })
    builder.addCase(updateTrialPricingPlansStatus.rejected, state => {
      state.trialPricingPlans.updating = false
    })

    builder.addCase(deleteTrialPricingPlans.pending, state => {
      state.trialPricingPlans.deleting = true
    })
    builder.addCase(deleteTrialPricingPlans.fulfilled, (state, action) => {
      state.trialPricingPlans.data = state.trialPricingPlans.data.filter(
        trialPricingPlan => trialPricingPlan.id !== action.payload.data.id
      )
      state.trialPricingPlans.deleting = false
      state.trialPricingPlans.total = state.trialPricingPlans.total - 1
    })
    builder.addCase(deleteTrialPricingPlans.rejected, state => {
      state.trialPricingPlans.deleting = false
    })
  }
})

export default appTrialPricingPlansSlice.reducer
