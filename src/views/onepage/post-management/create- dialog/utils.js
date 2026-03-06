import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'

export const getAccountIcon = platform => {
  const normalizedPlatform = platform ? platform.toLowerCase() : ''
  switch (normalizedPlatform) {
    case 'facebook':
      return <FacebookIcon sx={{ fontSize: 14, color: '#1877f2' }} />
    case 'instagram':
    case 'instagram-business':
      return <InstagramIcon sx={{ fontSize: 14, color: '#e4405f' }} />
    case 'linkedin':
      return <LinkedInIcon sx={{ fontSize: 14, color: '#0077b5' }} />
    case 'twitter':
      return <TwitterIcon sx={{ fontSize: 14, color: '#1da1f2' }} />
    default:
      return <InstagramIcon sx={{ fontSize: 14, color: '#e4405f' }} />
  }
}

export const PLATFORM_CAPABILITIES = {
  'instagram-business': ['post', 'reel', 'story'],
  facebook: ['post'],
  linkedin: ['post'],
  twitter: ['post']
}

// Media type consistency validation function
export const validateMediaTypeConsistency = (newFiles, existingFiles) => {
  // If no files, allow anything
  if (newFiles.length === 0) {
    return { isValid: true }
  }

  // Categorize new files by type
  const newImageFiles = newFiles.filter(file => file.type && file.type.startsWith('image/'))
  const newVideoFiles = newFiles.filter(file => file.type && file.type.startsWith('video/'))

  const newOtherFiles = newFiles.filter(
    file => file.type && !file.type.startsWith('image/') && !file.type.startsWith('video/')
  )

  // Don't allow unsupported file types
  if (newOtherFiles.length > 0) {
    return {
      isValid: false,
      message: 'Only image and video files are supported. Please select image or video files only.'
    }
  }

  // Don't allow mixing images and videos in the same upload
  if (newImageFiles.length > 0 && newVideoFiles.length > 0) {
    return {
      isValid: false,
      message: 'You cannot upload images and videos together. Please select either images OR videos, not both.'
    }
  }

  // Restrict to only one video at a time (social media platforms limitation)
  if (newVideoFiles.length > 1) {
    return {
      isValid: false,
      message:
        'You can only upload one video at a time. Most social media platforms do not support multiple videos in a single post.'
    }
  }

  // If there are existing files, check compatibility
  if (existingFiles.length > 0) {
    const existingImageFiles = existingFiles.filter(file => {
      const fileType = file.type || (file.file && file.file.type)

      return fileType && fileType.startsWith('image/')
    })

    const existingVideoFiles = existingFiles.filter(file => {
      const fileType = file.type || (file.file && file.file.type)

      return fileType && fileType.startsWith('video/')
    })

    const hasExistingImages = existingImageFiles.length > 0
    const hasExistingVideos = existingVideoFiles.length > 0
    const hasNewImages = newImageFiles.length > 0
    const hasNewVideos = newVideoFiles.length > 0

    // If user has images and tries to add videos
    if (hasExistingImages && hasNewVideos) {
      return {
        isValid: false,
        message: `You already have ${existingImageFiles.length} image(s) uploaded. Remove all images first to upload videos.`
      }
    }

    // If user has videos and tries to add images
    if (hasExistingVideos && hasNewImages) {
      return {
        isValid: false,
        message: `You already have a video uploaded. Remove the video first to upload images.`
      }
    }

    // If user already has a video and tries to add another video
    if (hasExistingVideos && hasNewVideos) {
      return {
        isValid: false,
        message: 'You can only upload one video per post. Remove the existing video to upload a different one.'
      }
    }

    // Allow adding more images when images already exist
    if (hasExistingImages && hasNewImages) {
      return { isValid: true }
    }
  }

  return { isValid: true }
}

// Media validation function
export const validateMediaFiles = async (files, postType, selectedAccounts) => {
  // Handle both File objects and local media file objects
  const actualFiles = files.map(file => file.file || file)

  // Check if Instagram is selected and post type is reel
  const hasInstagramReel = selectedAccounts.some(
    account => account.provider === 'instagram-business' && postType === 'reel'
  )

  if (hasInstagramReel) {
    // For Instagram Reels, only allow video files
    const nonVideoFiles = actualFiles.filter(file => !file.type.startsWith('video/'))
    if (nonVideoFiles.length > 0) {
      return {
        isValid: false,
        message: 'Instagram Reels only support video files. Please select video files only.'
      }
    }
  }

  // Check if Instagram Story is selected
  const hasInstagramStory = selectedAccounts.some(
    account => account.provider === 'instagram-business' && postType === 'story'
  )

  if (hasInstagramStory) {
    // For Instagram Stories, allow both images and videos but with size limits
    const oversizedFiles = actualFiles.filter(file => {
      if (file.type.startsWith('video/')) {
        return file.size > 100 * 1024 * 1024 // 100MB for videos
      } else {
        return file.size > 30 * 1024 * 1024 // 30MB for images
      }
    })

    if (oversizedFiles.length > 0) {
      return {
        isValid: false,
        message: 'Instagram Stories: Videos must be under 100MB and images under 30MB.'
      }
    }
  }

  // Validate image aspect ratios
  const aspectRatioValidation = await validateImageAspectRatios(files, postType, selectedAccounts)
  if (!aspectRatioValidation.isValid) {
    return aspectRatioValidation
  }

  return { isValid: true, invalidImages: [] }
}

// Image aspect ratio validation
export const validateImageAspectRatios = async (files, postType, selectedAccounts) => {
  // Handle both File objects and local media file objects
  const imageFiles = files.filter(file => {
    const actualFile = file.file || file

    return actualFile.type && actualFile.type.startsWith('image/')
  })

  if (imageFiles.length === 0) return { isValid: true, invalidImages: [] }

  // Define aspect ratio requirements for different platforms and post types
  const aspectRatioRequirements = {
    'instagram-business': {
      post: {
        min: 0.8, // 4:5 portrait
        max: 1.91, // 1.91:1 landscape
        recommended: [1, 0.8, 1.25], // Square, 4:5, 5:4
        name: 'Instagram Post'
      },
      story: {
        min: 0.5, // Very tall
        max: 2.0, // Very wide
        recommended: [0.5625], // 9:16 (story format)
        name: 'Instagram Story'
      },
      reel: {
        min: 0.5, // Very tall
        max: 2.0, // Very wide
        recommended: [0.5625], // 9:16 (vertical video format)
        name: 'Instagram Reel'
      }
    },
    facebook: {
      post: {
        min: 0.8,
        max: 1.91,
        recommended: [1, 1.25, 1.91], // Square, 5:4, 1.91:1
        name: 'Facebook Post'
      }
    },
    linkedin: {
      post: {
        min: 0.5,
        max: 2.0,
        recommended: [1, 1.25], // Square, 5:4
        name: 'LinkedIn Post'
      }
    },
    twitter: {
      post: {
        min: 0.5,
        max: 2.0,
        recommended: [1, 1.78], // Square, 16:9
        name: 'Twitter Post'
      }
    }
  }

  const invalidImages = []
  let hasInvalidImages = false

  // Check each selected account's requirements
  for (const account of selectedAccounts) {
    const platformRequirements = aspectRatioRequirements[account.provider]
    if (!platformRequirements || !platformRequirements[postType]) continue

    const requirements = platformRequirements[postType]

    // Validate each image file
    for (let i = 0; i < imageFiles.length; i++) {
      const fileItem = imageFiles[i]
      const actualFile = fileItem.file || fileItem

      try {
        const aspectRatio = await getImageAspectRatio(fileItem)

        if (aspectRatio < requirements.min || aspectRatio > requirements.max) {
          const invalidImage = {
            index: files.indexOf(fileItem),
            file: actualFile,
            aspectRatio: aspectRatio,
            platform: requirements.name,
            minRatio: requirements.min,
            maxRatio: requirements.max,
            message: `${requirements.name}: Image aspect ratio ${formatAspectRatio(
              aspectRatio
            )} is not supported. Allowed range: ${formatAspectRatio(requirements.min)} to ${formatAspectRatio(
              requirements.max
            )}`
          }

          // Check if this image is already in the invalid list
          const existingIndex = invalidImages.findIndex(img => img.index === invalidImage.index)
          if (existingIndex === -1) {
            invalidImages.push(invalidImage)
          }
          hasInvalidImages = true
        }
      } catch (error) {
        // Could not validate aspect ratio for file - skip validation
      }
    }
  }

  return {
    isValid: !hasInvalidImages,
    invalidImages: invalidImages,
    message: hasInvalidImages
      ? `${invalidImages.length} image(s) have invalid aspect ratios for selected platforms`
      : null
  }
}

// Helper function to get image aspect ratio
export const getImageAspectRatio = file => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const aspectRatio = img.width / img.height
      resolve(aspectRatio)
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    // Handle different file formats
    if (file.previewUrl) {
      // Local media file object
      img.src = file.previewUrl
    } else if (file.url || file.fileUrl) {
      // Uploaded file object
      img.src = file.url || file.fileUrl
    } else if (file instanceof File) {
      // Raw File object
      img.src = URL.createObjectURL(file)
    } else {
      reject(new Error('Invalid file format'))
    }
  })
}

// Helper function to format aspect ratio for display
export const formatAspectRatio = ratio => {
  if (ratio === 1) return '1:1 (Square)'
  if (ratio === 0.8) return '4:5 (Portrait)'
  if (ratio === 1.25) return '5:4 (Landscape)'
  if (ratio === 1.91) return '1.91:1 (Landscape)'
  if (ratio === 0.5625) return '9:16 (Vertical)'
  if (ratio === 1.78) return '16:9 (Horizontal)'

  // For other ratios, show decimal with interpretation
  if (ratio < 1) {
    return `${ratio.toFixed(2)}:1 (Portrait)`
  } else {
    return `${ratio.toFixed(2)}:1 (Landscape)`
  }
}

// Helper function to create a cropped image
export const getCroppedImg = (image, crop, fileName) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const pixelRatio = window.devicePixelRatio

  canvas.width = crop.width * pixelRatio * scaleX
  canvas.height = crop.height * pixelRatio * scaleY

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  ctx.imageSmoothingQuality = 'high'

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'))

          return
        }
        blob.name = fileName
        resolve(blob)
      },
      'image/jpeg',
      0.95
    )
  })
}

// Image Crop Dialog Component
// Get whether multiple file selection should be allowed
export const getAllowMultiple = (selectedAccounts, postType, existingFiles = []) => {
  const hasInstagramReel = selectedAccounts.some(
    account => account.provider === 'instagram-business' && postType === 'reel'
  )

  // Instagram Reels only allow one video
  if (hasInstagramReel) {
    return false
  }

  // If we already have a video, don't allow multiple selection
  if (existingFiles.length > 0) {
    const hasVideos = existingFiles.some(file => {
      const fileType = file.type || (file.file && file.file.type)

      return fileType && fileType.startsWith('video/')
    })

    if (hasVideos) {
      return false // Already have a video, can't add more
    }
  }

  // For images, allow multiple selection
  return true
}

export const getAcceptedFileTypes = (selectedAccounts, postType, existingFiles = []) => {
  const hasInstagramReel = selectedAccounts.some(
    account => account.provider === 'instagram-business' && postType === 'reel'
  )

  if (hasInstagramReel) {
    return 'video/*' // Only videos for Instagram Reels
  }

  // If we already have files, restrict to the same type
  if (existingFiles.length > 0) {
    const hasImages = existingFiles.some(file => {
      const fileType = file.type || (file.file && file.file.type)

      return fileType && fileType.startsWith('image/')
    })

    const hasVideos = existingFiles.some(file => {
      const fileType = file.type || (file.file && file.file.type)

      return fileType && fileType.startsWith('video/')
    })

    if (hasImages) return 'image/*'
    if (hasVideos) return 'video/*'
  }

  return 'image/*,video/*' // Default: both images and videos
}

// Get file type hint text
export const getFileTypeHint = (selectedAccounts, postType, existingFiles = []) => {
  const hasInstagramReel = selectedAccounts.some(
    account => account.provider === 'instagram-business' && postType === 'reel'
  )

  if (hasInstagramReel) {
    return 'Videos only (Instagram Reels)'
  }

  // If we already have files, show restriction
  if (existingFiles.length > 0) {
    const imageFiles = existingFiles.filter(file => {
      const fileType = file.type || (file.file && file.file.type)

      return fileType && fileType.startsWith('image/')
    })

    const videoFiles = existingFiles.filter(file => {
      const fileType = file.type || (file.file && file.file.type)

      return fileType && fileType.startsWith('video/')
    })

    if (imageFiles.length > 0 && videoFiles.length === 0) {
      return `Add more images (${imageFiles.length} selected) or clear all to upload a video`
    }
    if (videoFiles.length > 0 && imageFiles.length === 0) {
      return `1 video selected - remove to upload images or different video`
    }
    if (imageFiles.length > 0 && videoFiles.length > 0) {
      return 'Mixed media detected - please keep only one type'
    }
  }

  return 'Drag & drop or'
}

// Get aspect ratio requirements text for UI hints
export const getAspectRatioHint = (selectedAccounts, postType) => {
  if (selectedAccounts.length === 0) return ''

  const hints = []

  selectedAccounts.forEach(account => {
    if (account.provider === 'instagram-business') {
      if (postType === 'post') {
        hints.push('Instagram: 4:5 to 1.91:1 ratio')
      } else if (postType === 'story') {
        hints.push('Instagram Story: 9:16 recommended')
      }
    } else if (account.provider === 'facebook' && postType === 'post') {
      hints.push('Facebook: Square to 1.91:1 ratio')
    } else if (account.provider === 'linkedin' && postType === 'post') {
      hints.push('LinkedIn: Square or 5:4 recommended')
    } else if (account.provider === 'twitter' && postType === 'post') {
      hints.push('Twitter: Square or 16:9 recommended')
    }
  })

  return hints.length > 0 ? hints.join(' • ') : ''
}
