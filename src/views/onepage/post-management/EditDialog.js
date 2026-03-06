import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'

const EditDialog = ({
  editDialogOpen,
  setEditDialogOpen,
  handleSaveEdit,
  loading,
  editFormData,
  setEditFormData,
  uploadingMedia,
  handleRemoveMedia,
  handlePlatformToggle,
  handleMediaUpload,
  connectedAccounts
}) => {
  const getPlatformIcon = platform => {
    const icons = {
      facebook: <FacebookIcon sx={{ fontSize: 16 }} />,
      instagram: <InstagramIcon sx={{ fontSize: 16 }} />,
      'instagram-business': <InstagramIcon sx={{ fontSize: 16 }} />,
      linkedin: <LinkedInIcon sx={{ fontSize: 16 }} />,
      twitter: <TwitterIcon sx={{ fontSize: 16 }} />
    }

    return icons[platform?.toLowerCase()] || <FacebookIcon sx={{ fontSize: 16 }} />
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

  return (
    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth='md' fullWidth>
      <DialogTitle>
        <Typography variant='h6' fontWeight={600}>
          Edit Post
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ pb: 2 }}>
          {/* Post Content */}
          <Box sx={{ mb: 4 }}>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Post Content
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={editFormData.content}
              onChange={e => setEditFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder='Enter your post content...'
              variant='outlined'
            />
          </Box>

          {/* Platform Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Select Platforms
            </Typography>
            <Grid container spacing={2}>
              {connectedAccounts?.map(account => (
                <Grid item xs={6} key={account.id}>
                  <Box
                    onClick={() => handlePlatformToggle(account.id)}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: editFormData.platforms.includes(account.id)
                        ? theme => theme.palette.primary.main
                        : 'divider',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: `0 2px 8px ${getPlatformColor(account.provider || account.platform)}15`
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: getPlatformColor(account.provider || account.platform),
                        color: 'common.white',
                        width: 25,
                        height: 25,
                        fontSize: 20
                      }}
                    >
                      {getPlatformIcon(account.provider || account.platform)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='body2' fontWeight={500}>
                        {account.accountName}
                      </Typography>
                      <Typography variant='caption' color='text.secondary' sx={{ textTransform: 'capitalize' }}>
                        {account.provider || account.platform}
                      </Typography>
                    </Box>
                    <Checkbox
                      checked={editFormData.platforms.includes(account.id)}
                      onChange={() => handlePlatformToggle(account.id)}
                      size='small'
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Status and Type */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Post Type
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={editFormData.postType}
                  onChange={e => setEditFormData(prev => ({ ...prev, postType: e.target.value }))}
                  size='small'
                >
                  <MenuItem value='POST'>Post</MenuItem>
                  <MenuItem value='REEL'>Reels</MenuItem>
                  <MenuItem value='STORY'>Story</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Post Status
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={editFormData.status}
                  onChange={e => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                  size='small'
                >
                  <MenuItem value='draft'>Draft</MenuItem>
                  <MenuItem value='scheduled'>Scheduled</MenuItem>
                  <MenuItem value='published'>Published</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {editFormData.status === 'scheduled' && (
            <Box sx={{ mb: 4 }}>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Schedule Date & Time
              </Typography>
              <DateTimePicker
                value={editFormData.scheduledAt}
                onChange={newValue => setEditFormData(prev => ({ ...prev, scheduledAt: newValue }))}
                minDateTime={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small'
                  }
                }}
              />
            </Box>
          )}

          <Box>
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <Typography variant='body2' sx={{ mb: 3, display: 'block' }}>
                Media Files: {editFormData.mediaFiles?.length || 0} media files
              </Typography>
            )}

            {/* Current Media */}
            {editFormData.mediaFiles && editFormData.mediaFiles.length > 0 ? (
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={5}>
                  {editFormData.mediaFiles.map((file, index) => {
                    const imageUrl = file.fileUrl || file.url

                    return (
                      <Grid item xs={4} key={file.id || index}>
                        <Box
                          sx={{
                            position: 'relative',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider',
                            aspectRatio: '1'
                          }}
                        >
                          {file.fileType?.toLowerCase() === 'image' ||
                          file.type?.toLowerCase() === 'image' ||
                          !file.type?.toLowerCase().includes('video') ? (
                            <img
                              src={imageUrl}
                              alt={file.fileName || 'Media'}
                              style={{
                                width: '100%',
                                height: '100%'
                              }}
                              onError={e => {
                                e.target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'grey.100'
                              }}
                            >
                              <Typography variant='caption' color='text.secondary' sx={{ mb: 1 }}>
                                📹 Video
                              </Typography>
                              <Typography
                                variant='caption'
                                color='text.secondary'
                                sx={{ fontSize: '10px', textAlign: 'center', px: 1 }}
                              >
                                {file.fileName}
                              </Typography>
                            </Box>
                          )}
                          <IconButton
                            size='small'
                            onClick={() => {
                              handleRemoveMedia(index)
                            }}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'rgba(0,0,0,0.7)',
                              color: 'white',
                              width: 24,
                              height: 24,
                              '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.9)'
                              }
                            }}
                          >
                            <CloseIcon fontSize='small' />
                          </IconButton>
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>
              </Box>
            ) : (
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2, fontStyle: 'italic' }}>
                No media files attached
              </Typography>
            )}

            {/* Upload Button */}
            <Button
              variant='outlined'
              component='label'
              startIcon={<CloudUploadIcon />}
              disabled={uploadingMedia}
              sx={{ mb: 1 }}
            >
              {uploadingMedia
                ? 'Uploading...'
                : editFormData.mediaFiles?.length > 0
                ? 'Add More Media'
                : 'Upload Media'}
              <input
                type='file'
                hidden
                multiple
                accept='image/*,video/*'
                onChange={e => {
                  handleMediaUpload(e)
                }}
              />
            </Button>
            <Typography variant='caption' color='text.secondary' display='block'>
              Supported formats: JPG, PNG, MP4, MOV (Max 10MB each)
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button variant='outlined' color='error' onClick={() => setEditDialogOpen(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleSaveEdit}
          variant='contained'
          disabled={loading || !editFormData.content?.trim() || editFormData.platforms?.length === 0}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditDialog
