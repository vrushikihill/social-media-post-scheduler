import InfoIcon from '@mui/icons-material/Info'
import SecurityIcon from '@mui/icons-material/Security'
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import api from 'utils/api'

const ConnectDialog = ({ open, onClose, availablePlatforms }) => {
  const [connecting, setConnecting] = useState(null)
  const [error, setError] = useState(null)
  const [connected, setConnected] = useState([])

  const fetchConnected = async () => {
    const res = await api.get('/v1/auth-social-media/connected')

    const { data } = res.data
    setConnected(data.map(x => x.provider))
  }

  useEffect(() => {
    if (!connecting) return

    const interval = setInterval(() => {
      fetchConnected()
    }, 5000)

    return () => clearInterval(interval)
  }, [connecting])

  useEffect(() => {
    if (!connecting) return

    const isNowConnected = connected.some(
      item => item === connecting // adjust based on your data
    )

    if (isNowConnected) {
      setConnecting(null) // this automatically stops polling
    }
  }, [connected, connecting])

  useEffect(() => {
    if (!open) return
    fetchConnected()
  }, [open])

  const handleConnect = platform => {
    setConnecting(platform)
    setError(null)

    const token = localStorage.getItem('token')

    const popup = window.open(
      `${process.env.BACKEND_API_URL}/v1/auth-social-media/${platform}/start?token=${token}`,
      `${platform}-oauth`,
      'width=1000,height=800'
    )

    if (!popup) {
      setError('Popup blocked by browser')
      setConnecting(null)

      return
    }
  }

  const getPlatformPermissions = platform => {
    const permissions = {
      facebook: [
        'Manage and publish posts to your Facebook pages',
        'Read engagement metrics and insights',
        'Access your Facebook pages list'
      ],
      'instagram-business': [
        'Publish posts to your Instagram business account',
        'Access basic profile information',
        'Read engagement metrics'
      ],
      linkedin: [
        'Publish posts to your LinkedIn profile and company pages',
        'Access basic profile information',
        'Read engagement metrics'
      ],
      twitter: ['Publish tweets on your behalf', 'Read your profile information', 'Access engagement metrics']
    }

    return permissions[platform] || []
  }

  useEffect(() => {
    const handler = event => {
      if (event.origin !== window.location.origin) return

      if (event.data?.type === 'OAUTH_SUCCESS') {
        setConnecting(null)
        setConnected(prev => [...new Set([...prev, event.data.provider])])
      }

      if (event.data?.type === 'OAUTH_ERROR') {
        setConnecting(null)
        setError(event.data.error || 'Authentication failed')
      }
    }

    window.addEventListener('message', handler)

    return () => window.removeEventListener('message', handler)
  }, [])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SecurityIcon color='primary' />
          <Typography variant='h6'>Connect Social Media Account</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity='info' sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon fontSize='small' />
            <Typography variant='body2'>
              You'll be redirected to authenticate securely with the platform. We only request necessary permissions.
            </Typography>
          </Box>
        </Alert>

        {error && (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <List sx={{ p: 0 }}>
          {availablePlatforms.map((platform, index) => {
            const isConnected = connected.includes(platform.name)

            return (
              <React.Fragment key={platform.name}>
                <ListItem
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 2,
                    p: 3,
                    cursor: connecting ? 'not-allowed' : 'pointer',
                    opacity: connecting && connecting !== platform.name ? 0.5 : 1,
                    '&:hover': {
                      bgcolor: connecting ? 'transparent' : 'action.hover',
                      borderColor: connecting ? 'divider' : platform.color
                    }
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: platform.color,
                        color: 'common.white',
                        width: 48,
                        height: 48
                      }}
                    >
                      {platform.icon}
                    </Avatar>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        {platform.label}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                          {platform.description}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Permissions requested:
                        </Typography>
                        <Box component='ul' sx={{ m: 0, pl: 2 }}>
                          {getPlatformPermissions(platform.name).map((permission, idx) => (
                            <Typography
                              key={idx}
                              component='li'
                              variant='caption'
                              color='text.secondary'
                              sx={{ fontSize: '0.7rem' }}
                            >
                              {permission}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    }
                  />

                  <Button
                    variant={isConnected ? 'outlined' : 'contained'}
                    onClick={() => !isConnected && handleConnect(platform.name)}
                    disabled={connecting !== null || isConnected}
                  >
                    {connecting === platform.name ? (
                      <CircularProgress size={20} color='inherit' />
                    ) : isConnected ? (
                      'Connected'
                    ) : (
                      'Connect'
                    )}
                  </Button>
                </ListItem>
                {index < availablePlatforms.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            )
          })}
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          <Button variant='outlined' onClick={onClose} disabled={connecting !== null}>
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ConnectDialog
