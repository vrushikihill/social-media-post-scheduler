// ** React Imports
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'

const GuestGuard = props => {
  const { children, fallback } = props

  const auth = useAuth()

  let storedToken = typeof window !== 'undefined' ? localStorage.getItem(authConfig.storageTokenKeyName) : null

  if (auth.loading || (storedToken && !auth.user)) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
