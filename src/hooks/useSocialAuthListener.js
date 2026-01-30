import { useEffect } from 'react'
import toast from 'react-hot-toast'

const BACKEND_URL = 'http://localhost:8000'

export const useSocialAuthListener = () => {
  useEffect(() => {
    const listener = event => {
      // 🔐 Security check
      if (event.origin !== BACKEND_URL) return
      if (!event.data || typeof event.data !== 'object') return

      const { type, provider } = event.data

      if (type === 'OAUTH_SUCCESS') {
        toast.success(`${provider ?? 'Social'} account connected successfully`)
      }

      if (type === 'OAUTH_ERROR') {
        toast.error(`${provider ?? 'Social'} connection failed`)
      }
    }

    window.addEventListener('message', listener)

    return () => {
      window.removeEventListener('message', listener)
    }
  }, [])
}
