// Facebook SDK utility
let fbSDKLoaded = false
let fbInitialized = false

export const loadFacebookSDK = () => {
  return new Promise((resolve, reject) => {
    // Check if running on server side
    if (typeof window === 'undefined') {
      reject(new Error('Facebook SDK can only be loaded on client side'))

      return
    }

    // If already loaded and initialized, resolve immediately
    if (fbSDKLoaded && fbInitialized && window.FB) {
      resolve(window.FB)

      return
    }

    // If SDK is already loaded but not initialized
    if (window.FB) {
      initializeFB().then(resolve).catch(reject)

      return
    }

    // Load the SDK
    window.fbAsyncInit = function () {
      initializeFB().then(resolve).catch(reject)
    }

    // Check if script is already added
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script')
      script.id = 'facebook-jssdk'
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.async = true
      script.defer = true

      script.onerror = () => {
        reject(new Error('Failed to load Facebook SDK'))
      }

      document.body.appendChild(script)
    }

    fbSDKLoaded = true
  })
}

const initializeFB = () => {
  return new Promise((resolve, reject) => {
    try {
      const appId = process.env.NEXT_PUBLIC_FB_APP_ID

      if (!appId) {
        reject(
          new Error('Facebook App ID not configured. Please set NEXT_PUBLIC_FB_APP_ID in your environment variables.')
        )

        return
      }

      window.FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: 'v19.0'
      })

      // Wait for FB to be ready
      window.FB.getLoginStatus(() => {
        fbInitialized = true
        resolve(window.FB)
      })
    } catch (error) {
      reject(error)
    }
  })
}

export const facebookLogin = (options = {}) => {
  return new Promise((resolve, reject) => {
    // Check HTTPS requirement
    if (
      typeof window !== 'undefined' &&
      window.location.protocol !== 'https:' &&
      window.location.hostname !== 'localhost'
    ) {
      reject(new Error('Facebook login requires HTTPS. Please use HTTPS or localhost for development.'))

      return
    }

    loadFacebookSDK()
      .then(FB => {
        const defaultOptions = {
          scope: 'pages_show_list,pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish'
        }

        const loginOptions = { ...defaultOptions, ...options }

        FB.login(response => {
          if (response.authResponse) {
            resolve(response)
          } else {
            reject(new Error('Facebook login was cancelled or failed'))
          }
        }, loginOptions)
      })
      .catch(reject)
  })
}

export const getFacebookLoginStatus = () => {
  return new Promise((resolve, reject) => {
    loadFacebookSDK()
      .then(FB => {
        FB.getLoginStatus(response => {
          resolve(response)
        })
      })
      .catch(reject)
  })
}
