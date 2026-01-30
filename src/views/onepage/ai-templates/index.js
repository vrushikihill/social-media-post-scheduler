import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CelebrationIcon from '@mui/icons-material/Celebration'
import CompareIcon from '@mui/icons-material/Compare'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import SchoolIcon from '@mui/icons-material/School'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { aiTemplatesAPI } from 'src/services/socialMediaService'
import GenerateDialog from './GenerateDialog'
import Template from './Template'

const AITemplates = () => {
  const router = useRouter()
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [generatedContent, setGeneratedContent] = useState('')

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await aiTemplatesAPI.getTemplates()
      setTemplates(response.data)
    } catch (error) {
      toast.error('Error fetching templates:', error)

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
    setGeneratedContent('')
    setGenerateDialogOpen(true)
  }

  const handleGenerateContent = async (tone = 'professional') => {
    try {
      setLoading(true)

      // Fill template with form data
      let content = selectedTemplate.template
      selectedTemplate.placeholders.forEach(placeholder => {
        const value = formData[placeholder.name] || ''
        content = content.replace(`{${placeholder.name}}`, value)
      })

      // Generate AI-enhanced content
      const response = await aiTemplatesAPI.generateContent(selectedTemplate.id, {
        ...formData,
        tone,
        template: content
      })

      setGeneratedContent(response.data.content)
      toast.success('Content generated successfully!')
    } catch (error) {
      toast.error('Error generating content:', error)

      let content = selectedTemplate.template
      selectedTemplate.placeholders.forEach(placeholder => {
        const value = formData[placeholder.name] || `[${placeholder.name}]`
        content = content.replace(`{${placeholder.name}}`, value)
      })
      setGeneratedContent(content)
      toast.success('Template filled successfully!')
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

  const renderFormField = placeholder => {
    const { name, type, required } = placeholder

    switch (type) {
      case 'textarea':
        return (
          <TextField
            key={name}
            fullWidth
            size='small'
            multiline
            rows={3}
            label={name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            value={formData[name] || ''}
            onChange={e => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
            required={required}
            sx={{ mb: 2 }}
          />
        )

      case 'number':
        return (
          <TextField
            key={name}
            fullWidth
            type='number'
            label={name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            value={formData[name] || ''}
            onChange={e => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
            required={required}
            sx={{ mb: 2 }}
          />
        )

      case 'date':
        return (
          <TextField
            key={name}
            fullWidth
            type='date'
            label={name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            value={formData[name] || ''}
            onChange={e => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
            required={required}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        )

      default:
        return (
          <TextField
            key={name}
            fullWidth
            label={name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            value={formData[name] || ''}
            onChange={e => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
            required={required}
            sx={{ mb: 3 }}
          />
        )
    }
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
        <Button
          variant='outlined'
          startIcon={<AutoAwesomeIcon />}
          onClick={() => router.push('/one-page-tabs?tab=create-post')}
        >
          Custom AI Generate
        </Button>
      </Box>

      {/* Templates Grid */}
      <Template
        handleUseTemplate={handleUseTemplate}
        getCategoryColor={getCategoryColor}
        getCategoryIcon={getCategoryIcon}
        templates={templates}
      />

      {/* Generate Content Dialog */}
      <GenerateDialog
        renderFormField={renderFormField}
        handleUseContent={handleUseContent}
        handleGenerateContent={handleGenerateContent}
        generateDialogOpen={generateDialogOpen}
        setGenerateDialogOpen={setGenerateDialogOpen}
        selectedTemplate={selectedTemplate}
        generatedContent={generatedContent}
        setGeneratedContent={setGeneratedContent}
      />
    </Box>
  )
}

export default AITemplates
