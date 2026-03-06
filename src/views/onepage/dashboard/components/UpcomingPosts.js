import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import ScheduleIcon from '@mui/icons-material/Schedule'
import TwitterIcon from '@mui/icons-material/Twitter'
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { postsAPI } from 'src/services/socialMediaService'

const UpcomingPosts = ({ loading: externalLoading }) => {
  const router = useRouter()
  const [upcomingPosts, setUpcomingPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Use external loading if provided, otherwise use internal
  const isLoading = externalLoading !== undefined ? externalLoading : loading

  useEffect(() => {
    fetchUpcomingPosts()
  }, [])

  const fetchUpcomingPosts = async () => {
    try {
      setLoading(true)
      const response = await postsAPI.getScheduledPosts()
      const data = response.data?.data || response.data
      const posts = Array.isArray(data) ? data : []
      setUpcomingPosts(posts.slice(0, 5))
    } catch (error) {
      // console.error('Error fetching upcoming posts:', error)
      toast.error('Error fetching upcoming posts')
      setUpcomingPosts([])
    } finally {
      setLoading(false)
    }
  }

  const getPlatformIcon = platform => {
    const icons = {
      facebook: <FacebookIcon sx={{ fontSize: 16 }} />,
      instagram: <InstagramIcon sx={{ fontSize: 16 }} />,
      'instagram-business': <InstagramIcon sx={{ fontSize: 16 }} />,
      linkedin: <LinkedInIcon sx={{ fontSize: 16 }} />,
      twitter: <TwitterIcon sx={{ fontSize: 16 }} />
    }

    return icons[platform] || <FacebookIcon sx={{ fontSize: 16 }} />
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

  const truncateText = (text, maxLength = 60) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
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
            Upcoming Posts
          </Typography>
          <Button size='medium' onClick={() => router.push('/one-page-tabs?tab=post-management')}>
            View All
          </Button>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {isLoading
            ? [1, 2, 3, 4, 5].map(i => (
                <Box key={i}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemAvatar>
                      <Skeleton variant='circular' width={40} height={40} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Skeleton variant='text' width='80%' />}
                      secondary={<Skeleton variant='text' width='40%' />}
                    />
                  </ListItem>
                  <Divider />
                </Box>
              ))
            : upcomingPosts.map((post, index) => (
                <Box key={post.id}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light', color: 'common.white' }}>
                        <ScheduleIcon />
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant='body2' sx={{ mb: 1 }}>
                            {truncateText(post.content)}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {(Array.isArray(post.platforms)
                              ? post.platforms
                              : typeof post.platforms === 'string'
                              ? JSON.parse(post.platforms)
                              : []
                            ).map(platform => (
                              <Avatar
                                key={platform}
                                sx={{
                                  width: 22,
                                  height: 22,
                                  bgcolor: getPlatformColor(platform),
                                  color: 'common.white'
                                }}
                              >
                                {getPlatformIcon(platform)}
                              </Avatar>
                            ))}
                          </Box>

                          <Typography variant='caption' color='text.secondary'>
                            {post.scheduledAt
                              ? format(new Date(post.scheduledAt), 'MMM dd, yyyy - HH:mm')
                              : 'Scheduled'}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>

                  {index < upcomingPosts.length - 1 && <Divider />}
                </Box>
              ))}
        </List>

        {!isLoading && upcomingPosts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant='body2' color='text.secondary'>
              No upcoming posts scheduled
            </Typography>
            <Button variant='outlined' sx={{ mt: 2 }} onClick={() => router.push('/one-page-tabs?tab=post-management')}>
              Schedule Your First Post
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default UpcomingPosts
