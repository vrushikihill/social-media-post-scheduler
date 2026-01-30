import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import DraftsIcon from '@mui/icons-material/Drafts'
import EditIcon from '@mui/icons-material/Edit'
import ErrorIcon from '@mui/icons-material/Error'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import PublishIcon from '@mui/icons-material/Publish'
import ScheduleIcon from '@mui/icons-material/Schedule'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Box, Button, Card, Chip, Divider, Menu, MenuItem, Paper, Tab, Tabs, Typography } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { format, isThisWeek, isToday, isTomorrow } from 'date-fns'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { postsAPI, socialAccountsAPI } from 'src/services/socialMediaService'
import DeleteDialog from './DeleteDialog'
import EditDialog from './EditDialog'
import Filter from './Filter'
import PostList from './PostList'
import CreatePostDialog from './create- dialog/createPostDialog'

const PostManagement = () => {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState([])
  const [open, setOpen] = useState(false)

  const [editFormData, setEditFormData] = useState({
    content: '',
    scheduledAt: null,
    platforms: [],
    mediaFiles: [],
    status: 'draft'
  })

  const filterPosts = useCallback(() => {
    let filtered = [...posts]

    // Filter by tab (status)
    switch (activeTab) {
      case 0: // All
        filtered = posts
        break
      case 1: // Scheduled
        filtered = posts.filter(post => post.status === 'scheduled')
        break
      case 2: // Published
        filtered = posts.filter(post => post.status === 'published')
        break
      case 3: // Failed
        filtered = posts.filter(post => post.status === 'failed')
        break
      case 4: // Drafts
        filtered = posts.filter(post => post.status === 'draft')
        break
      case 5: // Today (Scheduled)
        filtered = posts.filter(
          post => post.status === 'scheduled' && post.scheduledAt && isToday(new Date(post.scheduledAt))
        )
        break
      case 6: // Tomorrow (Scheduled)
        filtered = posts.filter(
          post => post.status === 'scheduled' && post.scheduledAt && isTomorrow(new Date(post.scheduledAt))
        )
        break
      case 7: // This Week (Scheduled)
        filtered = posts.filter(
          post => post.status === 'scheduled' && post.scheduledAt && isThisWeek(new Date(post.scheduledAt))
        )
        break
      default:
        break
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post => post.content.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Filter by platform
    if (platformFilter) {
      filtered = filtered.filter(post => post.platforms.some(p => p.platform === platformFilter))
    }

    // Filter by status (additional filter)
    if (statusFilter) {
      filtered = filtered.filter(post => post.status === statusFilter)
    }

    // Sort by appropriate date based on status
    filtered.sort((a, b) => {
      if (a.status === 'scheduled' && b.status === 'scheduled') {
        return new Date(a.scheduledAt) - new Date(b.scheduledAt) // Earliest scheduled first
      }

      return new Date(b.createdAt) - new Date(a.createdAt) // Newest created first
    })

    setFilteredPosts(filtered)
  }, [posts, activeTab, searchQuery, platformFilter, statusFilter])

  useEffect(() => {
    fetchPosts()
    fetchConnectedAccounts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, activeTab, searchQuery, platformFilter, statusFilter, filterPosts])

  const fetchConnectedAccounts = async () => {
    try {
      const response = await socialAccountsAPI.getAccounts()
      setConnectedAccounts(response.data.filter(account => account.status === 'active'))
    } catch (error) {
      toast.error('Error fetching accounts')
    }
  }

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await postsAPI.getPosts()
      setPosts(response.data)
    } catch (error) {
      toast.error('Error fetching posts')
    } finally {
      setLoading(false)
    }
  }

  const handleEditPost = post => {
    setSelectedPost(post)

    // Map platform data properly
    const platformIds =
      post.platforms
        ?.map(p => {
          // Handle both old format (platform string) and new format (id)
          if (typeof p === 'string') {
            const account = connectedAccounts.find(acc => acc.platform === p)

            return account?.id
          }

          return p.id || p.platform
        })
        .filter(Boolean) || []

    const formData = {
      content: post.content || '',
      scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : null,
      platforms: platformIds,
      mediaFiles: post.mediaFiles || [],
      status: post.status || 'draft'
    }

    setEditFormData(formData)
    setEditDialogOpen(true)
    setMenuAnchor(null)
  }

  const handleDeletePost = post => {
    setSelectedPost(post)
    setDeleteDialogOpen(true)
    setMenuAnchor(null)
  }

  const handleDuplicatePost = async post => {
    try {
      await postsAPI.duplicatePost(post.id)
      toast.success('Post duplicated successfully')
      fetchPosts()
    } catch (error) {
      toast.error('Failed to duplicate post')
    }
    setMenuAnchor(null)
  }

  const handlePublishNow = async post => {
    try {
      await postsAPI.publishNow(post.id)
      toast.success('Post published successfully')
      fetchPosts()
    } catch (error) {
      toast.error('Failed to publish post')
    }
    setMenuAnchor(null)
  }

  const handleRetryPost = async post => {
    try {
      await postsAPI.schedulePost(post.id, { scheduledAt: new Date() })
      toast.success('Post retry initiated')
      fetchPosts()
    } catch (error) {
      toast.error('Failed to retry post')
    }
    setMenuAnchor(null)
  }

  const handlePlatformToggle = accountId => {
    setEditFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(accountId)
        ? prev.platforms.filter(id => id !== accountId)
        : [...prev.platforms, accountId]
    }))
  }

  const handleMediaUpload = async event => {
    if (!event?.target?.files) {
      toast.log('No files selected')

      return
    }

    const files = Array.from(event.target.files)

    if (files.length === 0) return

    try {
      setUploadingMedia(true)

      // Create uploaded files with proper URLs
      const uploadedFiles = files.map((file, index) => {
        const fileUrl = URL.createObjectURL(file)

        return {
          id: Date.now() + index,
          fileName: file.name,
          fileType: file.type.startsWith('image/') ? 'image' : 'video',
          fileUrl: fileUrl,
          url: fileUrl,
          size: file.size,
          file: file // Keep reference to original file
        }
      })

      setEditFormData(prev => {
        const newMediaFiles = [...(prev.mediaFiles || []), ...uploadedFiles]

        return {
          ...prev,
          mediaFiles: newMediaFiles
        }
      })
    } catch (error) {
      toast.error('Failed to upload media files')
    } finally {
      setUploadingMedia(false)
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  const handleRemoveMedia = index => {
    setEditFormData(prev => {
      const newMediaFiles = prev.mediaFiles.filter((_, i) => i !== index)

      return {
        ...prev,
        mediaFiles: newMediaFiles
      }
    })

    toast.success('Media file removed')
  }

  const handleSaveEdit = async () => {
    try {
      await postsAPI.updatePost(selectedPost.id, editFormData)
      toast.success('Post updated successfully')
      setEditDialogOpen(false)
      fetchPosts()
    } catch (error) {
      toast.error('Failed to update post')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await postsAPI.deletePost(selectedPost.id)
      toast.success('Post deleted successfully')
      setDeleteDialogOpen(false)
      fetchPosts()
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const getStatusIcon = status => {
    const icons = {
      scheduled: <ScheduleIcon />,
      published: <CheckCircleIcon />,
      failed: <ErrorIcon />,
      draft: <DraftsIcon />
    }

    return icons[status] || <DraftsIcon />
  }

  const getStatusColor = status => {
    const colors = {
      scheduled: 'warning',
      published: 'success',
      failed: 'error',
      draft: 'primary'
    }

    return colors[status] || 'default'
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

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const getPostDate = post => {
    if (post.status === 'published' && post.publishedAt) {
      return `Published: ${format(new Date(post.publishedAt), 'MMM dd, yyyy HH:mm')}`
    } else if (post.status === 'scheduled' && post.scheduledAt) {
      const scheduledDate = new Date(post.scheduledAt)
      if (isToday(scheduledDate)) {
        return `Today at ${format(scheduledDate, 'HH:mm')}`
      } else if (isTomorrow(scheduledDate)) {
        return `Tomorrow at ${format(scheduledDate, 'HH:mm')}`
      } else {
        return `Scheduled: ${format(scheduledDate, 'MMM dd, yyyy HH:mm')}`
      }
    } else {
      return `Created: ${format(new Date(post.createdAt), 'MMM dd, yyyy HH:mm')}`
    }
  }

  const tabLabels = ['All', 'Scheduled', 'Published', 'Failed', 'Drafts', 'Today', 'Tomorrow', 'This Week']

  const statusCounts = {
    all: posts.length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    published: posts.filter(p => p.status === 'published').length,
    failed: posts.filter(p => p.status === 'failed').length,
    draft: posts.filter(p => p.status === 'draft').length,
    today: posts.filter(p => p.status === 'scheduled' && p.scheduledAt && isToday(new Date(p.scheduledAt))).length,
    tomorrow: posts.filter(p => p.status === 'scheduled' && p.scheduledAt && isTomorrow(new Date(p.scheduledAt)))
      .length,
    thisWeek: posts.filter(p => p.status === 'scheduled' && p.scheduledAt && isThisWeek(new Date(p.scheduledAt))).length
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 600, mb: 1 }}>
              Post Management
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Manage all your social media posts and scheduled content
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant='contained' onClick={() => setOpen(true)}>
              Create New Post
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            mb: 5,
            borderRadius: '12px'
          }}
        >
          <Filter
            setSearchQuery={setSearchQuery}
            setPlatformFilter={setPlatformFilter}
            setStatusFilter={setStatusFilter}
            platformFilter={platformFilter}
            statusFilter={statusFilter}
            searchQuery={searchQuery}
          />
        </Paper>

        {/* Status Tabs */}
        <Card sx={{ mb: 5, pt: 2, borderRadius: '12px' }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
            variant='scrollable'
            scrollButtons='auto'
          >
            {tabLabels.map((label, index) => {
              const count = Object.values(statusCounts)[index]

              return (
                <Tab
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {label}
                      <Chip size='small' label={count} />
                    </Box>
                  }
                />
              )
            })}
          </Tabs>
        </Card>

        {/* Posts List */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: '12px'
          }}
        >
          <PostList
            getPostDate={getPostDate}
            truncateText={truncateText}
            getPlatformColor={getPlatformColor}
            getPlatformIcon={getPlatformIcon}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            filteredPosts={filteredPosts}
            setSelectedPost={setSelectedPost}
            setMenuAnchor={setMenuAnchor}
            searchQuery={searchQuery}
            platformFilter={platformFilter}
            statusFilter={statusFilter}
          />
        </Paper>

        {/* Action Menu */}
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem onClick={() => handleEditPost(selectedPost)}>
            <EditIcon sx={{ mr: 2 }} />
            Edit Post
          </MenuItem>
          <MenuItem onClick={() => handleDuplicatePost(selectedPost)}>
            <ContentCopyIcon sx={{ mr: 2 }} />
            Duplicate
          </MenuItem>
          {selectedPost?.status === 'scheduled' && (
            <MenuItem onClick={() => handlePublishNow(selectedPost)}>
              <PublishIcon sx={{ mr: 2 }} />
              Publish Now
            </MenuItem>
          )}
          {selectedPost?.status === 'failed' && (
            <MenuItem onClick={() => handleRetryPost(selectedPost)}>
              <PublishIcon sx={{ mr: 2 }} />
              Retry Post
            </MenuItem>
          )}
          <Divider />
          <MenuItem
            onClick={() => handleDeletePost(selectedPost)}
            sx={{
              color: 'error.main'
            }}
          >
            <DeleteIcon sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Edit Post Dialog */}
        <EditDialog
          editDialogOpen={editDialogOpen}
          setEditDialogOpen={setEditDialogOpen}
          selectedPost={selectedPost}
          handleSaveEdit={handleSaveEdit}
          loading={loading}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          uploadingMedia={uploadingMedia}
          handleRemoveMedia={handleRemoveMedia}
          handlePlatformToggle={handlePlatformToggle}
          handleMediaUpload={handleMediaUpload}
          connectedAccounts={connectedAccounts}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteDialog
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          selectedPost={selectedPost}
          handleConfirmDelete={handleConfirmDelete}
        />
        <CreatePostDialog open={open} onClose={() => setOpen(false)} />
      </Box>
    </LocalizationProvider>
  )
}

export default PostManagement
