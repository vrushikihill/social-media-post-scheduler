import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Mock posts data
    const posts = [
      {
        id: 1,
        content: 'Exciting product launch coming soon! #ProductLaunch',
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: 'scheduled',
        platforms: [{ platform: 'instagram', accountName: '@review_genie_ihill' }],
        mediaFiles: [{ fileType: 'image', fileUrl: '/images/product-launch.jpg' }]
      }
    ]
    res.status(200).json(posts)

    return
  }

  if (req.method === 'POST') {
    let { content, platforms, scheduledAt, mediaFiles, status } = req.body

    // 🔹 Normalize mediaFiles (simulate uploaded S3 URL)
    mediaFiles = (mediaFiles || []).map(file => ({
      ...file,
      fileUrl:
        'https://ceramic-ihill.s3.ap-south-1.amazonaws.com/media/vrushik/media-assets/78d357d1779af05a5f6c56381dcbc567.jpg',
      publicUrl:
        'https://ceramic-ihill.s3.ap-south-1.amazonaws.com/media/vrushik/media-assets/78d357d1779af05a5f6c56381dcbc567.jpg'
    }))

    // console.log(mediaFiles, '>>>>>>>>>>>>>>>>>>> mediaFiles')

    const isInstagram = platforms.some(p => p === 2 || p.platform === 'instagram')
    const isFacebook = platforms.some(p => p === 1 || p.platform === 'facebook')

    if (!isInstagram && !isFacebook) {
      return res.status(400).json({ error: 'Select at least one platform.' })
    }

    // 🔹 Helpers
    const getMediaType = file => {
      if (file.fileType?.startsWith('video')) return 'video'
      if (file.type?.startsWith('video')) return 'video'
      if ((file.fileUrl || '').match(/\.(mp4|mov)$/i)) return 'video'

      return 'image'
    }

    const getPublicUrl = file => {
      if (file.publicUrl?.startsWith('https://')) return file.publicUrl
      if (file.fileUrl?.startsWith('https://')) return file.fileUrl

      return null
    }

    let instagramPublishedId = null
    let facebookPublishedId = null

    // ===============================
    // 🚀 INSTAGRAM FLOW (FIXED)
    // ===============================
    if (isInstagram) {
      try {
        const accessToken = process.env.FACEBOOK_ACCESS_KEY || process.env.INSTAGRAM_ACCESS_TOKEN
        const pageId = process.env.FACEBOOK_ACCOUNT_ID

        if (!accessToken) {
          // console.error('[IG] Missing access token')
        } else {
          // console.log('[IG] Starting Flow...')

          let igUserId = process.env.INSTAGRAM_ACCOUNT_ID

          // Try fetching linked IG business account
          if (pageId && process.env.FACEBOOK_ACCESS_KEY) {
            try {
              const accountRes = await axios.get(`https://graph.facebook.com/v19.0/${pageId}`, {
                params: {
                  fields: 'instagram_business_account',
                  access_token: process.env.FACEBOOK_ACCESS_KEY
                }
              })

              igUserId = accountRes.data?.instagram_business_account?.id || igUserId

              if (igUserId) {
                // console.log('[IG] Using Business Account:', igUserId)
              }
            } catch (err) {
              // console.warn('[IG] Linked account fetch failed, using env ID')
            }
          }

          if (!igUserId) {
            // console.error('[IG] No Instagram User ID found')
          } else if (!mediaFiles.length) {
            // console.error('[IG] Media required for Instagram')
          } else {
            const mediaFile = mediaFiles[0]
            const mediaType = getMediaType(mediaFile)
            const mediaUrl = getPublicUrl(mediaFile)

            // 🔴 IMPORTANT FIX: Only validate URL, NOT absolutePath
            if (!mediaUrl || mediaUrl.includes('localhost')) {
              // console.warn('[IG] SKIPPED: Media URL must be public HTTPS')
            } else {
              // console.log('[IG] Creating media container:', mediaUrl)

              const params = {
                access_token: accessToken,
                caption: content
              }

              if (mediaType === 'video') {
                params.media_type = 'VIDEO'
                params.video_url = mediaUrl
              } else {
                params.image_url = mediaUrl
              }

              const containerRes = await axios.post(`https://graph.facebook.com/v19.0/${igUserId}/media`, null, {
                params
              })

              const creationId = containerRes.data.id

              // console.log('[IG] Container created:', creationId)

              const publishRes = await axios.post(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, null, {
                params: {
                  creation_id: creationId,
                  access_token: accessToken
                }
              })

              instagramPublishedId = publishRes.data.id

              // console.log('[IG] Published:', instagramPublishedId)
            }
          }
        }
      } catch (error) {
        // console.error('[IG] Error:', error.response?.data || error.message)
      }
    }

    // ===============================
    // 📘 FACEBOOK FLOW (UNCHANGED)
    // ===============================
    if (isFacebook) {
      try {
        const accessToken = process.env.FACEBOOK_ACCESS_KEY
        const pageId = process.env.FACEBOOK_ACCOUNT_ID

        if (!accessToken || !pageId) {
          // console.error('[FB] Missing credentials')
        } else if (mediaFiles.length) {
          const mediaFile = mediaFiles[0]
          const mediaType = getMediaType(mediaFile)

          const formData = new FormData()
          formData.append('access_token', accessToken)
          formData.append(mediaType === 'video' ? 'description' : 'caption', content)

          if (mediaFile.absolutePath && fs.existsSync(mediaFile.absolutePath)) {
            formData.append('source', fs.createReadStream(mediaFile.absolutePath))
          } else {
            const mediaUrl = getPublicUrl(mediaFile)
            formData.append(mediaType === 'video' ? 'file_url' : 'url', mediaUrl)
          }

          const endpoint = mediaType === 'video' ? 'videos' : 'photos'

          const fbRes = await axios.post(`https://graph.facebook.com/v19.0/${pageId}/${endpoint}`, formData, {
            headers: formData.getHeaders(),
            maxBodyLength: Infinity,
            maxContentLength: Infinity
          })

          facebookPublishedId = fbRes.data.post_id || fbRes.data.id

          // console.log('[FB] Published:', facebookPublishedId)
        } else {
          const fbRes = await axios.post(`https://graph.facebook.com/v19.0/${pageId}/feed`, null, {
            params: {
              message: content,
              access_token: accessToken
            }
          })
          facebookPublishedId = fbRes.data.id
        }
      } catch (error) {
        // console.error('[FB] Error:', error.response?.data || error.message)
      }
    }

    // ===============================
    // 📦 RESPONSE
    // ===============================
    const publishedResults = []
    if (instagramPublishedId) publishedResults.push({ platform: 'instagram', id: instagramPublishedId })
    if (facebookPublishedId) publishedResults.push({ platform: 'facebook', id: facebookPublishedId })

    res.status(201).json({
      id: Date.now(),
      content,
      platforms,
      publishedResults,
      scheduledAt,
      mediaFiles,
      status: status || 'draft',
      createdAt: new Date()
    })
  } else {
    res.status(405).end()
  }
}
