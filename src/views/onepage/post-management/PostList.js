import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@mui/material'
import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useRouter } from 'next/router'

const PostList = ({
  getPostDate,
  truncateText,
  getPlatformIcon,
  getPlatformColor,
  getStatusColor,
  getStatusIcon,
  filteredPosts,
  setSelectedPost,
  setMenuAnchor,
  searchQuery,
  platformFilter,
  statusFilter
}) => {
  const router = useRouter()

  return (
    <Box>
      {filteredPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
            No posts found
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            {searchQuery || platformFilter || statusFilter
              ? 'Try adjusting your filters or search query'
              : 'Create your first post to get started'}
          </Typography>
          {!searchQuery && !platformFilter && !statusFilter && (
            <Button variant='contained' onClick={() => router.push('/one-page-tabs?tab=create-post')}>
              Create New Post
            </Button>
          )}
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {filteredPosts.map((post, index) => (
            <Box key={post.id}>
              <ListItem sx={{ py: 3, px: 3 }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${getStatusColor(post.status)}.light`,
                      color: `common.white`,
                      width: 48,
                      height: 48
                    }}
                  >
                    {getStatusIcon(post.status)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box>
                      {/* Status and AI Badge */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={post.status}
                          size='small'
                          color={getStatusColor(post.status)}
                          sx={{ textTransform: 'capitalize' }}
                        />
                        {post.aiGenerated && (
                          <Chip label='AI Generated' size='small' color='secondary' variant='outlined' />
                        )}
                      </Box>

                      {/* Post Content */}
                      <Typography variant='body1' sx={{ mb: 2 }}>
                        {truncateText(post.content)}
                      </Typography>

                      {/* Platforms */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant='caption' color='text.secondary'>
                          Platforms:
                        </Typography>
                        {post.platforms.map((platform, idx) => (
                          <Avatar
                            key={idx}
                            sx={{
                              width: 22,
                              height: 22,
                              bgcolor: getPlatformColor(platform.provider),
                              color: 'common.white'
                            }}
                          >
                            {getPlatformIcon(platform.provider)}
                          </Avatar>
                        ))}
                      </Box>

                      {/* Media Files */}
                      {post.media.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant='caption' color='text.secondary'>
                            Media:
                          </Typography>
                          <Chip
                            size='small'
                            label={`${post.media.length} file(s)`}
                            color='primary'
                            variant='outlined'
                          />
                        </Box>
                      )}

                      {/* Date and Engagement */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant='caption' color='text.secondary'>
                          {getPostDate(post)}
                        </Typography>

                        {post.engagement && (
                          <Typography variant='caption' color='text.secondary'>
                            👍 {post.engagement.likes} 💬 {post.engagement.comments} 🔄 {post.engagement.shares}
                          </Typography>
                        )}
                      </Box>

                      {/* Error Message */}
                      {post.error && (
                        <Alert severity='error' sx={{ mt: 1 }}>
                          <Typography variant='caption'>{post.error}</Typography>
                        </Alert>
                      )}
                    </Box>
                  }
                />

                <ListItemSecondaryAction>
                  <IconButton
                    onClick={e => {
                      setSelectedPost(post)
                      setMenuAnchor(e.currentTarget)
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              {index < filteredPosts.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Box>
  )
}

export default PostList
