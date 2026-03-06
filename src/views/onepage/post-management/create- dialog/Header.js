import React from 'react'
import { Box, Button, IconButton, Typography } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CloseIcon from '@mui/icons-material/Close'

export const Header = ({
  showPreview,
  setShowPreview,
  onClose,
  onAIAssistantClick,
  onTemplateClick,
  isSubmitting
}) => {
  return (
    <Box
      sx={{
        p: 2,
        pb: 2,
        borderBottom: theme => `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'background.paper',
        flexShrink: 0
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant='h6' fontWeight={600} color='text.primary'>
          Create Post
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Button size='small' variant='outlined' onClick={onTemplateClick} disabled={isSubmitting}>
          Templates
        </Button>
        <Button
          size='small'
          variant='outlined'
          startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
          onClick={onAIAssistantClick}
          disabled={isSubmitting}
        >
          AI Assistant
        </Button>
        <Button
          size='small'
          variant={showPreview ? 'contained' : 'text'}
          color={showPreview ? 'primary' : 'inherit'}
          onClick={() => setShowPreview(!showPreview)}
          sx={{ color: !showPreview ? 'text.secondary' : undefined }}
          disabled={isSubmitting}
        >
          Preview
        </Button>
        <IconButton
          onClick={onClose}
          disabled={isSubmitting}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  )
}
