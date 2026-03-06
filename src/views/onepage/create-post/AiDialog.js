import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
  Fade
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import CloseIcon from '@mui/icons-material/Close'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

const AiDialog = ({ handleAIGenerate, aiDialogOpen, setAiDialogOpen, onApplyContent }) => {
  const theme = useTheme()
  const primaryColor = theme.palette.primary.main
  
  const [prompt, setPrompt] = useState('')
  const [selectedTone, setSelectedTone] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedResult, setGeneratedResult] = useState('')
  const [showResult, setShowResult] = useState(false)

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!aiDialogOpen) {
      // Small delay to prevent layout jump during close animation
      setTimeout(() => {
        setPrompt('')
        setSelectedTone('')
        setGeneratedResult('')
        setShowResult(false)
        setLoading(false)
      }, 200)
    }
  }, [aiDialogOpen])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe what you want to post about')
      return
    }
    if (!selectedTone) {
      toast.error('Please select a tone')
      return
    }
    
    setLoading(true)
    const result = await handleAIGenerate(prompt, selectedTone.toLowerCase())
    setLoading(false)
    
    if (result) {
      setGeneratedResult(result)
      setShowResult(true)
    }
  }

  const tones = [
    { label: 'Professional', color: '#3B82F6' },
    { label: 'Casual', color: '#10B981' },
    { label: 'Friendly', color: '#F59E0B' },
    { label: 'Exciting', color: '#EF4444' },
    { label: 'Informative', color: '#8B5CF6' }
  ]

  return (
    <Dialog 
      open={aiDialogOpen} 
      onClose={() => setAiDialogOpen(false)} 
      maxWidth={showResult ? 'md' : 'sm'} 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          transition: 'max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }}
    >
      {/* Dynamic Header */}
      <Box sx={{ 
        p: 4, 
        borderBottom: '1px solid',
        borderColor: '#F1F5F9',
        color: '#1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            width: 44, 
            height: 44, 
            borderRadius: '12px', 
            bgcolor: `${primaryColor}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AutoAwesomeIcon sx={{ color: primaryColor }} />
          </Box>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              Creative Assistant
            </Typography>
            <Typography variant='caption' sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AI Studio Powered
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={() => setAiDialogOpen(false)} sx={{ color: '#94A3B8', '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' } }}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 400 }}>
        {/* Input Section */}
        <Box sx={{ 
          flex: showResult ? '0 0 320px' : '1', 
          p: 5, 
          bgcolor: showResult ? '#F8FAFC' : 'white',
          borderRight: showResult ? '1px solid #E2E8F0' : 'none',
          transition: 'all 0.3s'
        }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 800, color: '#1E293B' }}>
              Post Inspiration
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={showResult ? 3 : 5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='What should we talk about today?'
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  bgcolor: 'white',
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: '#CBD5E1' },
                  '&.Mui-focused fieldset': { borderColor: primaryColor, borderWidth: '2px' }
                },
                '& .MuiInputBase-input': { p: 1, fontSize: '0.95rem' }
              }}
            />
          </Box>

          <Box>
            <Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 800, color: '#1E293B' }}>
              Desired Vibe
            </Typography>
            <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
              {tones.map(({ label, color }) => {
                const active = selectedTone === label
                return (
                  <Box
                    key={label}
                    onClick={() => setSelectedTone(label)}
                    sx={{
                      px: 2.5,
                      py: 0.8,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: '1.5px solid',
                      borderColor: active ? color : '#F1F5F9',
                      bgcolor: active ? `${color}10` : '#F8FAFC',
                      color: active ? color : '#64748B',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: active ? color : '#CBD5E1',
                        bgcolor: active ? `${color}15` : '#F1F5F9'
                      }
                    }}
                  >
                    {label}
                  </Box>
                )
              })}
            </Stack>
          </Box>

          {!showResult && (
            <Button 
              fullWidth
              variant='contained' 
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || !selectedTone}
              startIcon={loading ? <CircularProgress size={20} color='inherit' /> : <SmartToyIcon />}
              sx={{ 
                mt: 6,
                borderRadius: '14px',
                py: 2,
                fontWeight: 800,
                textTransform: 'none',
                bgcolor: primaryColor,
                '&:hover': { bgcolor: theme.palette.primary.dark },
                boxShadow: `0 10px 15px -3px ${primaryColor}30`
              }}
            >
              {loading ? 'Crafting Content...' : 'Generate with AI'}
            </Button>
          )}
        </Box>

        {/* Result Section */}
        {showResult && (
          <Fade in={showResult}>
            <Box sx={{ flex: 1, p: 5, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NoteAddIcon sx={{ color: primaryColor, fontSize: '1.2rem' }} />
                  <Typography variant='subtitle1' sx={{ fontWeight: 800, color: '#1E293B' }}>
                    AI Result
                  </Typography>
                </Box>
                <Chip 
                  label={`${selectedTone} tone`} 
                  size='small' 
                  sx={{ 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    fontSize: '0.65rem',
                    bgcolor: `${primaryColor}10`,
                    color: primaryColor
                  }} 
                />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={10}
                value={generatedResult}
                onChange={(e) => setGeneratedResult(e.target.value)}
                sx={{ 
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    bgcolor: '#FBFDFF',
                    p: 3,
                    border: '1px solid #E2E8F0',
                    '& fieldset': { border: 'none' }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    color: '#334155'
                  }
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button 
                  fullWidth
                  variant='outlined'
                  onClick={handleGenerate}
                  disabled={loading}
                  sx={{ borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
                >
                  Regenerate
                </Button>
                <Button 
                  fullWidth
                  variant='contained'
                  onClick={() => onApplyContent(generatedResult)}
                  sx={{ 
                    borderRadius: '12px', 
                    fontWeight: 800, 
                    textTransform: 'none',
                    bgcolor: '#1E293B',
                    '&:hover': { bgcolor: 'black' }
                  }}
                >
                  Use Content
                </Button>
              </Box>
            </Box>
          </Fade>
        )}
      </Box>
    </Dialog>
  )
}

export default AiDialog
