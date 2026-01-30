// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'utils/api'

// ** Fetch blog
export const fetchBlog = createAsyncThunk('fetchBlog', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/blog', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Fetch blog by id
export const fetchBlogById = createAsyncThunk('fetchBlogById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/v1/blog/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create blog
export const createBlog = createAsyncThunk('createBlog', async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('subDescription', data.subDescription)
    formData.append('author', data.author)

    if (data.file) {
      formData.append('file', data.file)
    }

    const res = await api.post('/v1/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update blog
export const updateBlog = createAsyncThunk('updateBlog', async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('subDescription', data.subDescription)
    formData.append('author', data.author)

    if (data.file) {
      formData.append('file', data.file)
    }

    const res = await api.put(`/v1/blog/${data.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete blog
export const deleteBlog = createAsyncThunk('deleteBlog', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/blog/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appBlogSlice = createSlice({
  name: 'appBlog',
  initialState: {
    blogs: {
      data: [],
      relation: null,
      blog: null,
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      creating: false,
      updating: false,
      deleting: false,
      editData: null,
      drawerOpen: false
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchBlog.pending, state => {
      state.blogs.loading = true
    })
    builder.addCase(fetchBlog.fulfilled, (state, action) => {
      state.blogs = action.payload
      state.blogs.loading = false
      state.blogs.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchBlog.rejected, state => {
      state.blogs.loading = false
    })

    builder.addCase(fetchBlogById.pending, state => {
      state.blogs.loading = true
    })
    builder.addCase(fetchBlogById.fulfilled, (state, action) => {
      state.blogs.blog = action.payload.data
      state.blogs.loading = false
    })
    builder.addCase(fetchBlogById.rejected, state => {
      state.blogs.loading = false
    })

    builder.addCase(createBlog.pending, state => {
      state.blogs.creating = true
    })
    builder.addCase(createBlog.fulfilled, (state, action) => {
      state.blogs.data = [action.payload.data, ...state.blogs.data]
      state.blogs.creating = false
    })
    builder.addCase(createBlog.rejected, state => {
      state.blogs.creating = false
    })

    builder.addCase(updateBlog.pending, state => {
      state.blogs.updating = true
    })
    builder.addCase(updateBlog.fulfilled, (state, action) => {
      state.blogs.data = state.blogs.data.map(blog => {
        if (blog.id === action.payload.data.id) {
          return action.payload.data
        }

        return blog
      })

      state.blogs.updating = false
    })
    builder.addCase(updateBlog.rejected, state => {
      state.blogs.updating = false
    })

    builder.addCase(deleteBlog.pending, state => {
      state.blogs.deleting = true
    })
    builder.addCase(deleteBlog.fulfilled, (state, action) => {
      state.blogs.data = state.blogs.data.filter(blog => blog.id !== action.payload.data.id)
      state.blogs.deleting = false
      state.blogs.total = state.blogs.total - 1
    })
    builder.addCase(deleteBlog.rejected, state => {
      state.blogs.deleting = false
    })
  }
})

export default appBlogSlice.reducer
