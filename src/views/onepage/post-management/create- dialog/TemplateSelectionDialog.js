import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  TextField
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import CelebrationIcon from '@mui/icons-material/Celebration'
import CompareIcon from '@mui/icons-material/Compare'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import SchoolIcon from '@mui/icons-material/School'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { aiTemplatesAPI } from 'src/services/socialMediaService'
import GenerateDialog from '../../ai-templates/GenerateDialog'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { forwardRef } from 'react'

const CUSTOM_TEMPLATES_KEY = 'social_media_custom_ai_templates'

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
    before_after: '#00bcd4',
    custom: '#673ab7'
  }

  return colors[category] || '#757575'
}

const CustomDateInput = forwardRef((props, ref) => {
  return (
    <TextField
      fullWidth
      {...props}
      inputRef={ref}
      InputProps={{
        endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', cursor: 'pointer' }} />
      }}
    />
  )
})

const TemplateSelectionDialog = ({ open, onClose, onSelectContent }) => {
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [generatedContent, setGeneratedContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchTemplates()
    }
  }, [open])

  const fetchTemplates = async () => {
    let baseTemplates = []

    try {
      const response = await aiTemplatesAPI.getTemplates()
      baseTemplates = response.data?.data || response.data || []
    } catch (error) {
      // console.error('Error fetching templates:', error)

      // Fallback templates from index.js
      baseTemplates = [
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
        }

        // ... include rest of fallback if needed, but the API usually works
      ]
    }

    // Merge with custom templates
    let customTemplates = []
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CUSTOM_TEMPLATES_KEY)
      customTemplates = saved ? JSON.parse(saved) : []
    }

    setTemplates([...customTemplates, ...baseTemplates])
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
      selectedTemplate.placeholders?.forEach(placeholder => {
        const value = formData[placeholder.name] || ''
        content = content.replace(`{${placeholder.name}}`, value)
      })

      // Generate AI-enhanced content
      const response = await aiTemplatesAPI.generateContent(selectedTemplate.id, {
        ...formData,
        tone,
        template: content
      })

      setGeneratedContent(response.data?.data?.content || response.data?.content || content)
      toast.success('Content generated successfully!')
    } catch (error) {
      toast.error('AI API Error, falling back to basic template text')

      // Fallback
      let content = selectedTemplate.template
      selectedTemplate.placeholders?.forEach(placeholder => {
        const value = formData[placeholder.name] || `[${placeholder.name}]`
        content = content.replace(`{${placeholder.name}}`, value)
      })
      setGeneratedContent(content)
      toast.success('Template filled successfully!')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyContent = () => {
    if (generatedContent) {
      onSelectContent(generatedContent)
      setGenerateDialogOpen(false)
      onClose()
    }
  }

  // Render form field is adapted from ai-templates/index.js
  const renderFormField = placeholder => {
    const { name, type, required } = placeholder
    const label = name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())

    switch (type) {
      case 'textarea':
        return (
          <TextField
            key={name}
            fullWidth
            size='small'
            multiline
            rows={3}
            label={label}
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
            label={label}
            value={formData[name] || ''}
            onChange={e => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
            required={required}
            sx={{ mb: 2 }}
          />
        )
      case 'date':
        return (
          <DatePickerWrapper key={name} sx={{ mb: 2 }}>
            <DatePicker
              selected={formData[name] ? new Date(formData[name]) : null}
              onChange={date => {
                // Add 12 hours to avoid timezone shifting to previous day
                const safeDate = date
                  ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
                  : ''
                setFormData(prev => ({ ...prev, [name]: safeDate }))
              }}
              customInput={<CustomDateInput label={label} required={required} />}
            />
          </DatePickerWrapper>
        )
      default:
        return (
          <TextField
            key={name}
            fullWidth
            label={label}
            value={formData[name] || ''}
            onChange={e => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
            required={required}
            sx={{ mb: 3 }}
          />
        )
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoFixHighIcon color='primary' />
            <Typography variant='h6' component='span' fontWeight={600}>
              Select an AI Template
            </Typography>
          </Box>
          <IconButton onClick={onClose} size='small'>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {templates.map(template => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    transition: '0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      borderColor: getCategoryColor(template.category)
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: `${getCategoryColor(template.category)}15`,
                          color: getCategoryColor(template.category),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {getCategoryIcon(template.category)}
                      </Box>
                      {template.isCustom && <Chip label='Custom' size='small' color='secondary' variant='outlined' />}
                    </Box>
                    <Typography variant='h6' sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 1 }}>
                      {template.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 2, minHeight: 40 }}>
                      {template.description}
                    </Typography>
                    <Button
                      variant='outlined'
                      fullWidth
                      onClick={() => handleUseTemplate(template)}
                      sx={{ textTransform: 'none', borderRadius: 1.5, borderColor: 'divider' }}
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color='inherit'>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reusing the GenerateContent Dialog */}
      <GenerateDialog
        renderFormField={renderFormField}
        handleUseContent={handleApplyContent}
        handleGenerateContent={handleGenerateContent}
        generateDialogOpen={generateDialogOpen}
        setGenerateDialogOpen={setGenerateDialogOpen}
        selectedTemplate={selectedTemplate}
        generatedContent={generatedContent}
        setGeneratedContent={setGeneratedContent}
        loading={loading}
      />
    </>
  )
}

export default TemplateSelectionDialog
