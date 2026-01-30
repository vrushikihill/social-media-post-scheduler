// ** API
import api from './api'

// ** Config
import authConfig from 'src/configs/auth'

// store our JWT in LS and set axios headers if we do have a token

const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    localStorage.setItem(authConfig.storageTokenKeyName, token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem(authConfig.storageTokenKeyName)
  }
}

export default setAuthToken
