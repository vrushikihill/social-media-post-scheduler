/* eslint-disable no-unused-vars */
// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Next Import
import { useRouter } from 'next/router'
import api from 'utils/api'

// ** API
import { me } from 'src/store/settings/user/user'

// ** Auth Token
import setAuthToken from 'utils/setAuthToken'
import { resetStore, setUser as setStoreUser, setUserLoading } from 'src/store/settings'

// ** Config
import { useDispatch, useSelector } from 'react-redux'
import { useSettings } from 'src/@core/hooks/useSettings'
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  getUser: () => Promise.resolve(),
  sendResetPasswordLink: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  checkResetPasswordLink: () => Promise.resolve(),
  updateAccount: () => Promise.resolve(),
  addStatus: () => Promise.resolve(),
  addOrganization: () => Promise.resolve(),
  changeOrganization: () => Promise.resolve(),
  deleteStatus: () => Promise.resolve(),
  addClub: () => Promise.resolve(),
  deleteClub: () => Promise.resolve(),
  savePin: () => Promise.resolve(),
  saveKioskDuration: () => Promise.resolve(),
  resendEmailVerificationLink: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [searchValue, setSearchValue] = useState('')

  // const [user, setUser] = useState(defaultProvider.user)
  const { user: owner, userLoading } = useSelector(state => state.settings)

  const loading = userLoading
  const user = owner

  const { settings, saveSettings } = useSettings()

  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const setUser = user => {
    dispatch(setStoreUser(user))
  }

  const initAuth = async () => {
    try {
      if (!router.isReady) {
        return
      }

      let storedToken = localStorage.getItem(authConfig.storageTokenKeyName)

      // fetching direct from localStorage because of initial static data at first render
      let localSettings = window.localStorage.getItem('settings')

      if (localSettings) {
        localSettings = JSON.parse(localSettings)
      }

      const { access_token: accessToken, ...query } = router.query

      if (accessToken && !storedToken) {
        storedToken = accessToken
        localStorage.setItem(authConfig.storageTokenKeyName, accessToken)

        router.replace({
          query
        })
      }

      if (storedToken) {
        dispatch(setUserLoading(true))
        setAuthToken(storedToken)
        await handleGetUser()
        dispatch(setUserLoading(false))
      }
    } catch (err) {}
  }

  const handleGetUser = () => {
    return new Promise((resolve, reject) => {
      try {
        dispatch(
          me({
            successCallback: _user => {
              if (router.query.access_token) {
                // remove the access token from the query
                const { access_token, ...query } = router.query

                router.replace({
                  query
                })
              }
              resolve()
            },
            errorCallback: err => {
              if (err.response?.status === 401) {
                handleLogout()
                router.replace(`/login?returnUrl=${router.asPath}`)
              }

              reject(err)
            }
          })
        )
      } catch (err) {
        setAuthToken(null)
        router.replace(`/login?returnUrl=${router.asPath}`)

        reject(err)
      }
    })
  }

  const handleLogin = async (body, errorCallback, returnUrl) => {
    try {
      const res = await api.post(authConfig.loginEndpoint, body)

      setAuthToken(res.data.data.authToken)

      await handleGetUser()

      router.replace(returnUrl || '/one-page-tabs')
    } catch (err) {
      const errors = err?.response?.data?.message || ''
      errorCallback(errors)
    }
  }

  const handleRegister = async (params, errorCallback) => {
    try {
      const res = await api.post(authConfig.registerEndpoint, params)

      toast.success('Registration successful. Please check your email for verification link.')

      return res

      // router.replace('/login')
    } catch (err) {
      const errors = err.response?.data?.message || ''
      errorCallback(errors)
    }
  }

  const handleAddOrganization = async (params, errorCallback) => {
    try {
      const formData = new FormData()
      formData.append('file', params.logo[0]) // Ensure this matches backend `@UploadedFile()`
      formData.append('name', params.organization)

      const res = await api.put('/v1/users/add-organization', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setAuthToken(res.data.data.token.authToken)
      await handleGetUser()

      toast.success('Organization added successfully!')
      router.replace('/')
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong.'
      errorCallback(errorMessage)
    }
  }

  const handleChangeOrganization = async (body, errorCallback, returnUrl) => {
    try {
      const res = await api.post(authConfig.loginChangeOrganizationEndpoint, body)

      setAuthToken(res.data.data.authToken)

      await handleGetUser()
      await router.replace('/')
      router.reload()
    } catch (err) {
      const errors = err?.response?.data?.message || ''
      errorCallback(errors)
    }
    // eslint-disable-next-line no-unused-expressions
    returnUrl
  }

  const handleLogout = isKiosk => {
    setAuthToken(null, isKiosk)
    if (isKiosk) {
      router.replace('/one-page-tabs')

      const previousTheme = localStorage.getItem('mui-theme')
      localStorage.removeItem('mui-theme')

      if (previousTheme) {
        saveSettings({
          ...settings,
          mode: previousTheme
        })
      }
    } else {
      setUser(null)
      dispatch(resetStore())
      router.replace('/login')
    }
  }

  const handleSendResetPasswordLink = async (params, errorCallback) => {
    try {
      const res = await api.post(authConfig.sendResetPasswordLinkEndpoint, params)
      toast.success(res.data.data.message)
    } catch (err) {
      const errors = err?.response?.data?.message || []
      errorCallback(errors)
    }
  }

  const handleResetPassword = async (params, errorCallback) => {
    try {
      const res = await api.post(authConfig.setPasswordLinkEndpoint, params)
      toast.success(res.data.data.message)
    } catch (err) {
      const errors = err.response?.data?.errors
      errorCallback(errors)
    }
  }

  const handleCheckResetPasswordLink = async token => {
    try {
      let res

      res = await api.get(`${authConfig.setPasswordLinkEndpoint}/${token}`)

      return false
    } catch (err) {
      const error = err.response?.data?.message
      toast.error(error)
    }

    return true
  }

  const handleResendEmailVerificationLink = async (params, errorCallback) => {
    try {
      const res = await api.post(authConfig.resendVerificationLinkEndpoint, params)
      toast.success(res.data.data.message)
    } catch (err) {
      const errors = err?.response?.data?.message || []
      errorCallback(errors)
    }
  }

  const values = {
    user,
    loading,
    setUser,
    getUser: handleGetUser,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    addOrganization: handleAddOrganization,
    changeOrganization: handleChangeOrganization,
    sendResetPasswordLink: handleSendResetPasswordLink,
    resetPassword: handleResetPassword,
    checkResetPasswordLink: handleCheckResetPasswordLink,
    resendEmailVerificationLink: handleResendEmailVerificationLink,
    searchValue,
    setSearchValue
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

const KioskAuthProvider = ({ children }) => {
  return <AuthProvider isKiosk>{children}</AuthProvider>
}

export { AuthContext, AuthProvider, KioskAuthProvider }
