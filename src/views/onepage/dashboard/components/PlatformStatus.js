import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Avatar, Box, Button, Chip, Divider, Grid, Paper, Skeleton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { socialAccountsAPI } from 'src/services/socialMediaService'

const PlatformStatus = ({ loading: externalLoading }) => {
  const [platforms, setPlatforms] = useState([])
  const [loading, setLoading] = useState(true)

  // Use external loading if provided, otherwise use internal
  const isLoading = externalLoading !== undefined ? externalLoading : loading

  useEffect(() => {
    fetchPlatformStatus()
  }, [])

  const fetchPlatformStatus = async () => {
    try {
      setLoading(true)
      const response = await socialAccountsAPI.getAccounts()
      setPlatforms(response.data?.data || response.data)
    } catch (error) {
      // console.error('Error fetching platform status:', error)
      toast.error('Error fetching platform status')
      setPlatforms([])
    } finally {
      setLoading(false)
    }
  }

  const getPlatformIcon = platform => {
    const icons = {
      facebook: <FacebookIcon />,
      instagram: <InstagramIcon />,
      'instagram-business': <InstagramIcon />,
      linkedin: <LinkedInIcon />,
      twitter: <TwitterIcon />
    }

    return icons[platform] || <FacebookIcon />
  }

  const getPlatformColor = platform => {
    const colors = {
      facebook: '#1877f2',
      instagram: '#e4405f',
      'instagram-business': '#e4405f',
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
          {isLoading
            ? [1, 2, 3, 4].map(i => (
                <Grid item xs={12} sm={6} key={i}>
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
                    <Skeleton variant='circular' width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant='text' width='60%' height={24} />
                      <Skeleton variant='text' width='40%' height={16} />
                    </Box>
                    <Skeleton variant='rectangular' width={60} height={24} sx={{ borderRadius: 1 }} />
                  </Box>
                </Grid>
              ))
            : platforms.map(platform => (
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
                        bgcolor: getPlatformColor(platform.platform || platform.provider),
                        color: 'common.white',
                        width: 40,
                        height: 40
                      }}
                    >
                      {getPlatformIcon(platform.platform || platform.provider)}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                          {platform.accountName || platform.name || 'Social Account'}
                        </Typography>
                      </Box>

                      <Typography variant='caption' color='text.secondary' display='block'>
                        Last sync: {platform.lastSync || 'Recently'}
                      </Typography>

                      <Typography variant='caption' color='text.secondary'>
                        {(platform._count?.scheduledPosts || 0) + ' posts scheduled'}
                      </Typography>
                    </Box>
                    <Chip
                      label={platform.status?.toLowerCase() || 'connected'}
                      size='small'
                      color={getStatusColor(platform.status?.toLowerCase())}
                      variant='outlined'
                    />
                  </Box>
                </Grid>
              ))}
        </Grid>

        {!isLoading && platforms.length === 0 && (
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
