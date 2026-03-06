import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Avatar,
  Alert,
  CircularProgress
} from '@mui/material'
import React, { useState } from 'react'
import WarningIcon from '@mui/icons-material/Warning'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'

const DisconnectDialog = ({
  disconnectDialogOpen,
  setDisconnectDialogOpen,
  handleDisconnectAccount,
  selectedAccount
}) => {
  const [loading, setLoading] = useState(false)

  const getPlatformIcon = platform => {
    const icons = {
      facebook: <FacebookIcon />,
      instagram: <InstagramIcon />,
      'instagram-business': <InstagramIcon />,
      linkedin: <LinkedInIcon />,
      twitter: <TwitterIcon />
    }

    return icons[platform?.toLowerCase()] || <FacebookIcon />
  }

  const getPlatformColor = platform => {
    const colors = {
      facebook: '#1877f2',
      instagram: '#e4405f',
      'instagram-business': '#e4405f',
      linkedin: '#0077b5',
      twitter: '#1da1f2'
    }

    return colors[platform?.toLowerCase()] || '#1877f2'
  }

  const handleDisconnect = async () => {
    setLoading(true)
    try {
      await handleDisconnectAccount()
    } finally {
      setLoading(false)
    }
  }

  if (!selectedAccount) return null

  return (
    <Dialog
      open={disconnectDialogOpen}
      onClose={() => setDisconnectDialogOpen(false)}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <WarningIcon color='error' />
          <Typography variant='h6' color='text.primary'>
            Disconnect Account
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Account Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
            p: 2,
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}
        >
          <Avatar
            sx={{
              bgcolor: getPlatformColor(selectedAccount.platform),
              color: 'common.white',
              width: 48,
              height: 48
            }}
          >
            {getPlatformIcon(selectedAccount.platform)}
          </Avatar>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 600 }} color='text.primary'>
              {selectedAccount.accountName}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ textTransform: 'capitalize' }}>
              {selectedAccount.platform}
            </Typography>
          </Box>
        </Box>

        <Typography variant='body1' sx={{ mb: 2 }} color='text.primary'>
          Are you sure you want to disconnect this account?
        </Typography>

        <Alert severity='warning' sx={{ mb: 2 }}>
          <Typography variant='body2'>
            <strong>This action cannot be undone.</strong> Disconnecting will:
          </Typography>
          <Box component='ul' sx={{ mt: 1, mb: 0, pl: 2 }}>
            <Typography component='li' variant='body2'>
              Remove the account from your connected platforms
            </Typography>
            <Typography component='li' variant='body2'>
              Cancel all {selectedAccount.postsCount} scheduled posts for this account
            </Typography>
            <Typography component='li' variant='body2'>
              Revoke access permissions for this platform
            </Typography>
          </Box>
        </Alert>

        <Typography variant='body2' color='text.secondary'>
          You can reconnect this account later, but you'll need to reschedule any posts.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant='outlined'
          onClick={() => setDisconnectDialogOpen(false)}
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDisconnect}
          color='error'
          variant='contained'
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Disconnecting...' : 'Disconnect'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DisconnectDialog
