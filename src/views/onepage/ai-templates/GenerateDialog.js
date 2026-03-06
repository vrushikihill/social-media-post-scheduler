import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SmartToyIcon from '@mui/icons-material/SmartToy'
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
  Typography,
  CircularProgress,
  Chip
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import React from 'react'

const GenerateDialog = ({
  handleUseContent,
  handleGenerateContent,
  generateDialogOpen,
  selectedTemplate,
  generatedContent,
  setGeneratedContent,
  setGenerateDialogOpen,
  loading,
  selectedTone,
  setSelectedTone,
  getCategoryColor,
  getCategoryIcon
}) => {
  const theme = useTheme()
  const categoryColor = selectedTemplate ? getCategoryColor(selectedTemplate.category) : theme.palette.primary.main

  return (
    <Dialog
      open={generateDialogOpen}
      onClose={() => setGenerateDialogOpen(false)}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 500 }}>
        {/* Left Studio Sidebar */}
        <Box
          sx={{
            flex: { md: '0 0 320px' },
            bgcolor: theme.palette.mode === 'light' ? '#F8FAFC' : theme.palette.customColors.bodyBg,
            borderRight: '1px solid',
            borderColor: 'divider',
            p: 6,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 8 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'white',
                color: categoryColor,
                boxShadow: `0 10px 15px -3px ${categoryColor}25, 0 4px 6px -2px ${categoryColor}10`,
                mb: 4,
                fontSize: '1.5rem'
              }}
            >
              {selectedTemplate && getCategoryIcon(selectedTemplate.category)}
            </Box>
            <Typography variant='h5' sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.02em' }}>
              {selectedTemplate?.name}
            </Typography>
            <Typography
              variant='caption'
              sx={{
                color: categoryColor,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                px: 2,
                py: 0.5,
                bgcolor: `${categoryColor}10`,
                borderRadius: '6px'
              }}
            >
              {selectedTemplate?.category?.replace('_', ' ')}
            </Typography>
          </Box>

          {/* Description */}
          <Typography variant='body2' sx={{ color: 'text.secondary', mb: 8, lineHeight: 1.6, fontStyle: 'italic' }}>
            "{selectedTemplate?.description}"
          </Typography>

          {/* Tones Section */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant='overline'
              sx={{ color: 'text.disabled', fontWeight: 800, mb: 3, display: 'block', letterSpacing: '0.05em' }}
            >
              Refine Your Style
            </Typography>
            <Stack spacing={2}>
              {selectedTemplate?.toneOptions.map(tone => {
                const isActive = selectedTone === tone

                return (
                  <Box
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    sx={{
                      p: 3,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: isActive ? categoryColor : 'transparent',
                      bgcolor: isActive ? 'background.paper' : 'transparent',
                      boxShadow: isActive ? `0 4px 12px ${categoryColor}15` : 'none',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        bgcolor: isActive ? 'background.paper' : 'action.hover',
                        borderColor: isActive ? categoryColor : 'divider'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: isActive ? categoryColor : 'text.disabled',
                        transition: 'all 0.2s'
                      }}
                    />
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'text.primary' : 'text.secondary',
                        textTransform: 'capitalize'
                      }}
                    >
                      {tone}
                    </Typography>
                  </Box>
                )
              })}
            </Stack>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, p: 6, display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
          {/* Action Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AutoAwesomeIcon sx={{ color: 'warning.main', fontSize: '1.25rem' }} />
              <Typography variant='subtitle1' sx={{ fontWeight: 700, color: 'text.primary' }}>
                AI Creative Studio
              </Typography>
            </Box>
            <Button
              onClick={() => setGenerateDialogOpen(false)}
              sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' }, minWidth: 'auto', p: 1 }}
            >
              <Box sx={{ fontWeight: 800 }}>✕</Box>
            </Button>
          </Box>

          {/* Result Card */}
          <Box
            sx={{
              flexGrow: 1,
              borderRadius: '20px',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: theme.palette.mode === 'light' ? '#FBFDFF' : theme.palette.customColors.bodyBg,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Editor Top Bar */}
            <Box
              sx={{
                px: 4,
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(47, 51, 73, 0.5)'
              }}
            >
              <Typography variant='caption' sx={{ fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase' }}>
                {loading ? 'AI IS BRAINSTORMING...' : 'DRAFT VIEW'}
              </Typography>
              {selectedTone && !loading && (
                <Chip
                  label={`${selectedTone} tone active`}
                  size='small'
                  sx={{
                    height: 22,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    bgcolor: `${categoryColor}10`,
                    color: categoryColor,
                    border: 'none'
                  }}
                />
              )}
            </Box>

            {/* Input Overlay when loading */}
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 10,
                  bgcolor: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3
                }}
              >
                <CircularProgress size={48} thickness={5} sx={{ color: categoryColor }} />
                <Typography variant='body1' sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center' }}>
                  Crafting your masterpiece...
                </Typography>
              </Box>
            )}

            <TextField
              fullWidth
              multiline
              rows={12}
              value={generatedContent}
              onChange={e => setGeneratedContent(e.target.value)}
              placeholder='Select a tone and hit Generate...'
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiInputBase-root': {
                  p: 6,
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  fontFamily: "'Inter', sans-serif",
                  color: 'text.primary'
                }
              }}
            />

            {/* Bottom Actions */}
            <Box
              sx={{
                p: 6,
                pt: 0,
                mt: 'auto'
              }}
            >
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Button
                  variant='contained'
                  fullWidth
                  onClick={handleGenerateContent}
                  disabled={loading || !selectedTone}
                  sx={{
                    borderRadius: '14px',
                    py: 3,
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    letterSpacing: '0.025em',
                    bgcolor: selectedTone ? categoryColor : 'action.disabledBackground',
                    color: selectedTone ? 'white' : 'text.disabled',
                    boxShadow: selectedTone ? `0 10px 15px -3px ${categoryColor}40` : 'none',
                    '&:hover': {
                      bgcolor: selectedTone ? categoryColor : '#E2E8F0',
                      transform: selectedTone ? 'translateY(-2px)' : 'none',
                      boxShadow: selectedTone ? `0 20px 25px -5px ${categoryColor}40` : 'none'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SmartToyIcon sx={{ fontSize: '1.25rem' }} />
                    {loading ? 'GENERATING...' : 'ENHANCE WITH AI'}
                  </Box>
                  {!loading && selectedTone && (
                    <Typography variant='caption' sx={{ opacity: 0.8, fontSize: '0.65rem' }}>
                      Using {selectedTone} tone
                    </Typography>
                  )}
                </Button>

                {generatedContent && !loading && (
                  <Button
                    variant='contained'
                    fullWidth
                    onClick={handleUseContent}
                    sx={{
                      borderRadius: '14px',
                      py: 3,
                      fontWeight: 800,
                      fontSize: '0.875rem',
                      letterSpacing: '0.025em',
                      bgcolor: theme.palette.mode === 'light' ? '#1E293B' : 'primary.main',
                      color: 'white',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'light' ? '#0F172A' : 'primary.dark',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    READY TO POST
                  </Button>
                )}
              </Box>
              {!selectedTone && !loading && (
                <Typography variant='caption' sx={{ display: 'block', mt: 3, textAlign: 'center', color: 'text.disabled', fontWeight: 600 }}>
                  ← Pick a style on the left to unlock AI magic
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}

export default GenerateDialog
