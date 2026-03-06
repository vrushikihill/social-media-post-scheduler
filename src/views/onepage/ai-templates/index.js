import AddIcon from '@mui/icons-material/Add'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CelebrationIcon from '@mui/icons-material/Celebration'
import CompareIcon from '@mui/icons-material/Compare'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import SchoolIcon from '@mui/icons-material/School'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { forwardRef, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import toast from 'react-hot-toast'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { aiTemplatesAPI } from 'src/services/socialMediaService'
import TemplateSelectionDialog from '../post-management/create- dialog/TemplateSelectionDialog'
import CreateTemplateDialog from './CreateTemplateDialog'
import GenerateDialog from './GenerateDialog'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'
import Template from './Template'

const CUSTOM_TEMPLATES_KEY = 'social_media_custom_ai_templates'

const CustomDateInput = forwardRef((props, ref) => {
  return (
    <TextField
      {...props}
      fullWidth
      inputRef={ref}
      InputProps={{
        endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', cursor: 'pointer' }} />
      }}
    />
  )
})

const AITemplates = () => {
  const router = useRouter()
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [templateSelectionOpen, setTemplateSelectionOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [generatedContent, setGeneratedContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedTone, setSelectedTone] = useState(null)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState(null)

  useEffect(() => {
    fetchTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCustomTemplates = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CUSTOM_TEMPLATES_KEY)

      return saved ? JSON.parse(saved) : []
    }

    return []
  }

  const fetchTemplates = async () => {
    let baseTemplates = []

    try {
      const response = await aiTemplatesAPI.getTemplates()
      baseTemplates = response.data?.data || response.data || []
    } catch (error) {
      // console.error('Error fetching templates:', error)

      setTemplates([
        {
          id: 1,
          name: 'Festival Post',
          category: 'festival',
          description: 'Create engaging posts for festivals and holidays',
          template: 'Celebrate {festival_name} with us! {custom_message} #festival #{festival_name}',
          platforms: ['facebook', 'instagram', 'linkedin', 'twitter'],
          toneOptions: ['festive', 'professional', 'casual'],
          placeholders: [
            { name: 'festival_name', type: 'text', required: true },
            { name: 'custom_message', type: 'textarea', required: false }
          ]
        },
        {
          id: 2,
          name: 'Product Promotion',
          category: 'product_promotion',
          description: 'Promote your products effectively',
          template: 'Introducing {product_name}! {product_description} Get {discount}% off today! {call_to_action}',
          platforms: ['facebook', 'instagram', 'linkedin'],
          toneOptions: ['exciting', 'professional', 'casual'],
          placeholders: [
            { name: 'product_name', type: 'text', required: true },
            { name: 'product_description', type: 'textarea', required: true },
            { name: 'discount', type: 'number', required: false },
            { name: 'call_to_action', type: 'text', required: false }
          ]
        },
        {
          id: 3,
          name: 'Offer Announcement',
          category: 'offer',
          description: 'Announce special offers and deals',
          template: '🔥 Limited Time Offer! {offer_details} Valid until {expiry_date}. {terms_conditions}',
          platforms: ['facebook', 'instagram', 'twitter'],
          toneOptions: ['urgent', 'exciting', 'professional'],
          placeholders: [
            { name: 'offer_details', type: 'textarea', required: true },
            { name: 'expiry_date', type: 'date', required: true },
            { name: 'terms_conditions', type: 'textarea', required: false }
          ]
        },
        {
          id: 4,
          name: 'Educational Post',
          category: 'educational',
          description: 'Share knowledge and educate your audience',
          template: 'Did you know? {fact_or_tip} {detailed_explanation} What do you think? Share your thoughts below!',
          platforms: ['linkedin', 'facebook', 'twitter'],
          toneOptions: ['informative', 'professional', 'friendly'],
          placeholders: [
            { name: 'fact_or_tip', type: 'text', required: true },
            { name: 'detailed_explanation', type: 'textarea', required: true }
          ]
        },
        {
          id: 5,
          name: 'Quote Post',
          category: 'quote',
          description: 'Share inspirational quotes',
          template: '"{quote_text}" - {author} {personal_reflection} #motivation #inspiration',
          platforms: ['instagram', 'linkedin', 'facebook'],
          toneOptions: ['inspirational', 'professional', 'motivational'],
          placeholders: [
            { name: 'quote_text', type: 'textarea', required: true },
            { name: 'author', type: 'text', required: true },
            { name: 'personal_reflection', type: 'textarea', required: false }
          ]
        },
        {
          id: 6,
          name: 'Before/After Showcase',
          category: 'before_after',
          description: 'Showcase transformations and results',
          template:
            'Amazing transformation! {transformation_description} Before vs After: {results_achieved} {process_details}',
          platforms: ['instagram', 'facebook', 'linkedin'],
          toneOptions: ['exciting', 'professional', 'inspiring'],
          placeholders: [
            { name: 'transformation_description', type: 'textarea', required: true },
            { name: 'results_achieved', type: 'textarea', required: true },
            { name: 'process_details', type: 'textarea', required: false }
          ]
        }
      ])
    }

    // Merge with custom templates
    const customTemplates = getCustomTemplates()
    setTemplates([...customTemplates, ...baseTemplates])
  }

  const handleSaveCustomTemplate = newTemplate => {
    const customTemplates = getCustomTemplates()
    let updatedTemplates

    // Check if we're editing an existing template
    const existingIndex = customTemplates.findIndex(t => t.id === newTemplate.id)

    if (existingIndex !== -1) {
      updatedTemplates = [...customTemplates]
      updatedTemplates[existingIndex] = newTemplate
    } else {
      updatedTemplates = [newTemplate, ...customTemplates]
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(updatedTemplates))
    }

    // Refresh state to include both custom and base templates
    fetchTemplates()

    setEditingTemplate(null)
    setCreateDialogOpen(false)
    toast.success(existingIndex !== -1 ? 'Template updated successfully!' : 'Custom template saved successfully!')
  }

  const handleDeleteTemplate = templateId => {
    const template = templates.find(t => t.id === templateId)
    setTemplateToDelete(template)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!templateToDelete) return

    const customTemplates = getCustomTemplates()
    const updatedTemplates = customTemplates.filter(t => t.id !== templateToDelete.id)

    if (typeof window !== 'undefined') {
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(updatedTemplates))
    }

    fetchTemplates()
    setDeleteDialogOpen(false)
    setTemplateToDelete(null)
    toast.success('Template deleted successfully!')
  }

  const handleEditTemplate = template => {
    setEditingTemplate(template)
    setCreateDialogOpen(true)
  }

  const getCategoryIcon = category => {
    const icons = {
      festival: <CelebrationIcon />,
      product_promotion: <ShoppingCartIcon />,
      offer: <LocalOfferIcon />,
      educational: <SchoolIcon />,
      quote: <FormatQuoteIcon />,
      before_after: <CompareIcon />
    }

    return icons[category] || <SmartToyIcon />
  }

  const getCategoryColor = category => {
    const colors = {
      festival: '#ff9800',
      product_promotion: '#4caf50',
      offer: '#f44336',
      educational: '#2196f3',
      quote: '#9c27b0',
      before_after: '#00bcd4'
    }

    return colors[category] || '#757575'
  }

  const handleUseTemplate = template => {
    setSelectedTemplate(template)
    setFormData({})
    setGeneratedContent(template.template)
    setSelectedTone(null)
    setGenerateDialogOpen(true)
  }

  const handleGenerateContent = async () => {
    try {
      setLoading(true)

      // Generate AI-enhanced content using raw template
      const response = await aiTemplatesAPI.generateContent(selectedTemplate.id, {
        tone: selectedTone || 'professional',
        template: selectedTemplate.template
      })

      setGeneratedContent(response.data?.data?.generatedContent || response.data?.generatedContent)
      toast.success('Content generated successfully!')
    } catch (error) {
      toast.error('Error generating content')
      setGeneratedContent(selectedTemplate.template)
    } finally {
      setLoading(false)
    }
  }

  const handleUseContent = () => {
    // Navigate to create post with pre-filled content
    const queryParams = new URLSearchParams({
      content: generatedContent,
      template: selectedTemplate.name
    })
    router.push(`/one-page-tabs?tab=create-post&${queryParams.toString()}`)
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 600, mb: 1 }}>
            AI Templates
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Use pre-built templates to create engaging content quickly
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingTemplate(null)
              setCreateDialogOpen(true)
            }}
          >
            Create Template
          </Button>
        </Box>
      </Box>

      {/* Templates Grid */}
      <Template
        handleUseTemplate={handleUseTemplate}
        handleEditTemplate={handleEditTemplate}
        handleDeleteTemplate={handleDeleteTemplate}
        getCategoryColor={getCategoryColor}
        getCategoryIcon={getCategoryIcon}
        templates={templates}
      />

      {/* Generate Content Dialog */}
      <GenerateDialog
        handleUseContent={handleUseContent}
        handleGenerateContent={handleGenerateContent}
        generateDialogOpen={generateDialogOpen}
        setGenerateDialogOpen={setGenerateDialogOpen}
        selectedTemplate={selectedTemplate}
        generatedContent={generatedContent}
        setGeneratedContent={setGeneratedContent}
        loading={loading}
        selectedTone={selectedTone}
        setSelectedTone={setSelectedTone}
        getCategoryColor={getCategoryColor}
        getCategoryIcon={getCategoryIcon}
      />

      {/* Create Template Dialog */}
      <CreateTemplateDialog
        open={createDialogOpen}
        editingTemplate={editingTemplate}
        onClose={() => {
          setCreateDialogOpen(false)
          setEditingTemplate(null)
        }}
        onSave={handleSaveCustomTemplate}
      />

      {/* Template Selection Dialog */}
      <TemplateSelectionDialog
        open={templateSelectionOpen}
        onClose={() => setTemplateSelectionOpen(false)}
        onSelectContent={content => {
          // You can handle what to do with the generated content here
          // For now, it copies to clipboard or routes to create-post
          navigator.clipboard.writeText(content)
          toast.success('Content copied to clipboard!')
          router.push({ pathname: '/one-page-tabs', query: { tab: 'create-post' } })
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        templateName={templateToDelete?.name || ''}
        onClose={() => {
          setDeleteDialogOpen(false)
          setTemplateToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  )
}

export default AITemplates
