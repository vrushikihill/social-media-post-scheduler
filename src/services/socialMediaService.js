import api from './api'

// OAuth Configuration for each platform
const OAUTH_CONFIG = {
  facebook: {
    clientId: '1813720989442650',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/facebook/callback`,
    scope: 'pages_manage_posts,pages_read_engagement,pages_show_list,instagram_basic,instagram_content_publish',
    responseType: 'code'
  },
  instagram: {
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID, // Instagram uses Facebook App
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/instagram/callback`,
    scope: 'instagram_basic,instagram_content_publish',
    responseType: 'code'
  },
  linkedin: {
    clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/linkedin/callback`,
    scope: 'r_liteprofile,r_emailaddress,w_member_social,w_organization_social',
    responseType: 'code'
  },
  twitter: {
    clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/twitter/callback`,
    scope: 'tweet.read,tweet.write,users.read,offline.access',
    responseType: 'code',
    codeChallenge: 'challenge'
  }
}

// OAuth Helper Functions
export const oauthHelpers = {
  // Generate OAuth URL for platform
  getAuthUrl: platform => {
    const config = OAUTH_CONFIG[platform]
    if (!config) throw new Error(`Unsupported platform: ${platform}`)

    /* console.log({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope,
      response_type: config.responseType,
      state: `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }) */

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope,
      response_type: config.responseType,
      state: `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    })

    // Platform-specific OAuth URLs
    const authUrls = {
      facebook: `https://www.facebook.com/v18.0/dialog/oauth?${params}`,
      instagram: `https://www.facebook.com/v18.0/dialog/oauth?${params}`,
      linkedin: `https://www.linkedin.com/oauth/v2/authorization?${params}`,
      twitter: `https://twitter.com/i/oauth2/authorize?${params}&code_challenge=${config.codeChallenge}&code_challenge_method=S256`
    }

    return authUrls[platform]
  },

  // Open OAuth popup window
  openAuthPopup: platform => {
    const authUrl = oauthHelpers.getAuthUrl(platform)
    const popup = window.open(authUrl, `${platform}_auth`, 'width=600,height=700,scrollbars=yes,resizable=yes')

    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          reject(new Error('Authentication cancelled'))
        }
      }, 1000)

      // Listen for auth success message
      const messageListener = event => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === 'OAUTH_SUCCESS') {
          clearInterval(checkClosed)
          window.removeEventListener('message', messageListener)
          popup.close()
          resolve(event.data.authCode)
        } else if (event.data.type === 'OAUTH_ERROR') {
          clearInterval(checkClosed)
          window.removeEventListener('message', messageListener)
          popup.close()
          reject(new Error(event.data.error))
        }
      }

      window.addEventListener('message', messageListener)
    })
  },

  // Handle OAuth callback (for popup)
  handleAuthCallback: () => {
    const searchParams = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''))

    const code = searchParams.get('code') || hashParams.get('code')
    const state = searchParams.get('state') || hashParams.get('state')
    const error = searchParams.get('error') || hashParams.get('error')

    // console.log('OAuth Params:', { code, state, error })

    if (error) {
      window.opener?.postMessage({ type: 'OAUTH_ERROR', error }, window.location.origin)

      return
    }

    if (code && state) {
      // console.log('OAuth Success:', { code, state })

      if (!window.opener) {
        // console.error('❌ window.opener is null — popup not opened via window.open')

        return
      }

      window.opener.postMessage({ type: 'OAUTH_SUCCESS', authCode: code, state }, '*')

      window.close()
    }
  }
}

