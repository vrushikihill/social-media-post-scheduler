import { Box, Button, Chip, Divider, Grid, IconButton, Paper, TextField, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import React from 'react'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import ImageIcon from '@mui/icons-material/Image'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import DeleteIcon from '@mui/icons-material/Delete'

const Content = ({
  handleRemoveMedia,
  handleMediaUpload,
  characterCounts,
  formData,
  setFormData,
  setAiDialogOpen,
  handleSave,
  setTemplateDialogOpen,
  loading
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 5,
        pt: 4,
        borderRadius: '12px'
      }}
    >
      <Box>
        {/* Content Input */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant='h6'>Post Content</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant='outlined'
                startIcon={<SmartToyIcon />}
                onClick={() => setTemplateDialogOpen(true)}
                size='medium'
              >
                Use Template
              </Button>
              <Button
                variant='outlined'
                startIcon={<SmartToyIcon />}
                onClick={() => setAiDialogOpen(true)}
                size='medium'
              >
                AI Generate
              </Button>
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="What's on your mind?"
            value={formData.content}
            onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
            sx={{ mb: 2 }}
          />

          {/* Character Counts */}
          {Object.keys(characterCounts).length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {Object.entries(characterCounts).map(([platform, count]) => (
                <Chip
                  key={platform}
                  label={`${platform}: ${count.current}/${count.limit}`}
                  color={count.remaining < 0 ? 'error' : count.remaining < 50 ? 'warning' : 'default'}
                  size='small'
                />
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Media Upload */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Media Files
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
            <Button variant='outlined' startIcon={<ImageIcon />} component='label' disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Images'}
              <input type='file' hidden multiple accept='image/*' onChange={handleMediaUpload} disabled={loading} />
            </Button>

            <Button variant='outlined' startIcon={<VideoLibraryIcon />} component='label' disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Videos'}
              <input type='file' hidden multiple accept='video/*' onChange={handleMediaUpload} disabled={loading} />
            </Button>
          </Box>

          {/* Media Preview */}
          {Array.isArray(formData.mediaFiles) && formData.mediaFiles.length > 0 && (
            <Grid container spacing={2}>
              {formData.mediaFiles.map((file, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Paper sx={{ p: 1, position: 'relative' }}>
                    {file && (file.fileType === 'image/jpeg' || file.fileType === 'image/png') && file.fileUrl ? (
                      <img
                        src={file.previewUrl || file.fileUrl}
                        alt={file.fileName || 'media'}
                        style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4 }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: 100,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'grey.100',
                          borderRadius: 1
                        }}
                      >
                        <VideoLibraryIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                      </Box>
                    )}
                    <IconButton
                      size='small'
                      sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper' }}
                      onClick={() => handleRemoveMedia(index)}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Scheduling */}
        <Box>
          <Typography variant='h6' sx={{ mb: 3 }}>
            Schedule Post
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <DateTimePicker
              label='Schedule Date & Time'
              value={formData.scheduledAt}
              onChange={newValue => setFormData(prev => ({ ...prev, scheduledAt: newValue }))}
              minDateTime={new Date()}
              slotProps={{
                textField: {
                  size: 'small'
                }
              }}
            />

            {formData.scheduledAt && (
              <Box>
                <Button variant='contained' startIcon={<ScheduleIcon />} onClick={() => handleSave('scheduled')}>
                  Schedule Post
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default Content
