import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import PublishIcon from '@mui/icons-material/Publish'
import SaveIcon from '@mui/icons-material/Save'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { aiTemplatesAPI, mediaAPI, postsAPI, socialAccountsAPI } from 'src/services/socialMediaService'
import AiDialog from './AiDialog'
import Content from './Content'
import Preview from './Preview'
import Sidebar from './Sidebar'
import TemplateDialog from './TemplateDialog'

const CreatePost = () => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    content: '',
    platforms: [],
    scheduledAt: null,
    mediaFiles: [],
    status: 'draft'
  })
  console.log(formData, 'formData')
  const [connectedAccounts, setConnectedAccounts] = useState([])
  const [aiDialogOpen, setAiDialogOpen] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [characterCounts, setCharacterCounts] = useState({})
  const [selectedPreset, setSelectedPreset] = useState(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateCharacterCounts = () => {
    const limits = {
      facebook: 63206,
      instagram: 2200,
      linkedin: 3000,
      twitter: 280
    }

    const counts = {}
    formData.platforms.forEach(platformId => {
      const account = connectedAccounts.find(acc => acc.id === platformId)
      if (account) {
        counts[account.platform] = {
          current: formData.content.length,
          limit: limits[account.platform],
          remaining: limits[account.platform] - formData.content.length
        }
      }
    })
    setCharacterCounts(counts)
  }

  useEffect(() => {
    fetchConnectedAccounts()
  }, [])

  // useEffect(() => {
  //   updateCharacterCounts()
  // }, [updateCharacterCounts])

  const fetchConnectedAccounts = async () => {
    try {
      const response = await socialAccountsAPI.getAccounts()
      setConnectedAccounts(response.data.filter(account => account.status === 'active'))
    } catch (error) {
      toast.error('Error fetching accounts')
    }
  }

  const handleRemoveMedia = index => {
    setFormData(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
    }))
  }

  const handlePlatformToggle = accountId => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(accountId)
        ? prev.platforms.filter(id => id !== accountId)
        : [...prev.platforms, accountId]
    }))
  }

  const handleSelectPreset = preset => {
    setSelectedPreset(preset)
  }

  const handleTemplateSelect = template => {
    // Fill template with placeholders
    let content = template.template

    const placeholders = [
      'festival_name',
      'custom_message',
      'product_name',
      'product_description',
      'discount',
      'offer_details',
      'expiry_date',
      'fact_or_tip',
      'detailed_explanation',
      'quote_text',
      'author',
      'personal_reflection',
      'transformation_description',
      'results_achieved'
    ]

    placeholders.forEach(placeholder => {
      content = content.replace(`{${placeholder}}`, `[${placeholder.replace('_', ' ')}]`)
    })

    setFormData(prev => ({ ...prev, content }))
    setTemplateDialogOpen(false)
    toast.success('Template applied successfully!')
  }

  const handleApplyPreset = () => {
    if (!selectedPreset) return

    // Determine which template content to use (platform-specific variant if available)
    const firstPlatformId = formData.platforms[0]
    let presetContent = selectedPreset.template ?? ''

    if (firstPlatformId && selectedPreset.platformVariants) {
      const account = connectedAccounts.find(acc => acc.id === firstPlatformId)
      if (account && selectedPreset.platformVariants[account.platform]) {
        presetContent = selectedPreset.platformVariants[account.platform] ?? presetContent
      }
    }

    // If there's no usable template, abort gracefully
    if (!presetContent || typeof presetContent !== 'string') {
      toast.error('Selected preset has no template content')

      return
    }

    // Fill in the template with readable placeholders
    const placeholders = [
      { key: 'product_name', label: 'Product Name' },
      { key: 'description', label: 'Description' },
      { key: 'topic', label: 'Topic' },
      { key: 'additional_info', label: 'Additional Info' },
      { key: 'story_description', label: 'Story Description' },
      { key: 'highlight', label: 'Highlight' },
      { key: 'customer_name', label: 'Customer Name' },
      { key: 'testimonial', label: 'Testimonial' },
      { key: 'outcome', label: 'Outcome' },
      { key: 'occasion', label: 'Occasion' },
      { key: 'message', label: 'Message' },
      { key: 'special_offer', label: 'Special Offer' },
      { key: 'tip_title', label: 'Tip Title' },
      { key: 'explanation', label: 'Explanation' },
      { key: 'call_to_action', label: 'Call to Action' }
    ]

    let finalContent = presetContent
    placeholders.forEach(placeholder => {
      finalContent = finalContent.replace(`{${placeholder.key}}`, `[${placeholder.label}]`)
    })

    setFormData(prev => ({
      ...prev,
      content: finalContent
    }))
    toast.success('Preset template applied! Edit the content as needed.')
  }

  const handleMediaUpload = async event => {
    if (!event || !event.target || !event.target.files) return
    const files = Array.from(event.target.files)

    try {
      setLoading(true)

      const uploadPromises = files.map(async file => {
        const payload = new FormData()
        payload.append('file', file)
        const response = await mediaAPI.uploadMedia(payload)

        // Return both the public URL from backend and a local preview URL for UI
        return {
          ...response.data,
          previewUrl: URL.createObjectURL(file)
        }
      })

      const uploadedFiles = await Promise.all(uploadPromises)

      setFormData(prev => ({
        ...prev,
        mediaFiles: [...prev.mediaFiles, ...uploadedFiles]
      }))
      toast.success(`${uploadedFiles.length} file(s) uploaded successfully!`)
    } catch (error) {
      console.error('Error uploading media:', error)
      toast.error('Error uploading media')
    } finally {
      setLoading(false)
    }
  }

  const handleAIGenerate = async (prompt, tone, format) => {
    try {
      setLoading(true)
      const response = await aiTemplatesAPI.generateContent({ prompt, tone, format })
      setFormData(prev => ({ ...prev, content: response.data.generatedContent }))
      toast.success('AI content generated!')
      setAiDialogOpen(false)
    } catch (error) {
      console.error('Error generating AI content:', error)
      toast.error('Error generating AI content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async status => {
    if (formData.platforms.length === 0) {
      toast.error('Please select at least one platform.')

      return
    }

    try {
      setLoading(true)

      const postData = {
        ...formData,
        status: status,
        status: status,
        mediaFiles: formData.mediaFiles // Send full object to preserve type info (image vs video)
      }

      let response
      if (router.query.id) {
        response = await postsAPI.updatePost(router.query.id, postData)
        toast.success('Post updated successfully!')
      } else {
        console.log(postData, 'postData')
        response = await postsAPI.createPost(postData)
        toast.success('Post created successfully!')
      }
      router.push('/post-management')
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Error saving post')
    } finally {
      setLoading(false)
    }
  }

  const getPlatformIcon = platform => {
    const icons = {
      facebook: <FacebookIcon />,
      instagram: <InstagramIcon />,
      linkedin: <LinkedInIcon />,
      twitter: <TwitterIcon />
    }

    return icons[platform] || <FacebookIcon />
  }

  const getPlatformColor = platform => {
    const colors = {
      facebook: '#1877f2',
      instagram: '#e4405f',
      linkedin: '#0077b5',
      twitter: '#1da1f2'
    }

    return colors[platform] || '#1877f2'
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 500, mb: 1 }}>
              Create New Post
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Create and schedule your social media content
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant='outlined' startIcon={<SaveIcon />} onClick={() => handleSave('draft')} disabled={loading}>
              Save Draft
            </Button>
            <Button
              variant='contained'
              startIcon={<PublishIcon />}
              onClick={() => handleSave('published')}
              disabled={loading}
            >
              Publish Now
            </Button>
          </Box>
        </Box>

        <Grid container spacing={5}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Content
              handleRemoveMedia={handleRemoveMedia}
              handleMediaUpload={handleMediaUpload}
              characterCounts={characterCounts}
              formData={formData}
              setFormData={setFormData}
              setAiDialogOpen={setAiDialogOpen}
              handleAIGenerate={handleAIGenerate}
              handleSave={handleSave}
              selectedPreset={selectedPreset}
              onApplyPreset={handleApplyPreset}
              setTemplateDialogOpen={setTemplateDialogOpen}
              loading={loading}
            />
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Sidebar
              getPlatformColor={getPlatformColor}
              getPlatformIcon={getPlatformIcon}
              handlePlatformToggle={handlePlatformToggle}
              connectedAccounts={connectedAccounts}
              formData={formData}
              selectedPreset={selectedPreset}
              onSelectPreset={handleSelectPreset}
            />

            {/* Post Preview */}
            {formData.content && formData.platforms.length > 0 && (
              <Paper
                elevation={2}
                sx={{
                  p: 5,
                  pt: 3,
                  mt: 5,
                  borderRadius: '12px'
                }}
              >
                <Preview formData={formData} connectedAccounts={connectedAccounts} />
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* AI Generate Dialog */}
        <AiDialog handleAIGenerate={handleAIGenerate} aiDialogOpen={aiDialogOpen} setAiDialogOpen={setAiDialogOpen} />

        {/* Template Dialog */}
        <TemplateDialog
          templateDialogOpen={templateDialogOpen}
          setTemplateDialogOpen={setTemplateDialogOpen}
          handleTemplateSelect={handleTemplateSelect}
        />
      </Box>
    </LocalizationProvider>
  )
}

export default CreatePost
