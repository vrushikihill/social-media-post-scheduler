import axios from 'axios'

const baseURL = process.env.BACKEND_API_URL

// Create an instance of axios
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
