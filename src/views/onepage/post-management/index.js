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
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { format, isToday, isTomorrow } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { socialAccountsAPI } from 'src/services/socialMediaService'
import DeleteDialog from './DeleteDialog'
import EditDialog from './EditDialog'
import Filter from './Filter'
import PostList from './PostList'
import CreatePostDialog from './create- dialog/createPostDialog'
import api from 'utils/api'

const PostManagement = () => {
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

  console.log(posts, 'posts')

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const [counts, setCounts] = useState({
    all: 0,
    scheduled: 0,
    published: 0,
    failed: 0,
    drafts: 0,
    today: 0,
    tomorrow: 0,
    thisWeek: 0
  })

  const [editFormData, setEditFormData] = useState({
    content: '',
    scheduledAt: null,
    platforms: [],
    mediaFiles: [],
    status: 'CANCELLED'
  })

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }))
  }

  const filterPosts = useCallback(() => {
    // Since filtering is now handled by the API, we just set the filtered posts to the current posts
    setFilteredPosts(posts)
  }, [posts])

  useEffect(() => {
    fetchConnectedAccounts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, filterPosts])

  const fetchConnectedAccounts = async () => {
    try {
      const response = await socialAccountsAPI.getAccounts()
      setConnectedAccounts(response.data.filter(account => account.status === 'active'))
    } catch (error) {
      toast.error('Error fetching accounts')
    }
  }

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)

      // Map activeTab to filter parameter
      const filterMap = {
        0: 'ALL',
        1: 'SCHEDULED',
        2: 'PUBLISHED',
        3: 'FAILED',
        4: 'DRAFTS',
        5: 'TODAY',
        6: 'TOMORROW',
        7: 'THIS_WEEK'
      }

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        filter: filterMap[activeTab],
        ...(searchQuery && { search: searchQuery }),
        ...(platformFilter && { platform: platformFilter }),
        ...(statusFilter && { status: statusFilter })
      }

      const response = await api.get('v1/social-media-post/all', { params })

      if (response.data.data.success) {
        setPosts(response.data.data.data.posts)
        setPagination(response.data.data.data.pagination)
        setCounts(response.data.data.data.counts)
      }
    } catch (error) {
      toast.error('Error fetching posts')
    } finally {
      setLoading(false)
    }
  }, [activeTab, searchQuery, platformFilter, statusFilter, pagination.page, pagination.limit])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleEditPost = post => {
    setSelectedPost(post)

    // Map platform data properly - using the new API structure
    const platformIds =
      post.platforms
        ?.map(p => {
          // New API structure has id and provider
          return p.id
        })
        .filter(Boolean) || []

    const formData = {
      content: post.content || '',
      scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : null,
      platforms: platformIds,
      mediaFiles: post.media || [],
      status: post.status || 'CANCELLED'
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
      await api.post(`/posts/${post.id}/duplicate`)
      toast.success('Post duplicated successfully')
      fetchPosts()
    } catch (error) {
      toast.error('Failed to duplicate post')
    }
    setMenuAnchor(null)
  }

  const handlePublishNow = async post => {
    try {
      await api.post(`/posts/${post.id}/publish`)
      toast.success('Post published successfully')
      fetchPosts()
    } catch (error) {
      toast.error('Failed to publish post')
    }
    setMenuAnchor(null)
  }

  const handleRetryPost = async post => {
    try {
      await api.post(`/posts/${post.id}/schedule`, { scheduledAt: new Date() })
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
      await api.put(`/posts/${selectedPost.id}`, editFormData)
      toast.success('Post updated successfully')
      setEditDialogOpen(false)
      fetchPosts()
    } catch (error) {
      toast.error('Failed to update post')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/posts/${selectedPost.id}`)
      toast.success('Post deleted successfully')
      setDeleteDialogOpen(false)
      fetchPosts()
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const getStatusIcon = status => {
    const icons = {
      PENDING: <ScheduleIcon />,
      PUBLISHED: <CheckCircleIcon />,
      PARTIAL: <CheckCircleIcon />,
      FAILED: <ErrorIcon />,
      CANCELLED: <DraftsIcon />
    }

    return icons[status] || <DraftsIcon />
  }

  const getStatusColor = status => {
    const colors = {
      PENDING: 'warning',
      PUBLISHED: 'success',
      PARTIAL: 'info',
      FAILED: 'error',
      CANCELLED: 'primary'
    }

    return colors[status] || 'default'
  }

  const getPlatformIcon = platform => {
    const icons = {
      facebook: <FacebookIcon sx={{ fontSize: 16 }} />,
      'instagram-business': <InstagramIcon sx={{ fontSize: 16 }} />,
      linkedin: <LinkedInIcon sx={{ fontSize: 16 }} />,
      twitter: <TwitterIcon sx={{ fontSize: 16 }} />
    }

    return icons[platform?.toLowerCase()] || <FacebookIcon sx={{ fontSize: 16 }} />
  }

  const getPlatformColor = platform => {
    const colors = {
      facebook: '#1877f2',
      'instagram-business': '#e4405f',
      linkedin: '#0077b5',
      twitter: '#1da1f2'
    }

    return colors[platform?.toLowerCase()] || '#1877f2'
  }

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const getPostDate = post => {
    if ((post.status === 'PUBLISHED' || post.status === 'PARTIAL') && post.publishedAt) {
      return `Published: ${format(new Date(post.publishedAt), 'MMM dd, yyyy HH:mm')}`
    } else if (post.status === 'PENDING' && post.scheduledAt) {
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
    all: counts.all || 0,
    scheduled: counts.scheduled || 0,
    published: counts.published || 0,
    failed: counts.failed || 0,
    draft: counts.drafts || 0,
    today: counts.today || 0,
    tomorrow: counts.tomorrow || 0,
    thisWeek: counts.thisWeek || 0
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
            loading={loading}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color='primary'
                size='large'
              />
            </Box>
          )}
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
          {selectedPost?.status === 'PENDING' && (
            <MenuItem onClick={() => handlePublishNow(selectedPost)}>
              <PublishIcon sx={{ mr: 2 }} />
              Publish Now
            </MenuItem>
          )}
          {selectedPost?.status === 'FAILED' && (
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
