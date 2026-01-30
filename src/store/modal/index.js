import { createSlice } from '@reduxjs/toolkit'

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    modals: []
  },
  reducers: {
    openModal: (state, action) => {
      const { modal, props } = action.payload
      if (!state.modals.find(m => m.modal === modal)) {
        state.modals.push({ modal, props })
      }
    },
    closeModal: (state, action) => {
      state.modals = state.modals.filter(m => m.modal !== action.payload)
    },
    closeAllModals: state => {
      state.modals = []
    }
  }
})

export const { openModal, closeModal, closeAllModals } = modalSlice.actions

export default modalSlice.reducer
