import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogContent, Box, Typography, Button, Fade } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { uploadFiles } from 'src/store/common'
import dayjs from 'dayjs'
import api from 'utils/api'
import AiDialog from '../../create-post/AiDialog'
import { aiTemplatesAPI } from 'src/services/socialMediaService'
import { PLATFORM_CAPABILITIES, validateMediaFiles, validateMediaTypeConsistency } from './utils'
import { ImageCropDialog } from './ImageCropDialog'
import { Header } from './Header'
import { Footer } from './Footer'
import { PostBox } from './PostBox'
import { Preview } from './Preview'
import TemplateSelectionDialog from './TemplateSelectionDialog'

export default function CreatePostDialog({ open, onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [invalidImages, setInvalidImages] = useState([]) // Track images with invalid aspect ratios
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [currentCropImage, setCurrentCropImage] = useState(null)
  const [localMediaFiles, setLocalMediaFiles] = useState([]) // Store files locally before upload
  const [aiDialogOpen, setAiDialogOpen] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState({ title: '', description: '' })

  const { control, watch, setValue, handleSubmit, reset, getValues } = useForm({
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
        let accountsData = response.data?.data || response.data || []

        // Normalize the objects to have both structures
        accountsData = accountsData.map(acc => ({
          ...acc,
          provider: acc.platform || acc.provider,
          metadata: {
            ...acc.metadata,
            name: acc.accountName || acc.metadata?.name,
            picture: acc.accountAvatar || acc.metadata?.picture || acc.metadata?.profilePicture
          }
        }))

        setValue('accounts', accountsData)
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
    setSuccessDialogOpen(false)
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

  const handleAIGenerate = async (prompt, tone) => {
    let toastId
    try {
      toastId = toast.loading('Generating AI content...')

      // Try to determine the platform - default to instagram if none or multiple selected
      let platform = 'instagram'
      if (selectedAccounts.length === 1) {
        platform = selectedAccounts[0].provider === 'instagram-business' ? 'instagram' : selectedAccounts[0].provider
      }

      const response = await aiTemplatesAPI.generateCaption(prompt, platform, tone)

      const newContent =
        response.data?.data?.caption ||
        response.data?.data?.generatedContent ||
        response.data?.caption ||
        response.data?.generatedContent ||
        ''
      
      toast.success('AI content generated!', { id: toastId })
      
      return newContent
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error generating AI content', { id: toastId })
      return null
    }
  }

  const handleApplyAIContent = (newContent) => {
    const currentContent = getValues('content') || ''
    setValue('content', currentContent ? `${currentContent}\n\n${newContent}` : newContent)
    setAiDialogOpen(false)
  }

  const handleSelectTemplateContent = content => {
    const currentContent = getValues('content') || ''
    setValue('content', currentContent ? `${currentContent}\n\n${content}` : content)
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

      let shouldShowSuccess = false

      if (data.isScheduled) {
        // Schedule post
        response = await api.post('/v1/social-media-post/schedule', {
          ...payload,
          scheduledAt: dayjs(data.scheduledAt).toISOString(),
          timezone: data.timezone
        })

        setSuccessMessage({
          title: 'Post Scheduled Successfully!',
          description: `Your post is scheduled for ${dayjs(data.scheduledAt).format('MMM D, YYYY [at] h:mm A')}.`
        })
        shouldShowSuccess = true
      } else {
        // Post immediately
        response = await api.post('/v1/social-media-post/post', payload)

        const result = response.data?.data || response.data

        // Show results
        if (result.summary.successful > 0) {
          setSuccessMessage({
            title: 'Post Published Successfully!',
            description: `Successfully posted to ${result.summary.successful} account(s)${
              result.summary.failed > 0 ? `, ${result.summary.failed} failed` : ''
            }.`
          })
          shouldShowSuccess = true
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

      if (shouldShowSuccess) {
        setSuccessDialogOpen(true)
      } else {
        // If no success show (e.g. all accounts failed for direct post), just reset and refresh
        setTimeout(() => {
          onClose()
          if (onSuccess) onSuccess()
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
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (isSubmitting && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
            return
          }
          onClose()
        }}
        disableEscapeKeyDown={isSubmitting}
        maxWidth={showPreview ? 'lg' : 'md'}
        fullWidth
      >
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '85vh' }}>
          <Header
            showPreview={showPreview}
            setShowPreview={value => setValue('showPreview', value)}
            onClose={onClose}
            onAIAssistantClick={() => setAiDialogOpen(true)}
            onTemplateClick={() => setTemplateDialogOpen(true)}
            isSubmitting={isSubmitting}
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

      {/* AI Generate Dialog */}
      <AiDialog 
        handleAIGenerate={handleAIGenerate} 
        aiDialogOpen={aiDialogOpen} 
        setAiDialogOpen={setAiDialogOpen} 
        onApplyContent={handleApplyAIContent}
      />

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={() => {
          setSuccessDialogOpen(false)
          onClose()
          if (onSuccess) onSuccess()
          reset()
          setLocalMediaFiles([])
        }}
        maxWidth='xs'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
          <Fade in={successDialogOpen} timeout={500}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(76, 175, 80, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 5,
                color: 'success.main'
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 50, color: '#4caf50' }} />
            </Box>
          </Fade>
          <Typography variant='h5' fontWeight={700} gutterBottom color='text.primary'>
            {successMessage.title}
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ mb: 5, lineHeight: 1.6 }}>
            {successMessage.description}
          </Typography>
          <Button
            variant='contained'
            fullWidth
            size='medium'
            onClick={() => {
              setSuccessDialogOpen(false)
              onClose()
              if (onSuccess) onSuccess()
              reset()
              setLocalMediaFiles([])
            }}
            sx={{
              borderRadius: 2,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1.05rem',
              fontWeight: 600
            }}
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>

      {/* Template Selection Dialog */}
      <TemplateSelectionDialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        onSelectContent={handleSelectTemplateContent}
      />
    </>
  )
}
