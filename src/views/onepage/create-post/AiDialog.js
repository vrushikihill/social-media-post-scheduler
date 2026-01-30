import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material'
import React from 'react'
import toast from 'react-hot-toast'

const AiDialog = ({ handleAIGenerate, aiDialogOpen, setAiDialogOpen }) => {
  return (
    <div>
      <Dialog open={aiDialogOpen} onClose={() => setAiDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Generate Content with AI</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder='Describe what you want to post about...'
            sx={{ mb: 3 }}
            id='ai-prompt'
          />

          <Typography variant='subtitle2' sx={{ mb: 1 }}>
            Tone:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['Professional', 'Casual', 'Friendly', 'Exciting', 'Informative'].map(tone => (
              <Chip
                key={tone}
                label={tone}
                clickable
                onClick={() => {
                  const prompt = document.getElementById('ai-prompt').value
                  if (prompt.trim()) {
                    handleAIGenerate(prompt, tone.toLowerCase())
                  } else {
                    toast.error('Please enter a prompt first')
                  }
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => setAiDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AiDialog
