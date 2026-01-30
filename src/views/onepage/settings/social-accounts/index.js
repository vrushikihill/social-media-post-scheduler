import AddIcon from '@mui/icons-material/Add'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Alert, Box, Button, Fade, Grid, Skeleton, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import AccountConnect from './AccountConnect'
import AccountDetailsDialog from './AccountDetailsDialog'
import ConnectDialog from './ConnectDialog'
import DisconnectDialog from './DisconnectDialog'

const PLATFORM_CONFIG = {
  facebook: {
    name: 'facebook',
    label: 'Facebook',
    description: 'Connect your Facebook pages to schedule posts and manage content',
    color: '#1877f2',
    icon: <FacebookIcon />
  },
  'instagram-business': {
    name: 'instagram-business',
    label: 'Instagram',
    description: 'Connect your Instagram business account for seamless content publishing',
    color: '#e4405f',
    icon: <InstagramIcon />
  },
  linkedin: {
    name: 'linkedin',
    label: 'LinkedIn',
    description: 'Connect your LinkedIn profile and company pages for professional content',
    color: '#0077b5',
    icon: <LinkedInIcon />
  },
  twitter: {
    name: 'twitter',
    label: 'Twitter',
    description: 'Connect your Twitter account to schedule tweets and engage with your audience',
    color: '#1da1f2',
    icon: <TwitterIcon />
  }
}

const getPlatformColor = platform => {
  return PLATFORM_CONFIG[platform]?.color || '#1877f2'
}

const getPlatformIcon = platform => {
  return PLATFORM_CONFIG[platform]?.icon || <FacebookIcon />
}

const getStatusColor = status => {
  const colors = {
    active: 'success',
    expired: 'error',
    revoked: 'error',
    pending: 'warning'
  }

  return colors[status] || 'default'
}

export const loginWithFacebook = () => {
  const url =
    `https://www.facebook.com/v19.0/dialog/oauth` +
    `?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}` +
    `&redirect_uri=${encodeURIComponent('http://localhost:4000/auth/facebook/callback')}` +
    `&state=fb_${Date.now()}` +
    `&scope=email,public_profile,pages_show_list,pages_read_engagement`

  window.open(url, 'fb-login', 'width=500,height=600')
}

const SocialAccounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [connectDialogOpen, setConnectDialogOpen] = useState(false)
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [error, setError] = useState(null)

  const availablePlatforms = Object.values(PLATFORM_CONFIG)

  const handleViewDetails = useCallback(account => {
    setSelectedAccount(account)
    setDetailsDialogOpen(true)
  }, [])

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 700, mb: 1 }}>
            Social Media Accounts
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Manage your connected social media platforms and schedule content across multiple channels
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setConnectDialogOpen(true)}
            disabled={loading}
          >
            Connect Account
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && renderLoadingSkeleton()}

      {!loading && accounts.length > 0 && (
        <Fade in timeout={500}>
          <Grid container spacing={3}>
            {accounts.map(account => (
              <Grid item xs={12} md={6} lg={4} key={account.id}>
                <AccountConnect
                  getStatusColor={getStatusColor}
                  getPlatformColor={getPlatformColor}
                  getPlatformIcon={getPlatformIcon}
                  account={account}
                  setSelectedAccount={setSelectedAccount}
                  setDisconnectDialogOpen={setDisconnectDialogOpen}
                  onViewDetails={handleViewDetails}
                />
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}

      <ConnectDialog
        open={connectDialogOpen}
        onClose={() => setConnectDialogOpen(false)}
        availablePlatforms={availablePlatforms}
      />

      <DisconnectDialog
        disconnectDialogOpen={disconnectDialogOpen}
        setDisconnectDialogOpen={setDisconnectDialogOpen}
        selectedAccount={selectedAccount}
      />

      <AccountDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        account={selectedAccount}
        getPlatformColor={getPlatformColor}
        getPlatformIcon={getPlatformIcon}
      />
    </Box>
  )
}

export default SocialAccounts

// Render loading skeleton
const renderLoadingSkeleton = () => (
  <Grid container spacing={3}>
    {[1, 2, 3].map(item => (
      <Grid item xs={12} md={6} lg={4} key={item}>
        <Skeleton variant='rectangular' height={200} sx={{ borderRadius: 3 }} />
      </Grid>
    ))}
  </Grid>
)
