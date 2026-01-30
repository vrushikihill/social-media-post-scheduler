import { createContext, useState } from 'react'

export const LocalModalContext = createContext({
  openModals: [],
  openModal: () => {},
  closeModal: () => {}
})

export const LocalModalProvider = ({ children, modals }) => {
  const [openModals, setOpenModals] = useState([])

  const openModal = (modal, props) => {
    setOpenModals(prevState => [
      ...prevState,
      {
        name: modal,
        props
      }
    ])
  }

  const closeModal = modalName => {
    setOpenModals(openModals.filter(({ name }) => name !== modalName))
  }

  return (
    <LocalModalContext.Provider value={{ openModals, openModal, closeModal }}>
      {children}

      {openModals.map(({ name, props }) => {
        const Modal = modals[name]

        return <Modal key={name} open onClose={() => closeModal(name)} {...props} />
      })}
    </LocalModalContext.Provider>
  )
}
