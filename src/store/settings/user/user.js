// ** Redux
import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import authConfig from 'src/configs/auth'
import api from 'utils/api'

export const resetStore = createAction('RESET_STORE')

// ** Fetch Me
export const me = createAsyncThunk(
  'appSetting/fetchUser',
  async ({ successCallback, errorCallback }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setUserLoading(false))

      const res = await api.get(authConfig.meEndpoint)

      const user = res.data.data

      dispatch(setUser(user))

      successCallback(user)

      return res.data
    } catch (err) {
      errorCallback(err)

      return rejectWithValue(err)
    } finally {
      dispatch(setUserLoading(false))
    }
  }
)

// ** Fetch users
export const fetchUsers = createAsyncThunk('appSetting/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/users/super-admin/all', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update User

export const updateUser = createAsyncThunk('appSetting/updateUser', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/users/super-admin/${data.id}`, data)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete User
export const deleteUser = createAsyncThunk('appSetting/deleteUser', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/users/delete/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const userSlice = createSlice({
  name: 'appSetting',
  initialState: {
    user: null,
    userLoading: false,
    users: {
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      drawerOpen: false
    }
  },
  reducers: {
    setUserLoading: (state, action) => {
      state.userLoading = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUsers.pending, state => {
      state.users.loading = true
    })
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload
      state.users.loading = false
      state.users.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchUsers.rejected, state => {
      state.users.loading = false
    })

    builder.addCase(updateUser.pending, state => {
      state.users.updating = true
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.users.data = state.users.data.map(user => (user.id === action.payload.data.id ? action.payload.data : user))
      state.users.updating = false
    })
    builder.addCase(updateUser.rejected, state => {
      state.users.updating = false
    })

    builder.addCase(deleteUser.pending, state => {
      state.users.deleting = true
    })
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users.data = state.users.data.map(user => (user.id === action.payload.data.id ? action.payload.data : user))
      state.users.deleting = false
    })
    builder.addCase(deleteUser.rejected, state => {
      state.users.deleting = false
    })
  }
})

export const { setUserLoading, setUser } = userSlice.actions

export default userSlice.reducer
