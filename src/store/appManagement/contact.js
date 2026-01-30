// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'

// ** API

// ** Fetch departments
export const fetchContact = createAsyncThunk('appSetting/fetchContact', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/contact-us/super-admin', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create Contact
export const createContact = createAsyncThunk('appAppManagement/createContact', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/contact-us', {
      email: data.email,
      description: data.description
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete Bulk Contact

export const deleteBulkContacts = createAsyncThunk(
  'appManagement/deleteBulkContacts',
  async (ids, { rejectWithValue }) => {
    try {
      const res = await api.put('/v1/contact-us/delete-multiple', ids)

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Repeat Contact
export const repeatContact = createAsyncThunk('appManagement/repeatContact', async (id, { rejectWithValue }) => {
  try {
    const res = await api.post(`/v1/contact-us/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appContactUsSlice = createSlice({
  name: 'appContact',
  initialState: {
    contacts: {
      data: [],
      contact: null,
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      creating: false,
      repeating: false,
      updating: false,
      deleting: false
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchContact.pending, state => {
      state.contacts.loading = true
    })
    builder.addCase(fetchContact.fulfilled, (state, action) => {
      state.contacts = action.payload
      state.contacts.loading = false
      state.contacts.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchContact.rejected, state => {
      state.contacts.loading = false
    })

    builder.addCase(createContact.pending, state => {
      state.contacts.creating = true
    })
    builder.addCase(createContact.fulfilled, (state, action) => {
      state.contacts.data.push(action.payload.data)
      state.contacts.creating = false
    })
    builder.addCase(createContact.rejected, state => {
      state.contacts.creating = false
    })

    builder.addCase(repeatContact.pending, state => {
      state.contacts.repeating = true
    })
    builder.addCase(repeatContact.fulfilled, (state, action) => {
      if (action.payload.data) {
        state.contacts.data.push(action.payload.data)
      }
      state.contacts.repeating = false
    })
    builder.addCase(repeatContact.rejected, state => {
      state.contacts.repeating = false
    })

    builder.addCase(deleteBulkContacts.pending, state => {
      state.contacts.deleting = true
    })
    builder.addCase(deleteBulkContacts.fulfilled, (state, action) => {
      const deletedIds = action.payload.data.deletedContactUs.map(contact => contact.id)
      state.contacts.data = state.contacts.data.filter(contact => !deletedIds.includes(contact.id))
      state.contacts.deleting = false
      state.contacts.total -= action.payload.data.deletedContactUs.length
    })
    builder.addCase(deleteBulkContacts.rejected, state => {
      state.contacts.deleting = false
    })
  }
})

export default appContactUsSlice.reducer
