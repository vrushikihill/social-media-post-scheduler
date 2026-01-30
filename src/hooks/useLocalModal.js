import { useContext } from 'react'

// Context
import { LocalModalContext } from 'src/context/LocalModalContext'

/**
 * Custom hook for LocalModalContext
 */
const useLocalModal = () => {
  const context = useContext(LocalModalContext)

  if (!context) {
    throw new Error('useLocalModal must be used within a LocalModalProvider')
  }

  const { closeModal, openModal, openModals } = context

  return {
    closeModal,
    openModal,
    openModals
  }
}

export default useLocalModal
