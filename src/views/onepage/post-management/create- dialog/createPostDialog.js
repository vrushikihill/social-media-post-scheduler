import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CloseIcon from '@mui/icons-material/Close'
import CropIcon from '@mui/icons-material/Crop'
import FacebookIcon from '@mui/icons-material/Facebook'
import ImageIcon from '@mui/icons-material/Image'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import ScheduleIcon from '@mui/icons-material/Schedule'
import TwitterIcon from '@mui/icons-material/Twitter'
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useDispatch } from 'react-redux'
import { uploadFiles } from 'src/store/common'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import api from 'utils/api'
import FacebookPost from '../components/FacebookPost'
import FacebookReel from '../components/FacebookReel'
import FacebookStory from '../components/FacebookStory'
import InstagramPost from '../components/InstagramPost'
import InstagramReel from '../components/InstagramReel'
import InstagramStory from '../components/InstagramStory'
import LinkedInPost from '../components/LinkedInPost'
import TwitterPost from '../components/TwitterPost'

const getAccountIcon = platform => {
  switch (platform) {
    case 'facebook':
      return <FacebookIcon sx={{ fontSize: 14 }} />
    case 'instagram-business':
      return <InstagramIcon sx={{ fontSize: 14 }} />
    case 'linkedin':
      return <LinkedInIcon sx={{ fontSize: 14 }} />
    case 'twitter':
      return <TwitterIcon sx={{ fontSize: 14 }} />
    default:
      return <InstagramIcon sx={{ fontSize: 14 }} />
  }
}

// Platform capabilities configuration
const PLATFORM_CAPABILITIES = {
  'instagram-business': ['post', 'story', 'reel'],
  facebook: ['post'],
  linkedin: ['post'],
  twitter: ['post']
}

