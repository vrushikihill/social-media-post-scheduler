import { useDispatch } from 'react-redux'
import { openModal, closeModal, closeAllModals } from 'src/store/modal'

const useModal = () => {
  const dispatch = useDispatch()

  return {
    openModal: (modal, props = {}) => dispatch(openModal({ modal, props })),
    closeModal: modal => dispatch(closeModal(modal)),
    closeAllModals: () => dispatch(closeAllModals())
  }
}

export default useModal
