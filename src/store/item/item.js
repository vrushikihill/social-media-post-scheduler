// ** Redux

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch inventory-item
export const fetchItem = createAsyncThunk('appInventory/fetchItem', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/inventory-item', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Fetch item
export const fetchOrganizationsItem = createAsyncThunk(
  'appInventory/fetchOrganizationsItem',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get(`/v1/inventory-item/super-admin/${params.id}`, { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Fetch inventory_specification
export const fetchInventorySpecification = createAsyncThunk(
  'appInventory/fetchInventorySpecification',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/v1/inventory-item/specification', { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Fetch Inventory Summary
export const fetchInventorySummary = createAsyncThunk(
  'appInventory/fetchInventorySummary',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/v1/inventory-item/inventory-summary', { params })

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Fetch Top Selling Items
export const fetchTopSelling = createAsyncThunk('appInventory/fetchTopSelling', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/inventory-item/top-selling', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Fetch  inventory-item by id
export const fetchItemById = createAsyncThunk('fetchItemById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/v1/inventory-item/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create Items
export const createItem = createAsyncThunk('appInventory/createItem', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/inventory-item', {
      name: data.name,
      price: data.price,
      lowStockAlert: data.lowStockAlert,
      manufacturer: data.manufacturer,
      branch: data.branch,
      series: data.series,
      subCategory: data.category,
      isSpecification: data.isSpecification,
      specifications: data.specifications,
      image: data.image
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update Items
export const updateItem = createAsyncThunk('appSales/updateItem', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/inventory-item/${data.id}`, {
      name: data.name,
      price: data.price,
      lowStockAlert: data.lowStockAlert,
      manufacturer: data.manufacturer,
      branch: data.branch,
      series: data.series,
      subCategory: data.category,
      isSpecification: data.isSpecification,
      specifications: data.specifications,
      image: data.image
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Relation On Items
export const relationsItems = createAsyncThunk('appInventory/relation', async (data, { rejectWithValue }) => {
  try {
    const res = await api.get(`/v1/inventory-item/${data.id}/relation`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete Items
export const deleteItems = createAsyncThunk('appInventory/deleteItems', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/inventory-item/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete Bulk Customer
export const deleteBulkItems = createAsyncThunk('appInventory/deleteBulkItems', async (ids, { rejectWithValue }) => {
  try {
    const res = await api.put('/v1/inventory-item/delete-multiple', ids)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appItemSlice = createSlice({
  name: 'appItem',
  initialState: {
    items: {
      data: [],
      allItem: [],
      specification: [],
      topSelling: [],
      relation: null,
      item: null,
      inventorySummary: null,
      total: 0,
      page: 1,
      pageSize: 10,
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
    builder.addCase(fetchOrganizationsItem.pending, state => {
      state.items.loading = true
    })

    builder.addCase(fetchOrganizationsItem.fulfilled, (state, action) => {
      state.items = action.payload
      state.items.loading = false
      state.items.total = action.payload?.pagination?.count
    })

    builder.addCase(fetchOrganizationsItem.rejected, state => {
      state.items.loading = false
    })

    builder.addCase(fetchItem.pending, state => {
      state.items.loading = true
    })
    builder.addCase(fetchItem.fulfilled, (state, action) => {
      state.items.allItem = action.payload.data
      state.items.loading = false
      state.items.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchItem.rejected, state => {
      state.items.loading = false
    })
    builder.addCase(fetchTopSelling.pending, state => {
      state.items.loading = true
    })
    builder.addCase(fetchTopSelling.fulfilled, (state, action) => {
      state.items.topSelling = action.payload.data
      state.items.loading = false
    })
    builder.addCase(fetchTopSelling.rejected, state => {
      state.items.loading = false
    })
    builder.addCase(fetchInventorySummary.pending, state => {
      state.items.loading = true
    })
    builder.addCase(fetchInventorySummary.fulfilled, (state, action) => {
      state.items.inventorySummary = action.payload.data
      state.items.loading = false
    })
    builder.addCase(fetchInventorySummary.rejected, state => {
      state.items.loading = false
    })
    builder.addCase(fetchInventorySpecification.pending, state => {
      state.items.loading = true
    })
    builder.addCase(fetchInventorySpecification.fulfilled, (state, action) => {
      state.items.specification = action.payload.data
      state.items.loading = false
    })
    builder.addCase(fetchInventorySpecification.rejected, state => {
      state.items.loading = false
    })
    builder.addCase(fetchItemById.pending, state => {
      state.items.singleLoading = true
    })
    builder.addCase(fetchItemById.fulfilled, (state, action) => {
      state.items.item = action.payload.data
      state.items.singleLoading = false
    })
    builder.addCase(fetchItemById.rejected, (state, action) => {
      state.items.singleLoading = false
      state.items.error = action.payload
    })
    builder.addCase(createItem.pending, state => {
      state.items.creating = true
    })
    builder.addCase(createItem.fulfilled, (state, action) => {
      state.items.data.push(action.payload.data)
      state.items.creating = false
    })
    builder.addCase(createItem.rejected, state => {
      state.items.creating = false
    })
    builder.addCase(updateItem.pending, state => {
      state.items.updating = true
    })
    builder.addCase(updateItem.fulfilled, (state, action) => {
      state.items.data = state.items.data.map(item => {
        if (item.id === action.payload.data.id) {
          return action.payload.data
        }

        return item
      })
      state.items.data.push(action.payload.data)
      state.items.updating = false
    })
    builder.addCase(updateItem.rejected, state => {
      state.items.updating = false
    })
    builder.addCase(relationsItems.pending, state => {
      state.items.loading = true
    })
    builder.addCase(relationsItems.fulfilled, (state, action) => {
      state.items.loading = false
      state.items.relation = action.payload.data
    })
    builder.addCase(relationsItems.rejected, state => {
      state.items.loading = false
    })
    builder.addCase(deleteItems.pending, state => {
      state.items.deleting = true
    })
    builder.addCase(deleteItems.fulfilled, (state, action) => {
      state.items.data = state.items.data.filter(items => items.id !== action.payload.data.id)
      state.items.deleting = false
      state.items.total = state.items.total - 1
    })
    builder.addCase(deleteItems.rejected, state => {
      state.items.deleting = false
    })
    builder.addCase(deleteBulkItems.pending, state => {
      state.items.deleting = true
    })
    builder.addCase(deleteBulkItems.fulfilled, (state, action) => {
      const deletedIds = action.payload.data.deletedItem.map(item => item.id)
      state.items.data = state.items.data.filter(item => !deletedIds.includes(item.id))
      state.items.deleting = false
      state.items.total -= action.payload.data.deletedItem.length
    })
    builder.addCase(deleteBulkItems.rejected, state => {
      state.items.deleting = false
    })
  }
})

export default appItemSlice.reducer
