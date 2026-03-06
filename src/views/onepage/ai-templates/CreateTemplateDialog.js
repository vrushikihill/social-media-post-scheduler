import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
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
  Typography
} from '@mui/material'
import { useState } from 'react'

const TEMPLATE_CATEGORIES = [
  { value: 'festival', label: 'Festival' },
  { value: 'product_promotion', label: 'Product Promotion' },
  { value: 'offer', label: 'Offer Announcement' },
  { value: 'educational', label: 'Educational' },
  { value: 'quote', label: 'Quote' },
  { value: 'before_after', label: 'Before/After' },
  { value: 'custom', label: 'Custom' }
]

const CreateTemplateDialog = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'custom',
    description: '',
    template: '',
    placeholders: []
  })

  const [newPlaceholder, setNewPlaceholder] = useState({ name: '', type: 'text', required: true })

  const handleClose = () => {
    setFormData({
      name: '',
      category: 'custom',
      description: '',
      template: '',
      placeholders: []
    })
    setNewPlaceholder({ name: '', type: 'text', required: true })
    onClose()
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddPlaceholder = () => {
    if (!newPlaceholder.name.trim()) return

    // Convert spaces to underscores for the placeholder name
    const formattedName = newPlaceholder.name.toLowerCase().replace(/\s+/g, '_')

    setFormData(prev => ({
      ...prev,
      placeholders: [...prev.placeholders, { ...newPlaceholder, name: formattedName }],
      template: prev.template ? `${prev.template} {${formattedName}}` : `{${formattedName}}`
    }))

    setNewPlaceholder({ name: '', type: 'text', required: true })
  }

  const handleRemovePlaceholder = index => {
    setFormData(prev => ({
      ...prev,
      placeholders: prev.placeholders.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()

    // Create the template object matching the app's standard structure
    const newTemplate = {
      id: `custom_${Date.now()}`,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      template: formData.template,
      platforms: ['facebook', 'instagram', 'linkedin', 'twitter'],
      toneOptions: ['professional', 'casual', 'friendly', 'exciting', 'informative'],
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
          Create Custom Template
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
            />

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
              />
            </Box>

            <Box sx={{ mt: 1, p: 4, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant='subtitle2' fontWeight={600} gutterBottom>
                Define Variables (Optional)
              </Typography>
              <Typography variant='caption' color='text.secondary' display='block' sx={{ mb: 2 }}>
                Add form fields for users to fill in before generating the content.
              </Typography>

              {formData.placeholders.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  {formData.placeholders.map((ph, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography variant='body2' fontWeight={600} fontFamily='monospace'>
                          {'{' + ph.name + '}'}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          ({ph.type}, {ph.required ? 'required' : 'optional'})
                        </Typography>
                      </Box>
                      <IconButton size='small' color='error' onClick={() => handleRemovePlaceholder(index)}>
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  size='small'
                  label='Variable Name'
                  value={newPlaceholder.name}
                  onChange={e => setNewPlaceholder({ ...newPlaceholder, name: e.target.value })}
                  placeholder='e.g., employee_name'
                  sx={{ flex: 1 }}
                />
                <TextField
                  size='small'
                  select
                  label='Type'
                  value={newPlaceholder.type}
                  onChange={e => setNewPlaceholder({ ...newPlaceholder, type: e.target.value })}
                  sx={{ width: 120 }}
                >
                  <MenuItem value='text'>Text</MenuItem>
                  <MenuItem value='textarea'>Textarea</MenuItem>
                  <MenuItem value='number'>Number</MenuItem>
                  <MenuItem value='date'>Date</MenuItem>
                </TextField>
                <Button
                  variant='outlined'
                  onClick={handleAddPlaceholder}
                  disabled={!newPlaceholder.name.trim()}
                  sx={{ height: 40 }}
                >
                  Add
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 6 }}>
          <Button onClick={handleClose} variant='outlined' color='error'>
            Cancel
          </Button>
          <Button type='submit' variant='contained' disabled={!formData.name || !formData.template}>
            Save Template
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateTemplateDialog
