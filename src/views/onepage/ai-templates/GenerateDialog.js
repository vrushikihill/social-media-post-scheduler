import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import React from 'react'

const GenerateDialog = ({
  renderFormField,
  handleUseContent,
  handleGenerateContent,
  generateDialogOpen,
  selectedTemplate,
  generatedContent,
  setGeneratedContent,
  setGenerateDialogOpen
}) => {
  return (
    <Dialog open={generateDialogOpen} onClose={() => setGenerateDialogOpen(false)} maxWidth='md' fullWidth>
      <DialogTitle>Generate Content: {selectedTemplate?.name}</DialogTitle>

      <DialogContent>
        <Grid container spacing={4}>
          {/* Form Fields */}
          <Grid item xs={12} md={6}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Fill Template Fields
            </Typography>

            {selectedTemplate?.placeholders.map(renderFormField)}

            <Divider sx={{ my: 3 }} />

            <Typography variant='h6' sx={{ mb: 2 }}>
              Choose Tone
            </Typography>

            <Stack direction='row' spacing={3} flexWrap='wrap'>
              {selectedTemplate?.toneOptions.map(tone => (
                <Button
                  key={tone}
                  variant='outlined'
                  size='medium'
                  onClick={() => handleGenerateContent(tone)}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {tone}
                </Button>
              ))}
            </Stack>
          </Grid>

          {/* Generated Content */}
          <Grid item xs={12} md={6}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Generated Content
            </Typography>

            {generatedContent ? (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  value={generatedContent}
                  onChange={e => setGeneratedContent(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Button variant='contained' fullWidth onClick={handleUseContent}>
                  Use This Content
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: theme => `1px dashed ${theme.palette.divider}`,
                  borderColor: 'grey.300',
                  borderRadius: 1
                }}
              >
                <Typography variant='body2' color='text.secondary'>
                  Fill the fields and choose a tone to generate content
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant='outlined' color='error' onClick={() => setGenerateDialogOpen(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GenerateDialog
