import React from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

export const Footer = ({ onSubmit, disabled, isSubmitting, isScheduled, invalidImages }) => {
  return (
    <Box
      sx={{
        borderTop: theme => `1px solid ${theme.palette.divider}`,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        bgcolor: 'background.paper',
        flexShrink: 0
      }}
    >
      {/* Invalid Images Warning */}
      {invalidImages && invalidImages.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'warning.main' }} />
          <Typography variant='caption' color='warning.main'>
            {invalidImages.length} image(s) have invalid aspect ratios for the selected platforms. Please upload images
            with correct aspect ratios.
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant='contained'
          onClick={onSubmit}
          disabled={disabled || isSubmitting}
          startIcon={isSubmitting && <CircularProgress size={16} color='inherit' />}
        >
          {isSubmitting ? (isScheduled ? 'Scheduling...' : 'Posting...') : isScheduled ? 'Schedule Post' : 'Post Now'}
        </Button>
      </Box>
    </Box>
  )
}
