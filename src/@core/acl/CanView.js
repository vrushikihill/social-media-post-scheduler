// ** React Imports
import { useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

const CanView = props => {
  // ** Props
  let {
    children,
    acl: { action, subject },
    fallback // Fallback component to render if user doesn't have permission
  } = props

  fallback = fallback || null

  // ** Hook
  const ability = useContext(AbilityContext)

  return ability && ability.can(action, subject) ? <>{children}</> : <>{fallback}</>
}

export default CanView