// Social Accounts API
export const socialAccountsAPI = {
  // Get all connected accounts
  getAccounts: () => api.get('/v1/auth-social-media/connected'),

  // Initiate OAuth flow
  initiateAuth: async platform => {
    try {
      const authCode = await oauthHelpers.openAuthPopup(platform)

      return await socialAccountsAPI.connectAccount(platform, authCode)
    } catch (error) {
      throw new Error(`Failed to authenticate with ${platform}: ${error.message}`)
    }
  },

  // Connect new account with auth code
  connectAccount: (platform, authCode, state) =>
    api.post('/v1/auth-social-media/connect', { platform, authCode, state }),

  // Disconnect account
  disconnectAccount: accountId => api.delete(`/v1/social-accounts/${accountId}`),

  // Refresh token
  refreshToken: accountId => api.post(`/v1/social-accounts/${accountId}/refresh-token`),

  // Get account status
  getAccountStatus: accountId => api.get(`/v1/social-accounts/${accountId}/status`),

  // Validate token
  validateToken: accountId => api.post(`/v1/social-accounts/${accountId}/validate`),

  // Get platform pages/accounts (for Facebook/Instagram)
  getPlatformPages: accountId => api.get(`/v1/social-accounts/${accountId}/pages`),

  // Select specific page/account
  selectPage: (accountId, pageId) => api.post(`/v1/social-accounts/${accountId}/select-page`, { pageId })
}

// Posts API
export const postsAPI = {
  // Get all posts
  getPosts: (params = {}) => api.get('/v1/social-media-post/all', { params }),

  // Create new post
  createPost: postData => api.post('/v1/social-media-post/post', postData),

  // Update post
  updatePost: (postId, postData) => api.put(`/v1/social-media-post/${postId}`, postData),

  // Delete post
  deletePost: postId => api.delete(`/v1/social-media-post/scheduled/${postId}`),

  // Duplicate post
  duplicatePost: postId => api.post(`/v1/social-media-post/${postId}/duplicate`),

  // Schedule post
  schedulePost: (postId, scheduleData) => api.post('/v1/social-media-post/schedule', { postId, ...scheduleData }),

  // Publish now
  publishNow: postId => api.post(`/v1/social-media-post/${postId}/publish`),

  // Get scheduled posts
  getScheduledPosts: () => api.get('/v1/social-media-post/scheduled'),

  // Get published posts
  getPublishedPosts: () => api.get('/v1/social-media-post/published'),

  // Get failed posts
  getFailedPosts: () => api.get('/v1/social-media-post/failed')
}

// AI Templates API
export const aiTemplatesAPI = {
  // Get all templates
  getTemplates: () => api.get('/v1/ai-templates'),

  // Get template by ID
  getTemplate: templateId => api.get(`/v1/ai-templates/${templateId}`),

  // Generate content using AI
  generateContent: (templateId, data) => api.post(`/v1/ai-templates/generate/${templateId}`, data),

  // Generate hashtags
  generateHashtags: (content, platform) => api.post('/v1/ai/generate-hashtags', { content, platform }),

  // Generate captions
  generateCaption: (prompt, platform, tone) => api.post('/v1/ai/generate-caption', { prompt, platform, tone })
}

// Media API
export const mediaAPI = {
  // Upload media
  uploadMedia: formData =>
    api.post('/v1/common/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  // Get media library
  getMediaLibrary: () => api.get('/v1/media'),

  // Delete media
  deleteMedia: mediaId => api.delete(`/v1/media/${mediaId}`)
}

// Analytics API
export const analyticsAPI = {
  // Get dashboard stats
  getDashboardStats: () => api.get('/v1/social-media-post/counts'),

  // Get post analytics
  getPostAnalytics: postId => api.get(`/v1/analytics/posts/${postId}`),

  // Get platform analytics
  getPlatformAnalytics: (platform, dateRange) => api.get(`/v1/analytics/platforms/${platform}`, { params: dateRange })
}

// Calendar API
export const calendarAPI = {
  // Get calendar events
  getCalendarEvents: (startDate, endDate) =>
    api.get('/v1/social-media-post/all', {
      params: { startDate, endDate, filter: 'SCHEDULED' }
    }),

  // Update post schedule
  updatePostSchedule: (postId, newDateTime) =>
    api.put(`/v1/calendar/posts/${postId}/reschedule`, {
      scheduledAt: newDateTime
    })
}

// Platform Sync API
export const syncAPI = {
  // Sync scheduled posts from platforms
  syncScheduledPosts: () => api.post('/v1/sync/scheduled-posts'),

  // Get sync status
  getSyncStatus: () => api.get('/v1/sync/status'),

  // Manual sync for specific account
  syncAccount: accountId => api.post(`/v1/sync/accounts/${accountId}`)
}

// Activity API
export const activityAPI = {
  getStats: () => api.get('/v1/activity/stats')
}
