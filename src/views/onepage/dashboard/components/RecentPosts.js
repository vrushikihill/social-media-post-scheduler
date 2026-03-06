import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import {
  Avatar,
  Box,
  Button,
  Chip,
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

const RecentPosts = ({ loading: externalLoading }) => {
  const router = useRouter()
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Use external loading if provided, otherwise use internal
  const isLoading = externalLoading !== undefined ? externalLoading : loading

  useEffect(() => {
    fetchRecentPosts()
  }, [])

  const fetchRecentPosts = async () => {
    try {
      setLoading(true)
      const response = await postsAPI.getPublishedPosts()
      const data = response.data?.data || response.data
      const posts = Array.isArray(data) ? data : []
      setRecentPosts(posts.slice(0, 5))
    } catch (error) {
      // console.error('Error fetching recent posts:', error)
      toast.error('Error fetching recent posts')
      setRecentPosts([])
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

  const getStatusIcon = status => {
    const s = status?.toLowerCase()
    if (s === 'published') return <CheckCircleIcon sx={{ color: 'success.main' }} />
    if (s === 'partial') return <CheckCircleIcon sx={{ color: 'warning.main' }} />

    return <ErrorIcon sx={{ color: 'error.main' }} />
  }

  const getStatusColor = status => {
    const s = status?.toLowerCase()
    if (s === 'published') return 'success'
    if (s === 'partial') return 'warning'

    return 'error'
  }

  const truncateText = (text, maxLength = 50) => {
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
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Recent Posts
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
            : recentPosts.map((post, index) => (
                <Box key={post.id}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            post.status?.toLowerCase() === 'published'
                              ? 'success.light'
                              : post.status?.toLowerCase() === 'partial'
                              ? 'warning.light'
                              : 'error.light',
                          '& svg': {
                            color: 'common.white'
                          }
                        }}
                      >
                        {getStatusIcon(post.status)}
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
                                  width: 24,
                                  height: 24,
                                  bgcolor: getPlatformColor(platform),
                                  color: 'common.white'
                                }}
                              >
                                {getPlatformIcon(platform)}
                              </Avatar>
                            ))}
                          </Box>

                          <Typography variant='caption' color='text.secondary'>
                            {post.publishedAt
                              ? format(new Date(post.publishedAt), 'MMM dd, yyyy - HH:mm')
                              : 'Recently published'}
                          </Typography>

                          {post.engagement && (
                            <Typography variant='caption' color='text.secondary' sx={{ ml: 2 }}>
                              👍 {post.engagement.likes} 💬 {post.engagement.comments} 🔄 {post.engagement.shares}
                            </Typography>
                          )}

                          {post.error && (
                            <Typography variant='caption' color='error.main' display='block'>
                              Error: {post.error}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip label={post.status} size='small' color={getStatusColor(post.status)} variant='outlined' />
                    </Box>
                  </ListItem>

                  {index < recentPosts.length - 1 && <Divider />}
                </Box>
              ))}
        </List>

        {!isLoading && recentPosts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant='body2' color='text.secondary'>
              No recent posts found
            </Typography>
            <Button variant='outlined' sx={{ mt: 2 }} onClick={() => router.push('/one-page-tabs?tab=create-post')}>
              Create Your First Post
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default RecentPosts
