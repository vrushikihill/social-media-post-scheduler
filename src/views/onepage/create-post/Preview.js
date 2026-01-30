import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import { Box, Grid, Typography } from '@mui/material'

const Preview = ({ formData }) => {
  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Typography variant='h6' fontWeight={500} sx={{ mb: 0 }}>
          Preview Post
        </Typography>
      </Grid>

      {/* Social Media Post Preview */}
      <Grid item xs={12}>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          {/* Post Header */}
          <Box sx={{ p: 3, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='subtitle2' fontWeight={600}>
                Your Business
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                2 minutes ago
              </Typography>
            </Box>
          </Box>

          {/* Post Content */}
          <Box sx={{ px: 3, pb: 2 }}>
            <Typography
              variant='body2'
              sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
                color: formData.content ? 'text.primary' : 'text.secondary'
              }}
            >
              {formData.content || 'Your post content will appear here...'}
            </Typography>
          </Box>

          {/* Media Grid */}
          {formData.mediaFiles.length > 0 && (
            <Box sx={{ px: 3, pb: 2 }}>
              <Grid container spacing={1}>
                {formData.mediaFiles.slice(0, 4).map((file, index) => (
                  <Grid item xs={formData.mediaFiles.length === 1 ? 12 : 6} key={index}>
                    <Box
                      sx={{
                        width: '100%',
                        height: formData.mediaFiles.length === 1 ? 200 : 120,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                        bgcolor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {file.fileType === 'image/jpeg' ||
                      file.fileType === 'image/png' ||
                      file.fileType === 'image/jpg' ? (
                        <img
                          src={file.previewUrl || file.fileUrl}
                          alt={file.fileName}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <VideoLibraryIcon sx={{ color: 'grey.500', fontSize: 32 }} />
                      )}

                      {/* Show count overlay for 4th image if more than 4 */}
                      {index === 3 && formData.mediaFiles.length > 4 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography variant='h6' color='white' fontWeight={600}>
                            +{formData.mediaFiles.length - 3}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  )
}

export default Preview
