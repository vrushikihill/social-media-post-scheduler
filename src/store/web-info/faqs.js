// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch faqs
export const fetchFaqs = createAsyncThunk('appQuestions/fetchFaqs', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/faq', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create faqs
export const createFaqs = createAsyncThunk('appQuestions/createFaqs', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/faq', {
      question: data.question,
      answer: data.answer
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update faqs
export const updateFaqs = createAsyncThunk('appQuestions/updateFaqs', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/faq/${data.id}`, {
      id: data.id,
      question: data.question,
      answer: data.answer
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete faqs
export const deleteFaqs = createAsyncThunk('appQuestions/deleteFaqs', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/faq/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appFaqsSlice = createSlice({
  name: 'appFaqs',
  initialState: {
    faqs: {
      data: [],
      faq: null,
      loading: false,
      creating: false,
      updating: false,
      deleting: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchFaqs.pending, state => {
      state.faqs.loading = true
    })
    builder.addCase(fetchFaqs.fulfilled, (state, action) => {
      state.faqs = action.payload
      state.faqs.loading = false
    })
    builder.addCase(fetchFaqs.rejected, state => {
      state.faqs.loading = false
    })

    builder.addCase(createFaqs.pending, state => {
      state.faqs.creating = true
    })
    builder.addCase(createFaqs.fulfilled, (state, action) => {
      state.faqs.data = [action.payload.data, ...state.faqs.data]
      state.faqs.creating = false
    })
    builder.addCase(createFaqs.rejected, state => {
      state.faqs.creating = false
    })

    builder.addCase(updateFaqs.pending, state => {
      state.faqs.updating = true
    })
    builder.addCase(updateFaqs.fulfilled, (state, action) => {
      state.faqs.data = state.faqs.data.map(faq => {
        if (faq.id === action.payload.data.id) {
          return action.payload.data
        }

        return faq
      })
      state.faqs.updating = false
    })
    builder.addCase(updateFaqs.rejected, state => {
      state.faqs.updating = false
    })

    builder.addCase(deleteFaqs.pending, state => {
      state.faqs.deleting = true
    })
    builder.addCase(deleteFaqs.fulfilled, (state, action) => {
      state.faqs.data = state.faqs.data.filter(faq => faq.id !== action.payload.data.id)
      state.faqs.deleting = false
    })
    builder.addCase(deleteFaqs.rejected, state => {
      state.faqs.deleting = false
    })
  }
})

export default appFaqsSlice.reducer
