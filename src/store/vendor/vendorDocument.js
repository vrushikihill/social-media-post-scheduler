// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'

// ** API

// ** Fetch vendor
export const fetchVendorDocument = createAsyncThunk(
  'appSetting/fetchVendorDocument',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/v1/vendor/document/${id}`)

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Add Document
export const createVendorDocument = createAsyncThunk(
  'appPurchase/createVendorDocument',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/v1/vendor/document', data)

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Delete Customer

export const deleteVendorDocument = createAsyncThunk(
  'appPurchase/deleteVendorDocument',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/v1/vendor/document/${id}`)

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Slice
export const appVendorDocumentSlice = createSlice({
  name: 'appVendorDocument',
  initialState: {
    vendorDocuments: {
      data: [],
      loading: false,
      singleLoading: false,
      creating: false,
      updating: false,
      deleting: false,
      editData: null,
      drawerOpen: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchVendorDocument.pending, state => {
      state.vendorDocuments.loading = true
    })
    builder.addCase(fetchVendorDocument.fulfilled, (state, action) => {
      state.vendorDocuments = action.payload
      state.vendorDocuments.loading = false
    })
    builder.addCase(fetchVendorDocument.rejected, state => {
      state.vendorDocuments.loading = false
    })

    builder.addCase(createVendorDocument.pending, state => {
      state.vendorDocuments.creating = true
    })
    builder.addCase(createVendorDocument.fulfilled, (state, action) => {
      state.vendorDocuments.data.push(action.payload.data)
      state.vendorDocuments.creating = false
    })
    builder.addCase(createVendorDocument.rejected, state => {
      state.vendorDocuments.creating = false
    })

    builder.addCase(deleteVendorDocument.pending, state => {
      state.vendorDocuments.deleting = true
    })
    builder.addCase(deleteVendorDocument.fulfilled, (state, action) => {
      state.vendorDocuments.data = state.vendorDocuments.data.filter(document => document.id !== action.payload.data.id)
      state.vendorDocuments.deleting = false
      state.vendorDocuments.total = state.vendorDocuments.total - 1
    })
    builder.addCase(deleteVendorDocument.rejected, state => {
      state.vendorDocuments.deleting = false
    })
  }
})

export default appVendorDocumentSlice.reducer
