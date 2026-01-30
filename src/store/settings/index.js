// ** Redux
import { createAction, createSlice } from '@reduxjs/toolkit'

// ** Third Party Components

// ** API

export const resetStore = createAction('RESET_STORE')

// ** Slice
export const appSettingSlice = createSlice({
  name: 'appSetting',
  initialState: {
    user: null,
    userLoading: false
  },
  reducers: {
    setUserLoading: (state, action) => {
      state.userLoading = action.payload
    },

    setUser: (state, action) => {
      state.user = action.payload
    }
  }
})

export const { setUserLoading, setUser } = appSettingSlice.actions

export default appSettingSlice.reducer
