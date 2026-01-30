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
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { postsAPI } from 'src/services/socialMediaService'

const RecentPosts = () => {
  const router = useRouter()
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentPosts()
  }, [])

  const fetchRecentPosts = async () => {
    try {
      setLoading(true)
      const response = await postsAPI.getPublishedPosts()
      setRecentPosts(response.data.slice(0, 5)) // Show only last 5 posts
    } catch (error) {
      toast.error('Error fetching recent posts:', error)
      setRecentPosts([
        {
          id: 1,
          content: 'Just launched our new feature! Check it out and let us know what you think.',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          platforms: ['facebook', 'instagram'],
          status: 'published',
          engagement: { likes: 45, comments: 12, shares: 8 }
        },
        {
          id: 2,
          content: 'Monday motivation: The only way to do great work is to love what you do.',
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
          platforms: ['linkedin'],
          status: 'published',
          engagement: { likes: 23, comments: 5, shares: 3 }
        },
        {
          id: 3,
          content: 'Weekend vibes! What are your plans for this beautiful Saturday?',
          publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
          platforms: ['instagram', 'twitter'],
          status: 'failed',
          error: 'Authentication expired'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getPlatformIcon = platform => {
    const icons = {
      facebook: <FacebookIcon sx={{ fontSize: 16 }} />,
      instagram: <InstagramIcon sx={{ fontSize: 16 }} />,
      linkedin: <LinkedInIcon sx={{ fontSize: 16 }} />,
      twitter: <TwitterIcon sx={{ fontSize: 16 }} />
    }

    return icons[platform] || <FacebookIcon sx={{ fontSize: 16 }} />
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

  const getStatusIcon = status => {
    return status === 'published' ? (
      <CheckCircleIcon sx={{ color: 'success.main' }} />
    ) : (
      <ErrorIcon sx={{ color: 'error.main' }} />
    )
  }

  const getStatusColor = status => {
    return status === 'published' ? 'success' : 'error'
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
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Recent Posts
          </Typography>
          <Button size='medium' onClick={() => router.push('/one-page-tabs?tab=post-management')}>
            View All
          </Button>
        </Box>

        <Divider />

        <List sx={{ p: 0 }}>
          {recentPosts.map((post, index) => (
            <Box key={post.id}>
              <ListItem sx={{ px: 0, py: 2 }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: post.status === 'published' ? 'success.light' : 'error.light',
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
                        {post.platforms.map(platform => (
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
                        {format(new Date(post.publishedAt), 'MMM dd, yyyy - HH:mm')}
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

        {recentPosts.length === 0 && !loading && (
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
