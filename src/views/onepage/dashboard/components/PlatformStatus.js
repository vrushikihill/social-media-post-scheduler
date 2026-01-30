import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Avatar, Box, Button, Chip, Divider, Grid, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { socialAccountsAPI } from 'src/services/socialMediaService'

const PlatformStatus = () => {
  const [platforms, setPlatforms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlatformStatus()
  }, [])

  const fetchPlatformStatus = async () => {
    try {
      setLoading(true)
      const response = await socialAccountsAPI.getAccounts()
      setPlatforms(response.data)
    } catch (error) {
      toast.error('Error fetching platform status:', error)
      setPlatforms([
        {
          id: 1,
          platform: 'facebook',
          accountName: 'My Business Page',
          status: 'active',
          lastSync: '2 hours ago',
          postsCount: 12
        },
        {
          id: 2,
          platform: 'instagram',
          accountName: '@mybusiness',
          status: 'active',
          lastSync: '1 hour ago',
          postsCount: 8
        },
        {
          id: 3,
          platform: 'linkedin',
          accountName: 'Company Page',
          status: 'expired',
          lastSync: '2 days ago',
          postsCount: 5
        },
        {
          id: 4,
          platform: 'twitter',
          accountName: '@mybusiness',
          status: 'active',
          lastSync: '30 minutes ago',
          postsCount: 15
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getPlatformIcon = platform => {
    const icons = {
      facebook: <FacebookIcon />,
      instagram: <InstagramIcon />,
      linkedin: <LinkedInIcon />,
      twitter: <TwitterIcon />
    }

    return icons[platform] || <FacebookIcon />
  }

  const getPlatformColor = platform => {
    const colors = {
      facebook: '#1877f2',
      instagram: '#e4405f',
      linkedin: '#0077b5',
      twitter: '#1da1f2'
    }

    return colors[platform] || '#1877f2'
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

  return (
    <Paper
      elevation={2}
      sx={{
        p: 5,
        pt: 4,
        borderRadius: '12px',
        height: '100%'
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: 500 }}>
            Connected Platforms
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          {platforms.map(platform => (
            <Grid item xs={12} sm={6} key={platform.id}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: getPlatformColor(platform.platform),
                    color: 'common.white',
                    width: 40,
                    height: 40
                  }}
                >
                  {getPlatformIcon(platform.platform)}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                      {platform.accountName}
                    </Typography>
                  </Box>

                  <Typography variant='caption' color='text.secondary' display='block'>
                    Last sync: {platform.lastSync}
                  </Typography>

                  <Typography variant='caption' color='text.secondary'>
                    {platform.postsCount} posts scheduled
                  </Typography>
                </Box>
                <Chip label={platform.status} size='small' color={getStatusColor(platform.status)} variant='outlined' />
              </Box>
            </Grid>
          ))}
        </Grid>

        {platforms.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant='body2' color='text.secondary'>
              No platforms connected yet
            </Typography>
            <Button variant='outlined' sx={{ mt: 2 }}>
              Connect Your First Platform
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default PlatformStatus
