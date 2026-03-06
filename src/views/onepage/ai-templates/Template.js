import { Avatar, Box, Button, Chip, Grid, Paper, Typography } from '@mui/material'
import React from 'react'
import SmartToyIcon from '@mui/icons-material/SmartToy'

const Template = ({
  handleUseTemplate,
  handleEditTemplate,
  handleDeleteTemplate,
  getCategoryColor,
  getCategoryIcon,
  templates
}) => {
  return (
    <Grid container spacing={5}>
      {templates.map(template => (
        <Grid item xs={12} sm={6} md={4} key={template.id}>
          <Paper
            elevation={2}
            sx={{
              p: 5,
              pt: 4,
              borderRadius: '12px',
              height: '100%'
            }}
          >
            <Box sx={{ flex: 1 }}>
              {/* Template Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: getCategoryColor(template.category),
                    color: 'common.white',
                    width: 48,
                    height: 48
                  }}
                >
                  {getCategoryIcon(template.category)}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    {template.name}
                  </Typography>
                  <Chip
                    label={template.category.replace('_', ' ')}
                    size='small'
                    sx={{
                      bgcolor: `${getCategoryColor(template.category)}20`,
                      color: getCategoryColor(template.category),
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
              </Box>

              {/* Description */}
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                {template.description}
              </Typography>

              {/* Supported Platforms */}
              <Box sx={{ mb: 3 }}>
                <Typography variant='caption' color='text.secondary' sx={{ mb: 2, display: 'block' }}>
                  Supported Platforms:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {template.platforms.map(platform => (
                    <Chip
                      key={platform}
                      label={platform}
                      size='small'
                      variant='outlined'
                      sx={{ textTransform: 'capitalize' }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Tone Options */}
              <Box sx={{ mb: 3 }}>
                <Typography variant='caption' color='text.secondary' sx={{ mb: 2, display: 'block' }}>
                  Available Tones:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {template.toneOptions.map(tone => (
                    <Chip
                      key={tone}
                      label={tone}
                      size='small'
                      variant='outlined'
                      sx={{ textTransform: 'capitalize' }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Template Preview */}
              <Box sx={{ mt: 4, mb: 4, p: 2, border: '2px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant='caption' color='text.secondary' sx={{ mb: 1, display: 'block' }}>
                  Template Preview:
                </Typography>
                <Typography variant='body2' sx={{ fontStyle: 'italic', fontSize: '0.875rem' }}>
                  {template.template}
                </Typography>
              </Box>

              {/* Actions */}
              {typeof template.id === 'string' && template.id.startsWith('custom_') && (
                <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                  <Button
                    variant='outlined'
                    fullWidth
                    color='info'
                    onClick={e => {
                      e.stopPropagation()
                      handleEditTemplate(template)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant='outlined'
                    fullWidth
                    color='error'
                    onClick={e => {
                      e.stopPropagation()
                      handleDeleteTemplate(template.id)
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default Template