// Media type consistency validation function
const validateMediaTypeConsistency = (newFiles, existingFiles) => {
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
const validateMediaFiles = async (files, postType, selectedAccounts) => {
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
const validateImageAspectRatios = async (files, postType, selectedAccounts) => {
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
const getImageAspectRatio = file => {
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
const formatAspectRatio = ratio => {
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
const getCroppedImg = (image, crop, fileName) => {
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
const ImageCropDialog = ({ open, onClose, imageFile, onCropComplete }) => {
  const [crop, setCrop] = useState({ unit: '%', width: 90, height: 90, x: 5, y: 5 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const imgRef = useRef(null)
  const [imageSrc, setImageSrc] = useState('')
  const [currentAspect, setCurrentAspect] = useState(undefined)

  useEffect(() => {
    if (imageFile && open) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || ''))
      reader.readAsDataURL(imageFile)

      // Reset crop when opening
      setCrop({ unit: '%', width: 90, height: 90, x: 5, y: 5 })
      setCurrentAspect(undefined)
    }
  }, [imageFile, open])

  const onImageLoad = useCallback(img => {
    imgRef.current = img.currentTarget

    // Set initial crop based on image dimensions
    const { width, height } = img.currentTarget

    const initialCrop = {
      unit: 'px',
      width: width * 0.9,
      height: height * 0.9,
      x: width * 0.05,
      y: height * 0.05
    }

    setCrop(initialCrop)

    // Auto-set completed crop for immediate availability
    setCompletedCrop(initialCrop)
  }, [])

  const handleCropComplete = async () => {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) {
      toast.error('Please wait for the image to load or adjust the crop area')

      return
    }

    try {
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop, imageFile.name)

      const croppedFile = new File([croppedImageBlob], imageFile.name, {
        type: imageFile.type,
        lastModified: Date.now()
      })

      // Create preview URL for the cropped image
      const previewUrl = URL.createObjectURL(croppedFile)

      onCropComplete({
        file: croppedFile,
        originalFile: imageFile,
        previewUrl: previewUrl
      })
      onClose()
    } catch (error) {
      toast.error('Failed to crop image')
    }
  }

  const handleAspectRatioChange = aspectRatio => {
    setCurrentAspect(aspectRatio)

    if (!imgRef.current) return

    const { width: imgWidth, height: imgHeight } = imgRef.current
    let newCrop

    if (aspectRatio === undefined) {
      // Free crop - reset to 90% of image
      newCrop = {
        unit: 'px',
        width: imgWidth * 0.9,
        height: imgHeight * 0.9,
        x: imgWidth * 0.05,
        y: imgHeight * 0.05
      }
    } else {
      // Calculate crop dimensions based on aspect ratio
      let cropWidth, cropHeight

      if (aspectRatio >= 1) {
        // Landscape or square - fit to width
        cropWidth = Math.min(imgWidth * 0.9, imgHeight * 0.9 * aspectRatio)
        cropHeight = cropWidth / aspectRatio
      } else {
        // Portrait - fit to height
        cropHeight = Math.min(imgHeight * 0.9, (imgWidth * 0.9) / aspectRatio)
        cropWidth = cropHeight * aspectRatio
      }

      // Center the crop
      const x = (imgWidth - cropWidth) / 2
      const y = (imgHeight - cropHeight) / 2

      newCrop = {
        unit: 'px',
        width: cropWidth,
        height: cropHeight,
        x: Math.max(0, x),
        y: Math.max(0, y)
      }
    }

    setCrop(newCrop)

    // Auto-set completed crop so it's immediately available
    setCompletedCrop(newCrop)
  }

  const getAspectRatioPresets = () => [
    { label: 'Free', value: undefined },
    { label: 'Square (1:1)', value: 1 },
    { label: 'Portrait (4:5)', value: 4 / 5 },
    { label: 'Landscape (5:4)', value: 5 / 4 },
    { label: 'Story (9:16)', value: 9 / 16 },
    { label: 'Wide (16:9)', value: 16 / 9 }
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6'>Crop Image</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
            Aspect Ratio Presets:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {getAspectRatioPresets().map(preset => (
              <Button
                key={preset.label}
                size='small'
                variant={currentAspect === preset.value ? 'contained' : 'outlined'}
                onClick={() => handleAspectRatioChange(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </Box>
        </Box>

        {imageSrc && (
          <Box sx={{ mb: 2, maxHeight: '400px', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            <ReactCrop
              crop={crop}
              onChange={newCrop => setCrop(newCrop)}
              onComplete={c => setCompletedCrop(c)}
              aspect={currentAspect}
              keepSelection
              ruleOfThirds
            >
              <img
                ref={imgRef}
                alt='Crop me'
                src={imageSrc}
                style={{ maxHeight: '400px', width: 'auto' }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant='contained' onClick={handleCropComplete}>
            Apply Crop
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

// Get whether multiple file selection should be allowed
const getAllowMultiple = (selectedAccounts, postType, existingFiles = []) => {
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

const getAcceptedFileTypes = (selectedAccounts, postType, existingFiles = []) => {
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
const getFileTypeHint = (selectedAccounts, postType, existingFiles = []) => {
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
const getAspectRatioHint = (selectedAccounts, postType) => {
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

export default function CreatePostDialog({ open, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [invalidImages, setInvalidImages] = useState([]) // Track images with invalid aspect ratios
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [currentCropImage, setCurrentCropImage] = useState(null)
  const [localMediaFiles, setLocalMediaFiles] = useState([]) // Store files locally before upload

  const { control, watch, setValue, handleSubmit, reset } = useForm({
    defaultValues: {
      showPreview: false,
      selectedAccountIds: [],
      postType: 'post',
      content: '',
      mediaFiles: [], // This will be populated only when posting
      accounts: [],
      uploadingMedia: false,
      isScheduled: false,
      scheduledAt: null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  })

  const fileInputRef = useRef(null)
  const dispatch = useDispatch()

  // Watch form values
  const showPreview = watch('showPreview')
  const selectedAccountIds = watch('selectedAccountIds')
  const accounts = watch('accounts')
  const uploadingMedia = watch('uploadingMedia')
  const postType = watch('postType')
  const isScheduled = watch('isScheduled')
  const scheduledAt = watch('scheduledAt')

  // Get selected accounts details
  const selectedAccounts = useMemo(() => {
    return accounts.filter(acc => selectedAccountIds.includes(acc.id))
  }, [accounts, selectedAccountIds])

  // Calculate available post types based on selected accounts
  const availablePostTypes = useMemo(() => {
    if (selectedAccounts.length === 0) {
      return []
    }

    const allPostTypes = selectedAccounts.reduce((types, account) => {
      const capabilities = PLATFORM_CAPABILITIES[account.provider] || []
      capabilities.forEach(type => {
        if (!types.includes(type)) {
          types.push(type)
        }
      })

      return types
    }, [])

    const commonPostTypes = allPostTypes.filter(type => {
      return selectedAccounts.every(account => {
        const capabilities = PLATFORM_CAPABILITIES[account.provider] || []

        return capabilities.includes(type)
      })
    })

    return commonPostTypes
  }, [selectedAccounts])

  // Auto-adjust post type when it's not available
  useEffect(() => {
    if (availablePostTypes.length > 0 && !availablePostTypes.includes(postType)) {
      setValue('postType', availablePostTypes[0])
    }
  }, [availablePostTypes, postType, setValue])

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await api.get('/v1/auth-social-media/connected')
        setValue('accounts', response.data.data)
      } catch (error) {
        toast.error('Failed to load connected accounts')
      }
    }

    if (open) {
      loadAccounts()
    } else {
      reset()
      setLocalMediaFiles([])
      setInvalidImages([])
    }
  }, [open, reset, setValue])

  // Validate existing media files when post type or selected accounts change
  useEffect(() => {
    const validateExistingMedia = async () => {
      if (localMediaFiles.length > 0 && selectedAccounts.length > 0) {
        const validationResult = await validateMediaFiles(localMediaFiles, postType, selectedAccounts)
        if (!validationResult.isValid && validationResult.invalidImages) {
          setInvalidImages(validationResult.invalidImages)
        } else {
          setInvalidImages([])
        }
      } else {
        setInvalidImages([])
      }
    }

    validateExistingMedia()
  }, [postType, selectedAccounts, localMediaFiles])

  const handleToggleAccount = id => {
    const current = selectedAccountIds
    if (current.includes(id)) {
      setValue(
        'selectedAccountIds',
        current.filter(aid => aid !== id)
      )
    } else {
      setValue('selectedAccountIds', [...current, id])
    }
  }

  const handleFileSelect = async event => {
    const files = Array.from(event.target.files)
    if (!files.length) return

    event.target.value = ''

    // Validate media type consistency
    const validationResult = validateMediaTypeConsistency(files, localMediaFiles)
    if (!validationResult.isValid) {
      toast.error(validationResult.message)

      return
    }

    // Add files to local storage with preview URLs
    const newLocalFiles = files.map(file => ({
      file: file,
      previewUrl: URL.createObjectURL(file),
      type: file.type,
      size: file.size,
      name: file.name,
      isLocal: true // Flag to indicate this is a local file
    }))

    setLocalMediaFiles(prev => [...prev, ...newLocalFiles])
    toast.success(`${files.length} file(s) added. They will be uploaded when you post.`)
  }

  const handleRemoveMedia = index => {
    const fileToRemove = localMediaFiles[index]
    if (fileToRemove?.previewUrl) {
      URL.revokeObjectURL(fileToRemove.previewUrl)
    }

    setLocalMediaFiles(prev => prev.filter((_, i) => i !== index))

    // Remove from invalid images list and adjust indices
    setInvalidImages(prev => {
      const filtered = prev.filter(invalid => invalid.index !== index)

      return filtered.map(invalid => ({
        ...invalid,
        index: invalid.index > index ? invalid.index - 1 : invalid.index
      }))
    })
  }

  const handleCropImage = index => {
    const mediaFile = localMediaFiles[index]
    if (mediaFile && mediaFile.file && mediaFile.type.startsWith('image/')) {
      setCurrentCropImage({ ...mediaFile, index })
      setCropDialogOpen(true)
    }
  }

  const handleClearAllMedia = () => {
    // Clean up preview URLs
    localMediaFiles.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl)
      }
    })

    setLocalMediaFiles([])
    setInvalidImages([])
    toast.success('All media files cleared')
  }

  const handleCropComplete = ({ file: croppedFile, previewUrl }) => {
    if (currentCropImage) {
      const updatedFiles = [...localMediaFiles]

      // Revoke old preview URL
      if (updatedFiles[currentCropImage.index]?.previewUrl) {
        URL.revokeObjectURL(updatedFiles[currentCropImage.index].previewUrl)
      }

      updatedFiles[currentCropImage.index] = {
        file: croppedFile,
        previewUrl: previewUrl,
        type: croppedFile.type,
        size: croppedFile.size,
        name: croppedFile.name,
        isLocal: true,
        isCropped: true
      }

      setLocalMediaFiles(updatedFiles)
      setCurrentCropImage(null)
      toast.success('Image cropped successfully')
    }
  }

  const handleUnselectAll = () => {
    setValue('selectedAccountIds', [])
  }

  const handleSelectAll = () => {
    setValue(
      'selectedAccountIds',
      accounts.map(acc => acc.id)
    )
  }

  const uploadLocalFiles = async () => {
    if (localMediaFiles.length === 0) return []

    setValue('uploadingMedia', true)

    try {
      const filesToUpload = localMediaFiles.map(item => item.file)
      const uploadResult = await dispatch(uploadFiles(filesToUpload))

      return uploadResult.payload.data.files
    } catch (error) {
      throw new Error('Failed to upload media files')
    } finally {
      setValue('uploadingMedia', false)
    }
  }

  const onSubmit = async data => {
    // Validation
    if (data.selectedAccountIds.length === 0) {
      toast.error('Please select at least one account')

      return
    }

    if (!data.content?.trim() && localMediaFiles.length === 0) {
      toast.error('Please add content or media')

      return
    }

    // Validate media files for selected post type and accounts
    if (localMediaFiles.length > 0) {
      const validationResult = await validateMediaFiles(localMediaFiles, data.postType, selectedAccounts)
      if (!validationResult.isValid) {
        toast.error(validationResult.message)

        return
      }
    }

    // Validate scheduled time
    if (data.isScheduled) {
      if (!data.scheduledAt) {
        toast.error('Please select a scheduled time')

        return
      }

      const scheduledDate = dayjs(data.scheduledAt)
      if (scheduledDate.isBefore(dayjs())) {
        toast.error('Scheduled time must be in the future')

        return
      }
    }

    // Check if current post type is supported by all selected accounts
    const unsupportedAccounts = selectedAccounts.filter(account => {
      const capabilities = PLATFORM_CAPABILITIES[account.provider] || []

      return !capabilities.includes(data.postType)
    })

    if (unsupportedAccounts.length > 0) {
      toast.error(`${data.postType} is not supported for: ${unsupportedAccounts.map(a => a.provider).join(', ')}`)

      return
    }

    setIsSubmitting(true)

    try {
      // Upload files first if there are any
      let uploadedFiles = []
      if (localMediaFiles.length > 0) {
        uploadedFiles = await uploadLocalFiles()
      }

      const payload = {
        selectedAccountIds: data.selectedAccountIds,
        postType: data.postType.toUpperCase(),
        content: data.content,
        mediaFiles: uploadedFiles.map((file, index) => ({
          url: file.url || file.fileUrl,
          fileUrl: file.url || file.fileUrl,
          type: file.type && file.type.startsWith('video') ? 'VIDEO' : 'IMAGE',
          size: file.size,
          mimeType: file.mimeType || file.type,
          order: index
        }))
      }

      let response

      if (data.isScheduled) {
        // Schedule post
        response = await api.post('/v1/social-media-post/schedule', {
          ...payload,
          scheduledAt: dayjs(data.scheduledAt).toISOString(),
          timezone: data.timezone
        })

        toast.success('Post scheduled successfully!')
      } else {
        // Post immediately
        response = await api.post('/v1/social-media-post/post', payload)

        const result = response.data.data

        // Show results
        if (result.summary.successful > 0) {
          toast.success(
            `Successfully posted to ${result.summary.successful} account(s)${
              result.summary.failed > 0 ? `, ${result.summary.failed} failed` : ''
            }`
          )
        }

        // Show individual errors if any
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(error => {
            toast.error(`${error.provider}: ${error.error}`)
          })
        }
      }

      // Clean up preview URLs
      localMediaFiles.forEach(file => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl)
        }
      })

      // Close dialog if successful
      if (!data.isScheduled && response.data.data?.summary.failed === 0) {
        setTimeout(() => {
          onClose()
          reset()
          setLocalMediaFiles([])
        }, 1000)
      } else if (data.isScheduled) {
        setTimeout(() => {
          onClose()
          reset()
          setLocalMediaFiles([])
        }, 1000)
      }
    } catch (error) {
      toast.error(error.message || error.response?.data?.message || 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth={showPreview ? 'lg' : 'md'} fullWidth>
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '85vh' }}>
          {/* Header - Fixed */}
          <Header
            showPreview={showPreview}
            setShowPreview={value => setValue('showPreview', value)}
            onClose={onClose}
          />

          {/* Content - Scrollable */}
          <Box sx={{ display: 'flex', gap: 5, alignItems: 'stretch', flex: 1, overflow: 'hidden' }}>
            {/* Left Side - Form */}
            <PostBox
              control={control}
              accounts={accounts}
              handleToggleAccount={handleToggleAccount}
              handleUnselectAll={handleUnselectAll}
              handleSelectAll={handleSelectAll}
              localMediaFiles={localMediaFiles}
              selectedAccountIds={selectedAccountIds}
              handleRemoveMedia={handleRemoveMedia}
              handleCropImage={handleCropImage}
              handleClearAllMedia={handleClearAllMedia}
              fileInputRef={fileInputRef}
              uploadingMedia={uploadingMedia}
              handleFileSelect={handleFileSelect}
              availablePostTypes={availablePostTypes}
              selectedAccounts={selectedAccounts}
              isScheduled={isScheduled}
              scheduledAt={scheduledAt}
              setValue={setValue}
              postType={postType}
              invalidImages={invalidImages}
            />
            {/* Right Side - Preview */}
            <Preview
              showPreview={showPreview}
              accounts={accounts}
              selectedAccountIds={selectedAccountIds}
              control={control}
              localMediaFiles={localMediaFiles}
            />
          </Box>

          {/* Footer - Fixed */}
          <Footer
            onSubmit={handleSubmit(onSubmit)}
            disabled={selectedAccountIds.length === 0 || invalidImages.length > 0}
            isSubmitting={isSubmitting}
            isScheduled={isScheduled}
            invalidImages={invalidImages}
          />
        </DialogContent>
      </Dialog>

      {/* Image Crop Dialog */}
      <ImageCropDialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        imageFile={currentCropImage?.file}
        onCropComplete={handleCropComplete}
      />
    </>
  )
}

const Header = ({ showPreview, setShowPreview, onClose }) => {
  return (
    <Box
      sx={{
        p: 2,
        pb: 2,
        borderBottom: theme => `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'background.paper',
        flexShrink: 0
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant='h6' fontWeight={600} color='text.primary'>
          Create Post
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Button size='small' variant='outlined' startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}>
          AI Assistant
        </Button>
        <Button
          size='small'
          variant={showPreview ? 'contained' : 'text'}
          color={showPreview ? 'primary' : 'inherit'}
          onClick={() => setShowPreview(!showPreview)}
          sx={{ color: !showPreview ? 'text.secondary' : undefined }}
        >
          Preview
        </Button>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

const Footer = ({ onSubmit, disabled, isSubmitting, isScheduled, invalidImages }) => {
  return (
    <Box
      sx={{
        borderTop: theme => `1px solid ${theme.palette.divider}`,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        bgcolor: 'background.paper',
        flexShrink: 0
      }}
    >
      {/* Invalid Images Warning */}
      {invalidImages && invalidImages.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'warning.main' }} />
          <Typography variant='caption' color='warning.main'>
            {invalidImages.length} image(s) have invalid aspect ratios for the selected platforms. Please upload images
            with correct aspect ratios.
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant='contained'
          onClick={onSubmit}
          disabled={disabled || isSubmitting}
          startIcon={isSubmitting && <CircularProgress size={16} color='inherit' />}
        >
          {isSubmitting ? (isScheduled ? 'Scheduling...' : 'Posting...') : isScheduled ? 'Schedule Post' : 'Post Now'}
        </Button>
      </Box>
    </Box>
  )
}

const PostBox = ({
  control,
  accounts,
  handleToggleAccount,
  handleUnselectAll,
  handleSelectAll,
  selectedAccountIds,
  localMediaFiles,
  handleRemoveMedia,
  handleCropImage,
  handleClearAllMedia,
  fileInputRef,
  uploadingMedia,
  handleFileSelect,
  availablePostTypes,
  selectedAccounts,
  isScheduled,
  postType,
  invalidImages
}) => {
  const getPostTypeLabel = type => {
    switch (type) {
      case 'post':
        return 'Post'
      case 'reel':
        return 'Reel'
      case 'story':
        return 'Story'
      default:
        return type
    }
  }

  const getDisabledTooltip = type => {
    if (selectedAccounts.length === 0) return 'Select an account first'

    const unsupportedPlatforms = selectedAccounts
      .filter(account => {
        const capabilities = PLATFORM_CAPABILITIES[account.provider] || []

        return !capabilities.includes(type)
      })
      .map(account => account.provider)

    if (unsupportedPlatforms.length > 0) {
      return `${getPostTypeLabel(type)} not supported for: ${unsupportedPlatforms.join(', ')}`
    }

    return ''
  }

  return (
    <Box
      sx={{
        flex: 1.2,
        py: 4,
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {/* Account Selection */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='body2' fontWeight={600} color='text.primary'>
          Select Accounts
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {selectedAccountIds.length > 0 && (
            <Button size='small' sx={{ textTransform: 'none', color: 'text.secondary' }} onClick={handleUnselectAll}>
              Unselect All
            </Button>
          )}
          {selectedAccountIds.length < accounts.length && accounts.length > 0 && (
            <Button size='small' sx={{ textTransform: 'none', color: 'primary.main' }} onClick={handleSelectAll}>
              Select All
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, overflowX: 'auto', pb: 1, minHeight: 50 }}>
        {accounts.map(account => (
          <Tooltip key={account.id} title={`${account.metadata?.name || account.provider} - ${account.provider}`} arrow>
            <Box
              onClick={() => handleToggleAccount(account.id)}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                opacity: selectedAccountIds.includes(account.id) ? 1 : 0.5,
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.8 }
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  border: selectedAccountIds.includes(account.id)
                    ? theme => `2px solid ${theme.palette.primary.main}`
                    : 'none'
                }}
                src={account.metadata.picture || account.metadata.profilePicture}
              >
                {getAccountIcon(account.provider)}
              </Avatar>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: -2,
                  bgcolor: 'background.paper',
                  borderRadius: '50%',
                  p: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 16,
                  height: 16
                }}
              >
                {getAccountIcon(account.provider)}
              </Box>
            </Box>
          </Tooltip>
        ))}

        {accounts.length === 0 && (
          <Typography variant='caption' color='text.secondary'>
            No connected accounts found.
          </Typography>
        )}
      </Box>

      {/* Selected Accounts Info */}
      {selectedAccounts.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography variant='caption' color='text.secondary'>
            Selected ({selectedAccounts.length}): {selectedAccounts.map(acc => acc.provider).join(', ')}
          </Typography>
        </Box>
      )}

      {/* Post Type */}
      <Controller
        name='postType'
        control={control}
        render={({ field }) => (
          <RadioGroup row {...field} sx={{ gap: 2 }}>
            {['post', 'reel', 'story'].map(type => {
              const isAvailable = availablePostTypes.includes(type)
              const tooltip = getDisabledTooltip(type)

              return (
                <Tooltip key={type} title={!isAvailable ? tooltip : ''} arrow>
                  <FormControlLabel
                    value={type}
                    disabled={!isAvailable}
                    control={
                      <Radio
                        sx={{
                          color: 'divider',
                          '&.Mui-checked': {
                            color: 'primary.main'
                          },
                          '&.Mui-disabled': {
                            color: 'action.disabled'
                          }
                        }}
                      />
                    }
                    label={
                      <Typography
                        fontSize={14}
                        color={
                          isAvailable ? (field.value === type ? 'text.primary' : 'text.secondary') : 'action.disabled'
                        }
                      >
                        {getPostTypeLabel(type)}
                      </Typography>
                    }
                  />
                </Tooltip>
              )
            })}
          </RadioGroup>
        )}
      />

      {/* Schedule Toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: 'action.hover',
          mb: 1
        }}
      >
        <ScheduleIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant='body2' fontWeight={600} color='text.primary'>
            Schedule for later
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            Post at a specific date and time
          </Typography>
        </Box>
        <Controller
          name='isScheduled'
          control={control}
          render={({ field }) => <Switch {...field} checked={field.value} disabled={selectedAccountIds.length === 0} />}
        />
      </Box>

      {/* DateTime Picker */}
      {isScheduled && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name='scheduledAt'
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                label='Schedule Date & Time'
                value={field.value ? dayjs(field.value) : null}
                onChange={newValue => field.onChange(newValue?.toDate())}
                minDateTime={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: !field.value && isScheduled,
                    helperText: !field.value && isScheduled ? 'Please select a date and time' : '',
                    sx: { mb: 2 }
                  }
                }}
              />
            )}
          />
        </LocalizationProvider>
      )}

      {/* Content Field */}
      <Controller
        name='content'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            multiline
            rows={8}
            disabled={selectedAccountIds.length === 0}
            placeholder={
              selectedAccountIds.length === 0
                ? 'Select an account to start writing...'
                : 'What would you like to share?'
            }
            fullWidth
            variant='outlined'
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: 14,
                mb: 2,
                bgcolor: selectedAccountIds.length === 0 ? 'action.hover' : 'background.paper',
                '& fieldset': {
                  borderColor: 'divider'
                },
                '&:hover fieldset': {
                  borderColor: 'text.secondary'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main'
                }
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
                opacity: 1
              }
            }}
          />
        )}
      />

      {/* Media Upload */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Media Files and Clear Button */}
        {localMediaFiles.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='body2' fontWeight={600} color='text.primary'>
              Media Files ({localMediaFiles.length})
            </Typography>
            <Button
              size='small'
              variant='outlined'
              color='error'
              onClick={handleClearAllMedia}
              sx={{ textTransform: 'none' }}
            >
              Clear All
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {localMediaFiles.map((mediaFile, index) => {
            const isInvalid = invalidImages.some(invalid => invalid.index === index)

            return (
              <Box
                key={index}
                sx={{
                  width: 100,
                  height: 100,
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: theme => `2px solid ${isInvalid ? theme.palette.warning.main : theme.palette.divider}`,
                  boxShadow: isInvalid ? theme => `0 0 8px ${theme.palette.warning.main}40` : 'none'
                }}
              >
                {mediaFile.type && mediaFile.type.startsWith('video') ? (
                  <video src={mediaFile.previewUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img
                    src={mediaFile.previewUrl}
                    alt='media'
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}

                {/* Invalid aspect ratio indicator */}
                {isInvalid && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      left: 4,
                      bgcolor: 'warning.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 12 }} />
                  </Box>
                )}

                {/* Cropped indicator */}
                {mediaFile.isCropped && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'success.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CropIcon sx={{ fontSize: 12 }} />
                  </Box>
                )}

                <Box sx={{ position: 'absolute', bottom: 4, right: 4, display: 'flex', gap: 0.5 }}>
                  {/* Crop button for images */}
                  {mediaFile.type && mediaFile.type.startsWith('image/') && (
                    <IconButton
                      size='small'
                      onClick={() => handleCropImage(index)}
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                        p: 0.5
                      }}
                      title='Crop Image'
                    >
                      <CropIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  )}

                  <IconButton
                    size='small'
                    onClick={() => handleRemoveMedia(index)}
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      ml: 'auto',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                      p: 0.5
                    }}
                    title='Remove'
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              </Box>
            )
          })}

          {(() => {
            // Check if we already have a video - if so, hide the entire add more area
            const hasVideo = localMediaFiles.some(file => {
              const fileType = file.type || (file.file && file.file.type)

              return fileType && fileType.startsWith('video/')
            })

            // Hide add more area if video exists (since only 1 video allowed)
            if (hasVideo) {
              return null
            }

            // Show add more area for images or when no files
            return (
              <Box
                component='label'
                sx={{
                  width: localMediaFiles.length > 0 ? 100 : '100%',
                  height: localMediaFiles.length > 0 ? 100 : 'auto',
                  minHeight: 100,
                  border: theme => `2px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: localMediaFiles.length > 0 ? 1 : 5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  bgcolor: selectedAccountIds.length === 0 ? 'action.hover' : 'action.hover',
                  cursor: selectedAccountIds.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: selectedAccountIds.length === 0 ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: selectedAccountIds.length === 0 ? 'divider' : 'text.secondary',
                    bgcolor: selectedAccountIds.length === 0 ? 'action.hover' : 'action.selected'
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type='file'
                  hidden
                  multiple={getAllowMultiple(selectedAccounts, postType, localMediaFiles)}
                  accept={getAcceptedFileTypes(selectedAccounts, postType, localMediaFiles)}
                  onChange={handleFileSelect}
                  disabled={selectedAccountIds.length === 0}
                />
                {uploadingMedia ? (
                  <Typography fontSize={12} color='text.secondary'>
                    Uploading...
                  </Typography>
                ) : (
                  <>
                    {localMediaFiles.length === 0 ? (
                      <>
                        <ImageIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                        <Typography fontSize={14} color='text.secondary' mb={1}>
                          {selectedAccountIds.length === 0
                            ? 'Select an account first'
                            : (() => {
                                const hint = getFileTypeHint(selectedAccounts, postType, localMediaFiles)
                                const allowMultiple = getAllowMultiple(selectedAccounts, postType, localMediaFiles)

                                if (!allowMultiple && hint.includes('video')) {
                                  return `${hint} (single video only)`
                                }

                                return hint
                              })()}
                        </Typography>
                        <Button
                          size='small'
                          component='span'
                          disabled={selectedAccountIds.length === 0}
                          sx={{ color: 'primary.main', textTransform: 'none', textDecoration: 'underline' }}
                        >
                          select a file
                        </Button>
                      </>
                    ) : (
                      (() => {
                        // Check if we already have a video - if so, hide the add more button
                        const hasVideo = localMediaFiles.some(file => {
                          const fileType = file.type || (file.file && file.file.type)

                          return fileType && fileType.startsWith('video/')
                        })

                        // Hide add more button if video exists (since only 1 video allowed)
                        if (hasVideo) {
                          return null
                        }

                        // Show add more button for images or when no files
                        return (
                          <Box sx={{ textAlign: 'center' }}>
                            <ImageIcon sx={{ fontSize: 24, color: 'text.secondary' }} />
                            <Typography fontSize={10} color='text.secondary'>
                              Add
                            </Typography>
                          </Box>
                        )
                      })()
                    )}
                  </>
                )}
              </Box>
            )
          })()}
        </Box>
      </Box>

      {/* Media Type Restriction Info */}
      {localMediaFiles.length > 0 && (
        <Box
          sx={{
            mt: 1,
            p: 2,
            borderRadius: 1,
            border: theme => `1px solid ${theme.palette.info.main}`
          }}
        >
          <Typography variant='caption' color='info.dark' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoOutlinedIcon sx={{ fontSize: 14 }} />
            {(() => {
              const imageFiles = localMediaFiles.filter(file => {
                const fileType = file.type || (file.file && file.file.type)

                return fileType && fileType.startsWith('image/')
              })

              const videoFiles = localMediaFiles.filter(file => {
                const fileType = file.type || (file.file && file.file.type)

                return fileType && fileType.startsWith('video/')
              })

              if (imageFiles.length > 0 && videoFiles.length === 0) {
                return `${imageFiles.length} image(s) selected. You can add more images or remove all to upload a video instead.`
              } else if (videoFiles.length > 0 && imageFiles.length === 0) {
                return `1 video selected. Only one video allowed per post. Remove to upload images or different video.`
              } else if (imageFiles.length > 0 && videoFiles.length > 0) {
                return `Mixed media detected! Please keep only images OR videos, not both.`
              }

              return `${localMediaFiles.length} file(s) ready. Files will be uploaded when you post.`
            })()}
          </Typography>
        </Box>
      )}

      {/* Aspect Ratio Requirements Hint */}
      {selectedAccounts.length > 0 && getAspectRatioHint(selectedAccounts, postType) && (
        <Box
          sx={{
            mt: 1,
            p: 2,
            borderRadius: 1,
            border: theme => `1px solid ${theme.palette.info.main}`
          }}
        >
          <Typography variant='caption' color='info.dark' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoOutlinedIcon sx={{ fontSize: 14 }} />
            Image requirements: {getAspectRatioHint(selectedAccounts, postType)}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

const Preview = ({ showPreview, accounts, selectedAccountIds, control, localMediaFiles }) => {
  if (!showPreview) {
    return null
  }

  return (
    <Controller
      name='content'
      control={control}
      render={({ field: { value: content } }) => (
        <Controller
          name='postType'
          control={control}
          render={({ field: { value: postType } }) => (
            <Box
              sx={{
                flex: 0.7,
                py: 3,
                pr: 3,
                bgcolor: 'action.hover',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflowY: 'auto',
                overflowX: 'hidden'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 4
                }}
              >
                <Typography variant='h6' fontWeight={600} color='text.primary'>
                  Preview
                </Typography>
                <Tooltip
                  arrow
                  title='This is an approximation of what your posts will look like live. You might see some differences across devices.'
                >
                  <InfoOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </Tooltip>
              </Box>

              {selectedAccountIds.length > 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: 4
                  }}
                >
                  {selectedAccountIds.includes(accounts.find(acc => acc.provider === 'instagram-business')?.id) &&
                    (() => {
                      const account = accounts.find(acc => acc.provider === 'instagram-business')
                      const capabilities = PLATFORM_CAPABILITIES['instagram-business'] || []

                      if (!capabilities.includes(postType)) {
                        return (
                          <Box
                            sx={{
                              p: 2,
                              border: theme => `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              bgcolor: 'background.paper'
                            }}
                          >
                            <Typography variant='body2' color='text.secondary'>
                              Instagram: {postType} not supported
                            </Typography>
                          </Box>
                        )
                      }

                      // Convert local media files to preview format
                      const previewMediaFiles = localMediaFiles.map(file => ({
                        url: file.previewUrl,
                        fileUrl: file.previewUrl,
                        type: file.type,
                        size: file.size
                      }))

                      if (postType === 'post') {
                        return <InstagramPost account={account} mediaFiles={previewMediaFiles} content={content} />
                      } else if (postType === 'story') {
                        return <InstagramStory account={account} mediaFiles={previewMediaFiles} content={content} />
                      } else if (postType === 'reel') {
                        return <InstagramReel account={account} mediaFiles={previewMediaFiles} content={content} />
                      }
                    })()}

                  {selectedAccountIds.includes(accounts.find(acc => acc.provider === 'facebook')?.id) &&
                    (() => {
                      const account = accounts.find(acc => acc.provider === 'facebook')
                      const capabilities = PLATFORM_CAPABILITIES['facebook'] || []

                      if (!capabilities.includes(postType)) {
                        return (
                          <Box
                            sx={{
                              p: 2,
                              border: theme => `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              bgcolor: 'background.paper'
                            }}
                          >
                            <Typography variant='body2' color='text.secondary'>
                              Facebook: {postType} not supported
                            </Typography>
                          </Box>
                        )
                      }

                      // Convert local media files to preview format
                      const previewMediaFiles = localMediaFiles.map(file => ({
                        url: file.previewUrl,
                        fileUrl: file.previewUrl,
                        type: file.type,
                        size: file.size
                      }))

                      if (postType === 'post') {
                        return <FacebookPost account={account} mediaFiles={previewMediaFiles} content={content} />
                      } else if (postType === 'story') {
                        return <FacebookStory account={account} mediaFiles={previewMediaFiles} content={content} />
                      } else if (postType === 'reel') {
                        return <FacebookReel account={account} mediaFiles={previewMediaFiles} content={content} />
                      }
                    })()}

                  {selectedAccountIds.includes(accounts.find(acc => acc.provider === 'linkedin')?.id) &&
                    (() => {
                      const account = accounts.find(acc => acc.provider === 'linkedin')
                      const capabilities = PLATFORM_CAPABILITIES['linkedin'] || []

                      if (!capabilities.includes(postType)) {
                        return (
                          <Box
                            sx={{
                              p: 2,
                              border: theme => `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              bgcolor: 'background.paper'
                            }}
                          >
                            <Typography variant='body2' color='text.secondary'>
                              LinkedIn: {postType} not supported
                            </Typography>
                          </Box>
                        )
                      }

                      // Convert local media files to preview format
                      const previewMediaFiles = localMediaFiles.map(file => ({
                        url: file.previewUrl,
                        fileUrl: file.previewUrl,
                        type: file.type,
                        size: file.size
                      }))

                      return <LinkedInPost account={account} mediaFiles={previewMediaFiles} content={content} />
                    })()}

                  {selectedAccountIds.includes(accounts.find(acc => acc.provider === 'twitter')?.id) &&
                    (() => {
                      const account = accounts.find(acc => acc.provider === 'twitter')
                      const capabilities = PLATFORM_CAPABILITIES['twitter'] || []

                      if (!capabilities.includes(postType)) {
                        return (
                          <Box
                            sx={{
                              p: 2,
                              border: theme => `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              bgcolor: 'background.paper'
                            }}
                          >
                            <Typography variant='body2' color='text.secondary'>
                              Twitter: {postType} not supported
                            </Typography>
                          </Box>
                        )
                      }

                      // Convert local media files to preview format
                      const previewMediaFiles = localMediaFiles.map(file => ({
                        url: file.previewUrl,
                        fileUrl: file.previewUrl,
                        type: file.type,
                        size: file.size
                      }))

                      return <TwitterPost account={account} mediaFiles={previewMediaFiles} content={content} />
                    })()}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: 4
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Select an account to preview your post
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        />
      )}
    />
  )
}
