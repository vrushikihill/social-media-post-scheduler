import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Tooltip,
  Grid,
  Switch,
  Select
} from '@mui/material'
import { useState, useEffect } from 'react'

const TEMPLATE_CATEGORIES = [
  { value: 'festival', label: 'Festival' },
  { value: 'product_promotion', label: 'Product Promotion' },
  { value: 'offer', label: 'Offer Announcement' },
  { value: 'educational', label: 'Educational' },
  { value: 'quote', label: 'Quote' },
  { value: 'before_after', label: 'Before/After' },
  { value: 'custom', label: 'Custom' }
]

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
  { value: 'instagram', label: 'Instagram', icon: <InstagramIcon /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon /> },
  { value: 'twitter', label: 'Twitter', icon: <TwitterIcon /> }
]

const TONE_OPTIONS = ['Professional', 'Casual', 'Friendly', 'Exciting', 'Informative', 'Urgent', 'Inspirational', 'Festive']

const CreateTemplateDialog = ({ open, onClose, onSave, editingTemplate }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'custom',
    description: '',
    template: '',
    platforms: ['facebook', 'instagram'],
    toneOptions: ['professional', 'casual'],
    placeholders: []
  })

  useEffect(() => {
    if (editingTemplate) {
      setFormData({
        id: editingTemplate.id,
        name: editingTemplate.name || '',
        category: editingTemplate.category || 'custom',
        description: editingTemplate.description || '',
        template: editingTemplate.template || '',
        platforms: editingTemplate.platforms || ['facebook', 'instagram'],
        toneOptions: editingTemplate.toneOptions || ['professional', 'casual'],
        placeholders: editingTemplate.placeholders || []
      })
    } else {
      setFormData({
        name: '',
        category: 'custom',
        description: '',
        template: '',
        platforms: ['facebook', 'instagram'],
        toneOptions: ['professional', 'casual'],
        placeholders: []
      })
    }
  }, [editingTemplate, open])

  const handleClose = () => {
    setFormData({
      name: '',
      category: 'custom',
      description: '',
      template: '',
      platforms: ['facebook', 'instagram'],
      toneOptions: ['professional', 'casual'],
      placeholders: []
    })
    onClose()
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // If template changes, sync placeholders
    if (name === 'template') {
      syncPlaceholders(value)
    }
  }

  const syncPlaceholders = templateText => {
    const variableRegex = /\{([a-zA-Z0-9_]+)\}/g
    const matches = [...templateText.matchAll(variableRegex)]
    const variableNames = [...new Set(matches.map(m => m[1]))]

    setFormData(prev => {
      const existingPlaceholders = [...prev.placeholders]
      const newPlaceholders = []

      // Keep existing metadata for matching variables
      variableNames.forEach(name => {
        const existing = existingPlaceholders.find(ph => ph.name === name)
        if (existing) {
          newPlaceholders.push({ ...existing, synced: true })
        } else {
          newPlaceholders.push({ name, type: 'text', required: true, synced: true })
        }
      })

      // Also keep variables that were manually added but are not in text yet
      // These will be marked as 'not in text'
      existingPlaceholders.forEach(ph => {
        if (!variableNames.includes(ph.name) && !newPlaceholders.find(n => n.name === ph.name)) {
          newPlaceholders.push({ ...ph, synced: false })
        }
      })

      return { ...prev, placeholders: newPlaceholders }
    })
  }


  const handlePlatformToggle = platform => {
    setFormData(prev => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
      return { ...prev, platforms }
    })
  }

  const handleToneToggle = tone => {
    const toneLower = tone.toLowerCase()
    setFormData(prev => {
      const toneOptions = prev.toneOptions.includes(toneLower)
        ? prev.toneOptions.filter(t => t !== toneLower)
        : [...prev.toneOptions, toneLower]
      return { ...prev, toneOptions }
    })
  }

  const handleRemovePlaceholder = index => {
    setFormData(prev => {
      const phToRemove = prev.placeholders[index]
      const newPlaceholders = prev.placeholders.filter((_, i) => i !== index)

      // Also remove from template text
      const variablePattern = new RegExp(`\\{${phToRemove.name}\\}`, 'g')
      const newTemplate = prev.template.replace(variablePattern, '')

      return {
        ...prev,
        placeholders: newPlaceholders,
        template: newTemplate
      }
    })
  }

  const handleSubmit = e => {
    e.preventDefault()

    // Create the template object matching the app's standard structure
    const newTemplate = {
      id: editingTemplate ? editingTemplate.id : `custom_${Date.now()}`,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      template: formData.template,
      platforms: formData.platforms,
      toneOptions: formData.toneOptions,
      placeholders: formData.placeholders,
      isCustom: true // identify this as a user-made template
    }

    onSave(newTemplate)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant='h6' component='span' fontWeight={600}>
          {editingTemplate ? 'Edit Custom Template' : 'Create Custom Template'}
        </Typography>
        <IconButton onClick={handleClose} size='small'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <TextField
              fullWidth
              label='Template Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              placeholder='e.g., Weekly Team Update'
            />

            <TextField
              fullWidth
              select
              label='Category'
              name='category'
              value={formData.category}
              onChange={handleChange}
              required
            >
              {TEMPLATE_CATEGORIES.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={2}
              label='Description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              required
              placeholder='Briefly describe what this template is used for...'
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }}
            />

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant='subtitle2' fontWeight={600} gutterBottom color='primary'>
                    Target Platforms
                  </Typography>
                  <Typography variant='caption' color='text.secondary' display='block' sx={{ mb: 2 }}>
                    Where should this post be shared?
                  </Typography>
                  <Stack direction='row' spacing={1}>
                    {PLATFORMS.map(platform => (
                      <Tooltip key={platform.value} title={platform.label}>
                        <ToggleButton
                          value={platform.value}
                          selected={formData.platforms.includes(platform.value)}
                          onChange={() => handlePlatformToggle(platform.value)}
                          sx={{
                            borderRadius: 2,
                            width: 50,
                            height: 50,
                            transition: 'all 0.2s',
                            '&.Mui-selected': {
                              bgcolor: 'primary.main',
                              color: 'white',
                              transform: 'scale(1.05)',
                              '&:hover': { bgcolor: 'primary.dark' }
                            }
                          }}
                        >
                          {platform.icon}
                        </ToggleButton>
                      </Tooltip>
                    ))}
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
                  <Typography variant='subtitle2' fontWeight={600} gutterBottom color='primary'>
                    Tone Options
                  </Typography>
                  <Typography variant='caption' color='text.secondary' display='block' sx={{ mb: 2 }}>
                    Select available styles for AI generation
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {TONE_OPTIONS.map(tone => (
                      <Chip
                        key={tone}
                        label={tone}
                        onClick={() => handleToneToggle(tone)}
                        color={formData.toneOptions.includes(tone.toLowerCase()) ? 'primary' : 'default'}
                        variant={formData.toneOptions.includes(tone.toLowerCase()) ? 'contained' : 'outlined'}
                        sx={{
                          borderRadius: 1,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': { opacity: 0.8 }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 1 }}>
              <Typography variant='subtitle2' fontWeight={600} gutterBottom>
                Template Content
              </Typography>
              <Typography variant='caption' color='text.secondary' display='block' sx={{ mb: 1.5 }}>
                Write your template text here. Variables like {'{name}'} will be filled in when someone uses it. You can
                define standard variables below.
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={5}
                name='template'
                value={formData.template}
                onChange={handleChange}
                required
                placeholder='Welcome {employee_name} to the team! We are so excited to have you join us as a {role}. #welcome #newhire'
                sx={{ mb: 2 }}
              />

            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 6, gap: 2 }}>
          <Button onClick={handleClose} variant='outlined' color='inherit' sx={{ borderRadius: 2, px: 4 }}>
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={
              !formData.name ||
              !formData.template ||
              formData.platforms.length === 0 ||
              formData.toneOptions.length === 0
            }
            sx={{
              borderRadius: 2,
              px: 6,
              background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
              boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)'
            }}
          >
            {editingTemplate ? 'Update Template' : 'Save Template'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateTemplateDialog
