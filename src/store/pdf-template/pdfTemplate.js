// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'

// ** API

// ** Fetch Template
export const fetchTemplate = createAsyncThunk('appSetting/fetchTemplate', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/template', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Fetch Template by id
export const fetchTemplateById = createAsyncThunk('fetchTemplateById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/v1/template/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Fetch default template

export const fetchDefaultTemplate = createAsyncThunk('fetchDefaultTemplate', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get(`/v1/template/${params.organizationId}/default`, { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** create template
export const createTemplate = createAsyncThunk('appSetting/createTemplate', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/template/template', {
      name: data.name,
      imageUrl: data.imageUrl,
      type: data.type
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update Template
export const updateTemplate = createAsyncThunk('appSetting/updateTemplate', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/template/${data.id}`, {
      name: data.name,
      imageUrl: data.imageUrl,
      type: data.type
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** default selected template
export const defaultSelectedTemplate = createAsyncThunk(
  'appSetting/defaultSelectedTemplate',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.put(`/v1/template/default/${id}`)

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Delete Template
export const deleteTemplate = createAsyncThunk('appSetting/deleteTemplate', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/template/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appTemplatesSlice = createSlice({
  name: 'appTemplates',
  initialState: {
    templates: {
      data: [],
      relation: null,
      template: null,
      loading: false,
      updating: false,
      singleLoading: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchTemplate.pending, state => {
      state.templates.loading = true
    })
    builder.addCase(fetchTemplate.fulfilled, (state, action) => {
      state.templates = action.payload
      state.templates.loading = false
    })
    builder.addCase(fetchTemplate.rejected, state => {
      state.templates.loading = false
    })

    builder.addCase(fetchTemplateById.pending, state => {
      state.templates.singleLoading = true
    })
    builder.addCase(fetchTemplateById.fulfilled, (state, action) => {
      state.templates.template = action.payload.data
      state.templates.singleLoading = false
    })
    builder.addCase(fetchTemplateById.rejected, state => {
      state.templates.singleLoading = false
    })

    builder.addCase(fetchDefaultTemplate.pending, state => {
      state.templates.singleLoading = true
    })
    builder.addCase(fetchDefaultTemplate.fulfilled, (state, action) => {
      state.templates.template = action.payload.data
      state.templates.singleLoading = false
    })
    builder.addCase(fetchDefaultTemplate.rejected, state => {
      state.templates.singleLoading = false
    })

    builder.addCase(createTemplate.pending, state => {
      state.templates.creating = true
    })
    builder.addCase(createTemplate.fulfilled, (state, action) => {
      state.templates.data.push(action.payload.data)
      state.templates.creating = false
    })
    builder.addCase(createTemplate.rejected, state => {
      state.templates.creating = false
    })

    builder.addCase(updateTemplate.pending, state => {
      state.templates.updating = true
    })
    builder.addCase(updateTemplate.fulfilled, (state, action) => {
      state.templates.data = state.templates.data.map(template => {
        if (template.id === action.payload.data.id) {
          return action.payload.data
        }

        return template
      })
      state.templates.updating = false
    })
    builder.addCase(updateTemplate.rejected, state => {
      state.templates.updating = false
    })

    builder.addCase(defaultSelectedTemplate.pending, state => {
      state.templates.updating = true
    })
    builder.addCase(defaultSelectedTemplate.fulfilled, (state, action) => {
      state.templates.data = state.templates.data.map(template => {
        if (template.id === action.payload.data.id) {
          return { ...template, default: true }
        }

        return { ...template, default: false }
      })

      state.templates.updating = false
    })
    builder.addCase(defaultSelectedTemplate.rejected, state => {
      state.templates.updating = false
    })

    builder.addCase(deleteTemplate.pending, state => {
      state.templates.deleting = true
    })
    builder.addCase(deleteTemplate.fulfilled, (state, action) => {
      state.templates.data = state.templates.data.filter(t => t.template.id !== action.payload.data.id)
      state.templates.deleting = false
    })
    builder.addCase(deleteTemplate.rejected, state => {
      state.templates.deleting = false
    })
  }
})

export default appTemplatesSlice.reducer
