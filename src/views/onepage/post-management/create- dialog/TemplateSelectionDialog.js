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
  const [selectedTone, setSelectedTone] = useState(null)

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

      setGeneratedContent(response.data?.data?.generatedContent || response.data?.generatedContent || selectedTemplate.template)
      toast.success('Content generated successfully!')
    } catch (error) {
      toast.error('AI API Error, falling back to basic template text')
      setGeneratedContent(selectedTemplate.template)
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
        handleUseContent={handleApplyContent}
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
    </>
  )
}

export default TemplateSelectionDialog
