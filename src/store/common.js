// ** Redux
import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'utils/api'

// ** Upload Image
export const uploadFiles = createAsyncThunk('uploadImage', async (files, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const res = await api.post('/v1/common/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})
