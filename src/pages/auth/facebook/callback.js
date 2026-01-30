import { useEffect } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { oauthHelpers } from 'src/services/socialMediaService'

const FacebookCallback = () => {
  useEffect(() => {
    // Handle the OAuth callback
    oauthHelpers.handleAuthCallback()
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2
      }}
    >
      <CircularProgress size={48} />
      <Typography variant='h6'>Connecting your Facebook account...</Typography>
      <Typography variant='body2' color='text.secondary'>
        Please wait while we complete the authentication process.
      </Typography>
    </Box>
  )
}

export default FacebookCallback
