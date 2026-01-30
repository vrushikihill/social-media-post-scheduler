import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CloseIcon from '@mui/icons-material/Close'
import FacebookIcon from '@mui/icons-material/Facebook'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ImageIcon from '@mui/icons-material/Image'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LoopIcon from '@mui/icons-material/Loop'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PublicIcon from '@mui/icons-material/Public'
import ReplyIcon from '@mui/icons-material/Reply'
import SendIcon from '@mui/icons-material/Send'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { uploadFiles } from 'src/store/common'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import api from 'utils/api'

const getAccountIcon = platform => {
  switch (platform) {
    case 'facebook':
      return <FacebookIcon sx={{ fontSize: 14 }} />
    case 'instagram':
      return <InstagramIcon sx={{ fontSize: 14 }} />
    case 'linkedin':
      return <LinkedInIcon sx={{ fontSize: 14 }} />
    case 'twitter':
      return <TwitterIcon sx={{ fontSize: 14 }} />
    default:
      return <InstagramIcon sx={{ fontSize: 14 }} />
  }
}

export default function CreatePostDialog({ open, onClose }) {
  const [showPreview, setShowPreview] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [selectedAccountIds, setSelectedAccountIds] = useState([])
  const [postType, setPostType] = useState('post')
  const [content, setContent] = useState('')
  const [mediaFiles, setMediaFiles] = useState([])
  const [uploadingMedia, setUploadingMedia] = useState(false)

  const fileInputRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (open) {
      loadAccounts()
    }
  }, [open])

  const loadAccounts = async () => {
    try {
      const response = await api.get('/v1/auth-social-media/connected')
      setAccounts(response.data.data)
    } catch (error) {
      toast.error('Failed to load connected accounts')
    }
  }

  const handleToggleAccount = id => {
    setSelectedAccountIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(aid => aid !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleFileSelect = async event => {
    const files = Array.from(event.target.files)
    if (!files.length) return

    event.target.value = ''
    setUploadingMedia(true)

    try {
      const data = await dispatch(uploadFiles(files))

      setMediaFiles(prev => [...prev, ...data.payload.data.files])
      toast.success('Media uploaded successfully')
    } catch (err) {
      toast.error('Failed to upload media')
    } finally {
      setUploadingMedia(false)
    }
  }

  const handleRemoveMedia = index => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth={showPreview ? 'lg' : 'md'} fullWidth>
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '85vh' }}>
        {/* Header - Fixed */}
        <Box
          sx={{
            p: 2,
            pb: 2,
            borderBottom: theme => `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'background.paper',
            flexShrink: 0
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='h6' fontWeight={600} color='text.primary'>
              Create Post
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button size='small' variant='outlined' startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}>
              AI Assistant
            </Button>
            <Button
              size='small'
              variant={showPreview ? 'contained' : 'text'}
              color={showPreview ? 'primary' : 'inherit'}
              onClick={() => setShowPreview(!showPreview)}
              sx={{ color: !showPreview ? 'text.secondary' : undefined }}
            >
              Preview
            </Button>
            <IconButton
              onClick={onClose}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Content - Scrollable */}
        <Box sx={{ display: 'flex', gap: 5, alignItems: 'stretch', flex: 1, overflow: 'hidden' }}>
          {/* Left Side - Form */}
          <Box
            sx={{
              flex: 1.2,
              py: 4,
              px: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            {/* Account Selection */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='body2' fontWeight={600} color='text.primary'>
                Select Accounts
              </Typography>
              <Button size='small' sx={{ textTransform: 'none', color: 'text.secondary' }}>
                Unselect All
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, overflowX: 'auto', pb: 1, minHeight: 50 }}>
              {accounts.map(account => (
                <Box
                  key={account.id}
                  onClick={() => handleToggleAccount(account.id)}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    opacity: selectedAccountIds.includes(account.id) ? 1 : 0.5,
                    transition: 'opacity 0.2s',
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      border: selectedAccountIds.includes(account.id)
                        ? theme => `2px solid ${theme.palette.primary.main}`
                        : 'none'
                    }}
                    src={account.metadata.picture || account.metadata.profilePicture}
                  >
                    {getAccountIcon(account.provider)}
                  </Avatar>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: -2,
                      bgcolor: 'background.paper',
                      borderRadius: '50%',
                      p: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 16,
                      height: 16
                    }}
                  >
                    {getAccountIcon(account.provider)}
                  </Box>
                </Box>
              ))}

              {accounts.length === 0 && (
                <Typography variant='caption' color='text.secondary'>
                  No connected accounts found.
                </Typography>
              )}
            </Box>

            {/* Post Type */}
            <RadioGroup row value={postType} onChange={e => setPostType(e.target.value)} sx={{ gap: 2 }}>
              <FormControlLabel
                value='post'
                control={
                  <Radio
                    sx={{
                      color: 'divider',
                      '&.Mui-checked': {
                        color: 'primary.main'
                      }
                    }}
                  />
                }
                label={
                  <Typography fontSize={14} color='text.primary'>
                    Post
                  </Typography>
                }
              />
              <FormControlLabel
                value='reel'
                control={
                  <Radio
                    sx={{
                      color: 'divider',
                      '&.Mui-checked': {
                        color: 'primary.main'
                      }
                    }}
                  />
                }
                label={
                  <Typography fontSize={14} color='text.secondary'>
                    Reel
                  </Typography>
                }
              />
              <FormControlLabel
                value='story'
                control={
                  <Radio
                    sx={{
                      color: 'divider',
                      '&.Mui-checked': {
                        color: 'primary.main'
                      }
                    }}
                  />
                }
                label={
                  <Typography fontSize={14} color='text.secondary'>
                    Story
                  </Typography>
                }
              />
            </RadioGroup>

            <TextField
              multiline
              rows={8}
              disabled={selectedAccountIds.length === 0}
              placeholder={
                selectedAccountIds.length === 0
                  ? 'Select an account to start writing...'
                  : 'What would you like to share?'
              }
              fullWidth
              variant='outlined'
              value={content}
              onChange={e => setContent(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: 14,
                  mb: 2,
                  bgcolor: selectedAccountIds.length === 0 ? 'action.hover' : 'background.paper',
                  '& fieldset': {
                    borderColor: 'divider'
                  },
                  '&:hover fieldset': {
                    borderColor: 'text.secondary'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main'
                  }
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'text.secondary',
                  opacity: 1
                }
              }}
            />

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {mediaFiles.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 100,
                    height: 100,
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
                >
                  {file.type && file.type.startsWith('video') ? (
                    <video
                      src={file.url || file.fileUrl}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <img
                      src={file.url || file.fileUrl}
                      alt='media'
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                  <Box sx={{ position: 'absolute', bottom: 4, right: 4, display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size='small'
                      onClick={() => handleRemoveMedia(index)}
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        ml: 'auto',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                        p: 0.5
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}

              <Box
                component='label'
                sx={{
                  width: mediaFiles.length > 0 ? 100 : '100%',
                  height: mediaFiles.length > 0 ? 100 : 'auto',
                  minHeight: 100,
                  border: theme => `2px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: mediaFiles.length > 0 ? 1 : 5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  bgcolor: selectedAccountIds.length === 0 ? 'action.hover' : 'action.hover',
                  cursor: selectedAccountIds.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: selectedAccountIds.length === 0 ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: selectedAccountIds.length === 0 ? 'divider' : 'text.secondary',
                    bgcolor: selectedAccountIds.length === 0 ? 'action.hover' : 'action.selected'
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type='file'
                  hidden
                  multiple
                  accept='image/*,video/*'
                  onChange={handleFileSelect}
                  disabled={selectedAccountIds.length === 0}
                />
                {uploadingMedia ? (
                  <Typography fontSize={12} color='text.secondary'>
                    Uploading...
                  </Typography>
                ) : (
                  <>
                    {mediaFiles.length === 0 ? (
                      <>
                        <ImageIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                        <Typography fontSize={14} color='text.secondary' mb={1}>
                          {selectedAccountIds.length === 0 ? 'Select an account first' : 'Drag & drop or'}
                        </Typography>
                        <Button
                          size='small'
                          component='span'
                          disabled={selectedAccountIds.length === 0}
                          sx={{ color: 'primary.main', textTransform: 'none', textDecoration: 'underline' }}
                        >
                          select a file
                        </Button>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center' }}>
                        <ImageIcon sx={{ fontSize: 24, color: 'text.secondary' }} />
                        <Typography fontSize={10} color='text.secondary'>
                          Add
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Box>

          {/* Right Side - Preview */}
          {showPreview && (
            <Box
              sx={{
                flex: 0.7,
                py: 3,
                pr: 3,
                bgcolor: 'action.hover',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflowY: 'auto',
                overflowX: 'hidden'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 4
                }}
              >
                <Typography variant='h6' fontWeight={600} color='text.primary'>
                  Preview
                </Typography>
                <Tooltip
                  arrow
                  title='This is an approximation of what your posts will look like live. You might see some differences across devices.'
                >
                  <InfoOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </Tooltip>
              </Box>

              {selectedAccountIds.length > 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: 4
                  }}
                >
                  {selectedAccountIds.includes(accounts.find(acc => acc.provider === 'instagram-business')?.id) &&
                    (postType === 'post' ? (
                      <InstagramPost
                        account={accounts.find(acc => acc.provider === 'instagram-business')}
                        mediaFiles={mediaFiles}
                        content={content}
                      />
                    ) : postType === 'story' ? (
                      <InstagramStory
                        account={accounts.find(acc => acc.provider === 'instagram-business')}
                        mediaFiles={mediaFiles}
                        content={content}
                      />
                    ) : (
                      <InstagramReel
                        account={accounts.find(acc => acc.provider === 'instagram-business')}
                        mediaFiles={mediaFiles}
                        content={content}
                      />
                    ))}
                  {selectedAccountIds.includes(accounts.find(acc => acc.provider === 'facebook')?.id) &&
                    (postType === 'post' ? (
                      <FacebookPost
                        account={accounts.find(acc => acc.provider === 'facebook')}
                        mediaFiles={mediaFiles}
                        content={content}
                      />
                    ) : postType === 'story' ? (
                      <FacebookStory
                        account={accounts.find(acc => acc.provider === 'facebook')}
                        mediaFiles={mediaFiles}
                        content={content}
                      />
                    ) : (
                      <FacebookReel
                        account={accounts.find(acc => acc.provider === 'facebook')}
                        mediaFiles={mediaFiles}
                        content={content}
                      />
                    ))}
                  {selectedAccountIds.includes(accounts.find(acc => acc.provider === 'linkedin')?.id) && (
                    <LinkedInPost
                      account={accounts.find(acc => acc.provider === 'linkedin')}
                      mediaFiles={mediaFiles}
                      content={content}
                    />
                  )}
                  {selectedAccountIds.includes(accounts.find(acc => acc.provider === 'twitter')?.id) && (
                    <TwitterPost
                      account={accounts.find(acc => acc.provider === 'twitter')}
                      mediaFiles={mediaFiles}
                      content={content}
                    />
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: 4
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Select an account to preview your post
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Footer - Fixed */}
        <Box
          sx={{
            borderTop: theme => `1px solid ${theme.palette.divider}`,
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            bgcolor: 'background.paper',
            flexShrink: 0
          }}
        >
          <Button variant='contained'>Post</Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

const InstagramPost = ({ account, mediaFiles, content }) => {
  return (
    <Box
      sx={{
        border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        maxWidth: 400,
        width: '100%',
        mx: 'auto',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pb: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              border: theme => `2px solid ${theme.palette.divider}`
            }}
            src={account.metadata.profilePicture}
          >
            <InstagramIcon fontSize='small' />
          </Avatar>
          <Typography variant='subtitle2' fontWeight={600} fontSize={14}>
            {account.metadata.username || account.metadata.name}
          </Typography>
        </Box>
        <MoreHorizIcon sx={{ color: 'text.primary', cursor: 'pointer' }} />
      </Box>

      {/* Media Container */}
      <Box
        sx={{
          width: '100%',
          position: 'relative',
          bgcolor: '#000',
          aspectRatio: '1 / 1',
          maxHeight: 400,
          '& .swiper': {
            width: '100%',
            height: '100%'
          },
          '& .swiper-button-next, & .swiper-button-prev': {
            color: '#fff',
            width: 30,
            height: 30,
            bgcolor: 'rgba(255,255,255,0.9)',
            borderRadius: '50%',
            '&:after': {
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#000'
            },
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            opacity: 0.9,
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 1
            }
          },
          '& .swiper-button-prev': {
            left: 8
          },
          '& .swiper-button-next': {
            right: 8
          },
          '& .swiper-button-disabled': {
            opacity: 0
          }
        }}
      >
        {mediaFiles.length > 0 ? (
          <>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{
                clickable: true,
                el: '.custom-pagination-container-instagram'
              }}
              observer
              observeParents
              spaceBetween={0}
              slidesPerView={1}
              style={{ width: '100%', height: '100%' }}
            >
              {mediaFiles.map((file, index) => (
                <SwiperSlide key={index}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#000'
                    }}
                  >
                    {file.type && file.type.startsWith('video') ? (
                      <video
                        src={file.url || file.fileUrl}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                        controls={false}
                      />
                    ) : (
                      <img
                        src={file.url || file.fileUrl}
                        alt={`Post content ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    )}
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Pagination Dots */}
            {mediaFiles.length > 1 && (
              <Box
                className='custom-pagination-container-instagram'
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 0.5,
                  zIndex: 10,
                  pointerEvents: 'none',
                  '& .swiper-pagination-bullet': {
                    width: 6,
                    height: 6,
                    bgcolor: 'rgba(255,255,255,0.6)',
                    opacity: 1,
                    margin: '0 2px !important',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  },
                  '& .swiper-pagination-bullet-active': {
                    bgcolor: '#fff',
                    transform: 'scale(1.1)'
                  }
                }}
              />
            )}
          </>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#fafafa'
            }}
          >
            <Box sx={{ textAlign: 'center', color: 'text.disabled' }}>
              <ImageIcon sx={{ fontSize: 80, opacity: 0.3 }} />
              <Typography variant='caption' sx={{ mt: 1, display: 'block', opacity: 0.5 }}>
                No media
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Actions and Content */}
      <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FavoriteBorderIcon
              sx={{
                fontSize: 20,
                color: 'text.primary',
                cursor: 'pointer',
                '&:hover': { opacity: 0.6 }
              }}
            />
            <ChatBubbleOutlineIcon
              sx={{
                fontSize: 20,
                color: 'text.primary',
                cursor: 'pointer',
                '&:hover': { opacity: 0.6 }
              }}
            />
            <LoopIcon
              sx={{
                fontSize: 20,
                color: 'text.primary',
                cursor: 'pointer',
                '&:hover': { opacity: 0.6 }
              }}
            />
            <SendIcon
              sx={{
                fontSize: 20,
                color: 'text.primary',
                transform: 'rotate(0deg) translateY(0px)',
                cursor: 'pointer',
                '&:hover': { opacity: 0.6 }
              }}
            />
          </Box>

          <BookmarkBorderIcon
            sx={{
              fontSize: 20,
              color: 'text.primary',
              cursor: 'pointer',
              '&:hover': { opacity: 0.6 }
            }}
          />
        </Box>

        {/* Caption */}
        {content && (
          <Typography
            variant='body2'
            fontSize={14}
            component='div'
            sx={{
              lineHeight: 1.5,
              wordBreak: 'break-word'
            }}
          >
            <Box component='span' fontWeight={600} mr={1}>
              {account.metadata.username || account.metadata.name}
            </Box>
            {content}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

const FacebookPost = ({ account, mediaFiles, content }) => {
  return (
    <Box
      sx={{
        border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        maxWidth: 400,
        width: '100%',
        mx: 'auto',
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pb: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40
            }}
            src={account.metadata.picture}
          >
            <FacebookIcon fontSize='small' />
          </Avatar>
          <Box>
            <Typography variant='subtitle2' fontWeight={600} fontSize={15}>
              {account.metadata.pageName || account.metadata.userName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant='caption' fontSize={13} color='text.secondary'>
                Just now
              </Typography>
              <Typography variant='caption' fontSize={13} color='text.secondary'>
                •
              </Typography>
              <PublicIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
            </Box>
          </Box>
        </Box>
        <MoreHorizIcon sx={{ color: 'text.secondary', cursor: 'pointer' }} />
      </Box>

      {/* Caption/Content */}
      {content && (
        <Box sx={{ px: 2, pb: 1.5 }}>
          <Typography
            variant='body2'
            fontSize={15}
            sx={{
              lineHeight: 1.4,
              wordBreak: 'break-word',
              color: 'text.primary'
            }}
          >
            {content}
          </Typography>
        </Box>
      )}

      {/* Media Container */}
      <Box
        sx={{
          width: '100%',
          position: 'relative',
          bgcolor: '#000',
          aspectRatio: '16 / 9',
          maxHeight: 300,
          '& .swiper': {
            width: '100%',
            height: '100%'
          },
          '& .swiper-button-next, & .swiper-button-prev': {
            color: '#fff',
            width: 36,
            height: 36,
            bgcolor: 'rgba(255,255,255,0.95)',
            borderRadius: '50%',
            '&:after': {
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#000'
            },
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
            opacity: 0.9,
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 1,
              bgcolor: '#fff'
            }
          },
          '& .swiper-button-prev': {
            left: 12
          },
          '& .swiper-button-next': {
            right: 12
          },
          '& .swiper-button-disabled': {
            opacity: 0
          }
        }}
      >
        {mediaFiles.length > 0 ? (
          <>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{
                clickable: true,
                el: '.custom-pagination-container-facebook'
              }}
              observer
              observeParents
              spaceBetween={0}
              slidesPerView={1}
              style={{ width: '100%', height: '100%' }}
            >
              {mediaFiles.map((file, index) => (
                <SwiperSlide key={index}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#000'
                    }}
                  >
                    {file.type && file.type.startsWith('video') ? (
                      <video
                        src={file.url || file.fileUrl}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                        controls={false}
                      />
                    ) : (
                      <img
                        src={file.url || file.fileUrl}
                        alt={`Post content ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    )}
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Pagination Dots */}
            {mediaFiles.length > 1 && (
              <Box
                className='custom-pagination-container-facebook'
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 0.5,
                  zIndex: 10,
                  pointerEvents: 'none',
                  '& .swiper-pagination-bullet': {
                    width: 8,
                    height: 8,
                    bgcolor: 'rgba(255,255,255,0.5)',
                    opacity: 1,
                    margin: '0 3px !important',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  },
                  '& .swiper-pagination-bullet-active': {
                    bgcolor: '#fff',
                    transform: 'scale(1.15)'
                  }
                }}
              />
            )}
          </>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f0f2f5'
            }}
          >
            <Box sx={{ textAlign: 'center', color: 'text.disabled' }}>
              <ImageIcon sx={{ fontSize: 80, opacity: 0.3 }} />
              <Typography variant='caption' sx={{ mt: 1, display: 'block', opacity: 0.5 }}>
                No media
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Reactions & Stats */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: -0.5
            }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                bgcolor: '#1877f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff',
                zIndex: 3
              }}
            >
              <ThumbUpIcon sx={{ fontSize: 11, color: '#fff' }} />
            </Box>
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                bgcolor: '#f33e58',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff',
                ml: -0.5,
                zIndex: 2
              }}
            >
              <FavoriteIcon sx={{ fontSize: 11, color: '#fff' }} />
            </Box>
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                bgcolor: '#f7b125',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff',
                ml: -0.5,
                zIndex: 1
              }}
            >
              <Typography sx={{ fontSize: 11 }}>😮</Typography>
            </Box>
          </Box>
          <Typography variant='caption' fontSize={15} color='text.secondary' sx={{ ml: 0.5 }}>
            1.2K
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Typography variant='caption' fontSize={15} color='text.secondary'>
            142 Comments
          </Typography>
          <Typography variant='caption' fontSize={15} color='text.secondary'>
            28 Shares
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1,
          py: 0.5
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            py: 1,
            cursor: 'pointer',
            borderRadius: 1,
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <ThumbUpAltOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Typography variant='body2' fontWeight={600} fontSize={15} color='text.secondary'>
            Like
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            py: 1,
            cursor: 'pointer',
            borderRadius: 1,
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Typography variant='body2' fontWeight={600} fontSize={15} color='text.secondary'>
            Comment
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            py: 1,
            cursor: 'pointer',
            borderRadius: 1,
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <ReplyIcon sx={{ fontSize: 20, color: 'text.secondary', transform: 'scaleX(-1)' }} />
          <Typography variant='body2' fontWeight={600} fontSize={15} color='text.secondary'>
            Share
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

const LinkedInPost = ({ account, mediaFiles, content }) => {
  return (
    <Box
      sx={{
        border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        maxWidth: 400,
        width: '100%',
        mx: 'auto',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: 2,
          pb: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48
            }}
            src={account.metadata.profilePicture}
          >
            <LinkedInIcon fontSize='small' />
          </Avatar>
          <Box>
            <Typography variant='subtitle2' fontWeight={600} fontSize={14} color='text.primary'>
              {account.metadata.username || account.metadata.name}
            </Typography>
            <Typography variant='caption' fontSize={12} color='text.secondary' display='block'>
              {account.metadata.headline || 'Professional'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <Typography variant='caption' fontSize={12} color='text.secondary'>
                Just now
              </Typography>
              <Typography variant='caption' fontSize={12} color='text.secondary'>
                •
              </Typography>
              <PublicIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
            </Box>
          </Box>
        </Box>
        <MoreHorizIcon sx={{ color: 'text.secondary', cursor: 'pointer', fontSize: 20 }} />
      </Box>

      {/* Caption/Content */}
      {content && (
        <Box sx={{ px: 2, pb: 1.5 }}>
          <Typography
            variant='body2'
            fontSize={14}
            sx={{
              lineHeight: 1.5,
              wordBreak: 'break-word',
              color: 'text.primary',
              whiteSpace: 'pre-wrap'
            }}
          >
            {content}
          </Typography>
        </Box>
      )}

      {/* Media Container */}
      <Box
        sx={{
          width: '100%',
          position: 'relative',
          bgcolor: '#000',
          aspectRatio: '16 / 9',
          maxHeight: 300,
          '& .swiper': {
            width: '100%',
            height: '100%'
          },
          '& .swiper-button-next, & .swiper-button-prev': {
            color: '#0a66c2',
            width: 34,
            height: 34,
            bgcolor: 'rgba(255,255,255,0.95)',
            borderRadius: '50%',
            '&:after': {
              fontSize: '14px',
              fontWeight: 'bold'
            },
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            opacity: 0.9,
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 1,
              bgcolor: '#fff'
            }
          },
          '& .swiper-button-prev': {
            left: 12
          },
          '& .swiper-button-next': {
            right: 12
          },
          '& .swiper-button-disabled': {
            opacity: 0
          }
        }}
      >
        {mediaFiles.length > 0 ? (
          <>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{
                clickable: true,
                el: '.custom-pagination-container-linkedin'
              }}
              observer
              observeParents
              spaceBetween={0}
              slidesPerView={1}
              style={{ width: '100%', height: '100%' }}
            >
              {mediaFiles.map((file, index) => (
                <SwiperSlide key={index}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#000'
                    }}
                  >
                    {file.type && file.type.startsWith('video') ? (
                      <video
                        src={file.url || file.fileUrl}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                        controls={false}
                      />
                    ) : (
                      <img
                        src={file.url || file.fileUrl}
                        alt={`Post content ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    )}
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Pagination Dots */}
            {mediaFiles.length > 1 && (
              <Box
                className='custom-pagination-container-linkedin'
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 0.5,
                  zIndex: 10,
                  pointerEvents: 'none',
                  '& .swiper-pagination-bullet': {
                    width: 8,
                    height: 8,
                    bgcolor: 'rgba(255,255,255,0.6)',
                    opacity: 1,
                    margin: '0 3px !important',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  },
                  '& .swiper-pagination-bullet-active': {
                    bgcolor: '#0a66c2',
                    transform: 'scale(1.15)'
                  }
                }}
              />
            )}
          </>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f3f6f8'
            }}
          >
            <Box sx={{ textAlign: 'center', color: 'text.disabled' }}>
              <ImageIcon sx={{ fontSize: 80, opacity: 0.3 }} />
              <Typography variant='caption' sx={{ mt: 1, display: 'block', opacity: 0.5 }}>
                No media
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Engagement Stats */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: -0.5
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: '#0a66c2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff',
                zIndex: 3
              }}
            >
              <ThumbUpIcon sx={{ fontSize: 9, color: '#fff' }} />
            </Box>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: '#6dae4f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff',
                ml: -0.5,
                zIndex: 2
              }}
            >
              <Typography sx={{ fontSize: 9, fontWeight: 'bold', color: '#fff' }}>💡</Typography>
            </Box>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: '#df704d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff',
                ml: -0.5,
                zIndex: 1
              }}
            >
              <FavoriteIcon sx={{ fontSize: 9, color: '#fff' }} />
            </Box>
          </Box>
          <Typography variant='caption' fontSize={12} color='text.secondary' sx={{ ml: 0.5 }}>
            845
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Typography variant='caption' fontSize={12} color='text.secondary'>
            76 comments
          </Typography>
          <Typography variant='caption' fontSize={12} color='text.secondary'>
            24 reposts
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 0.5,
          py: 0.5
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            py: 1.25,
            cursor: 'pointer',
            borderRadius: 1,
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <ThumbUpAltOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Typography variant='body2' fontWeight={600} fontSize={14} color='text.secondary'>
            Like
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            py: 1.25,
            cursor: 'pointer',
            borderRadius: 1,
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Typography variant='body2' fontWeight={600} fontSize={14} color='text.secondary'>
            Comment
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            py: 1.25,
            cursor: 'pointer',
            borderRadius: 1,
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <LoopIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Typography variant='body2' fontWeight={600} fontSize={14} color='text.secondary'>
            Repost
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            py: 1.25,
            cursor: 'pointer',
            borderRadius: 1,
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <SendIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Typography variant='body2' fontWeight={600} fontSize={14} color='text.secondary'>
            Send
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

const TwitterPost = ({ account, mediaFiles, content }) => {
  return (
    <Box
      sx={{
        border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        maxWidth: 400,
        width: '100%',
        mx: 'auto',
        overflow: 'hidden',
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: 'action.hover'
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          p: 2,
          gap: 1.5
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40
          }}
          src={account.metadata.profilePicture}
        >
          <TwitterIcon fontSize='small' />
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Name and Handle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Typography variant='subtitle2' fontWeight={700} fontSize={15} color='text.primary' noWrap>
              {account.metadata.name || account.metadata.username}
            </Typography>
            <Typography variant='body2' fontSize={15} color='text.secondary' noWrap>
              @{account.metadata.username || 'username'}
            </Typography>
            <Typography variant='body2' fontSize={15} color='text.secondary'>
              ·
            </Typography>
            <Typography variant='body2' fontSize={15} color='text.secondary'>
              now
            </Typography>
            <Box sx={{ flex: 1 }} />
            <IconButton size='small' sx={{ color: 'text.secondary' }}>
              <MoreHorizIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Tweet Content */}
          {content && (
            <Typography
              variant='body2'
              fontSize={15}
              sx={{
                lineHeight: 1.5,
                wordBreak: 'break-word',
                color: 'text.primary',
                mb: mediaFiles.length > 0 ? 1.5 : 0,
                whiteSpace: 'pre-wrap'
              }}
            >
              {content}
            </Typography>
          )}

          {/* Media Container */}
          {mediaFiles.length > 0 && (
            <Box
              sx={{
                width: '100%',
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                border: theme => `1px solid ${theme.palette.divider}`,
                bgcolor: '#000',
                aspectRatio: mediaFiles.length === 1 ? '16 / 9' : '1 / 1',
                maxHeight: 400,
                '& .swiper': {
                  width: '100%',
                  height: '100%'
                },
                '& .swiper-button-next, & .swiper-button-prev': {
                  color: '#fff',
                  width: 32,
                  height: 32,
                  bgcolor: 'rgba(15, 20, 25, 0.75)',
                  borderRadius: '50%',
                  '&:after': {
                    fontSize: '12px',
                    fontWeight: 'bold'
                  },
                  backdropFilter: 'blur(4px)',
                  opacity: 0.9,
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 1,
                    bgcolor: 'rgba(15, 20, 25, 0.85)'
                  }
                },
                '& .swiper-button-prev': {
                  left: 8
                },
                '& .swiper-button-next': {
                  right: 8
                },
                '& .swiper-button-disabled': {
                  opacity: 0
                }
              }}
            >
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{
                  clickable: true,
                  el: '.custom-pagination-container-twitter'
                }}
                observer
                observeParents
                spaceBetween={0}
                slidesPerView={1}
                style={{ width: '100%', height: '100%' }}
              >
                {mediaFiles.map((file, index) => (
                  <SwiperSlide key={index}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#000'
                      }}
                    >
                      {file.type && file.type.startsWith('video') ? (
                        <video
                          src={file.url || file.fileUrl}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          controls={false}
                        />
                      ) : (
                        <img
                          src={file.url || file.fileUrl}
                          alt={`Tweet media ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Pagination Dots */}
              {mediaFiles.length > 1 && (
                <Box
                  className='custom-pagination-container-twitter'
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 0.5,
                    zIndex: 10,
                    pointerEvents: 'none',
                    '& .swiper-pagination-bullet': {
                      width: 6,
                      height: 6,
                      bgcolor: 'rgba(255,255,255,0.5)',
                      opacity: 1,
                      margin: '0 2px !important',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    },
                    '& .swiper-pagination-bullet-active': {
                      bgcolor: '#1d9bf0',
                      transform: 'scale(1.1)'
                    }
                  }}
                />
              )}
            </Box>
          )}

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 1.5,
              maxWidth: 425
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: 'text.secondary',
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#1d9bf0',
                  '& .icon-wrapper': {
                    bgcolor: 'rgba(29, 155, 240, 0.1)'
                  }
                }
              }}
            >
              <Box
                className='icon-wrapper'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  transition: 'background-color 0.2s'
                }}
              >
                <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography variant='caption' fontSize={13}>
                42
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: 'text.secondary',
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#00ba7c',
                  '& .icon-wrapper': {
                    bgcolor: 'rgba(0, 186, 124, 0.1)'
                  }
                }
              }}
            >
              <Box
                className='icon-wrapper'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  transition: 'background-color 0.2s'
                }}
              >
                <LoopIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography variant='caption' fontSize={13}>
                128
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: 'text.secondary',
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#f91880',
                  '& .icon-wrapper': {
                    bgcolor: 'rgba(249, 24, 128, 0.1)'
                  }
                }
              }}
            >
              <Box
                className='icon-wrapper'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  transition: 'background-color 0.2s'
                }}
              >
                <FavoriteBorderIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography variant='caption' fontSize={13}>
                1.2K
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: 'text.secondary',
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#1d9bf0',
                  '& .icon-wrapper': {
                    bgcolor: 'rgba(29, 155, 240, 0.1)'
                  }
                }
              }}
            >
              <Box
                className='icon-wrapper'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  transition: 'background-color 0.2s'
                }}
              >
                <SendIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: 'text.secondary',
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#1d9bf0',
                  '& .icon-wrapper': {
                    bgcolor: 'rgba(29, 155, 240, 0.1)'
                  }
                }
              }}
            >
              <Box
                className='icon-wrapper'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  transition: 'background-color 0.2s'
                }}
              >
                <BookmarkBorderIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const FacebookStory = ({ account, mediaFiles, content }) => {
  const firstMedia = mediaFiles[0]

  return (
    <Box
      sx={{
        maxWidth: 250,
        width: '100%',
        mx: 'auto'
      }}
    >
      <Typography variant='caption' color='text.secondary' display='block' mb={1} textAlign='center'>
        Facebook Story Preview
      </Typography>
      <Box
        sx={{
          aspectRatio: '9 / 16',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          bgcolor: '#000',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        {/* Background Media */}
        {firstMedia ? (
          firstMedia.type && firstMedia.type.startsWith('video') ? (
            <video
              src={firstMedia.url || firstMedia.fileUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              muted
              loop
            />
          ) : (
            <img
              src={firstMedia.url || firstMedia.fileUrl}
              alt='Story background'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <ImageIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.3)' }} />
          </Box>
        )}

        {/* Gradient Overlays */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 1
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 1
          }}
        />

        {/* Progress Bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            right: 8,
            display: 'flex',
            gap: 0.5,
            zIndex: 2
          }}
        >
          {[...Array(mediaFiles.length || 1)].map((_, idx) => (
            <Box
              key={idx}
              sx={{
                flex: 1,
                height: 2,
                bgcolor: 'rgba(255,255,255,0.3)',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: idx === 0 ? '100%' : '0%',
                  height: '100%',
                  bgcolor: '#fff',
                  transition: 'width 0.3s'
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Header */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            zIndex: 2
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              border: '2px solid #1877f2'
            }}
            src={account.metadata.picture}
          >
            <FacebookIcon fontSize='small' />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant='subtitle2' fontWeight={600} fontSize={14} color='#fff'>
              {account.metadata.pageName || account.metadata.userName}
            </Typography>
            <Typography variant='caption' fontSize={12} color='rgba(255,255,255,0.8)'>
              Just now
            </Typography>
          </Box>
          <IconButton size='small' sx={{ color: '#fff' }}>
            <MoreHorizIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Content Text */}
        {content && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 80,
              left: 16,
              right: 16,
              zIndex: 2
            }}
          >
            <Typography
              variant='body2'
              fontSize={16}
              fontWeight={500}
              sx={{
                color: '#fff',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                lineHeight: 1.4
              }}
            >
              {content}
            </Typography>
          </Box>
        )}

        {/* Bottom Actions */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            zIndex: 2
          }}
        >
          <TextField
            placeholder='Send message'
            size='small'
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 20,
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                fontSize: 14,
                '& fieldset': {
                  border: 'none'
                },
                '& input::placeholder': {
                  color: 'rgba(255,255,255,0.8)',
                  opacity: 1
                }
              }
            }}
          />
          <IconButton
            size='small'
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            <FavoriteBorderIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            size='small'
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            <SendIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

const FacebookReel = ({ account, mediaFiles, content }) => {
  const firstMedia = mediaFiles[0]

  return (
    <Box
      sx={{
        maxWidth: 250,
        width: '100%',
        mx: 'auto'
      }}
    >
      <Typography variant='caption' color='text.secondary' display='block' mb={1} textAlign='center'>
        Facebook Reel Preview
      </Typography>
      <Box
        sx={{
          aspectRatio: '9 / 16',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          bgcolor: '#000',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        {/* Background Media */}
        {firstMedia ? (
          firstMedia.type && firstMedia.type.startsWith('video') ? (
            <video
              src={firstMedia.url || firstMedia.fileUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              muted
              loop
            />
          ) : (
            <img
              src={firstMedia.url || firstMedia.fileUrl}
              alt='Reel background'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <ImageIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.3)' }} />
          </Box>
        )}

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 1
          }}
        />

        {/* Right Side Actions */}
        <Box
          sx={{
            position: 'absolute',
            right: 12,
            bottom: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            zIndex: 2
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <IconButton
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                mb: 0.5,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.25)'
                }
              }}
            >
              <ThumbUpAltOutlinedIcon sx={{ fontSize: 24 }} />
            </IconButton>
            <Typography variant='caption' fontSize={12} color='#fff' fontWeight={600} display='block'>
              1.2K
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <IconButton
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                mb: 0.5,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.25)'
                }
              }}
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: 24 }} />
            </IconButton>
            <Typography variant='caption' fontSize={12} color='#fff' fontWeight={600} display='block'>
              142
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <IconButton
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                mb: 0.5,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.25)'
                }
              }}
            >
              <ReplyIcon sx={{ fontSize: 24, transform: 'scaleX(-1)' }} />
            </IconButton>
            <Typography variant='caption' fontSize={12} color='#fff' fontWeight={600} display='block'>
              Share
            </Typography>
          </Box>

          <IconButton
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.25)'
              }
            }}
          >
            <MoreHorizIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Box>

        {/* Bottom Content */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 12,
            right: 70,
            zIndex: 2
          }}
        >
          {/* User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                border: '2px solid #fff'
              }}
              src={account.metadata.picture}
            >
              <FacebookIcon fontSize='small' />
            </Avatar>
            <Typography variant='subtitle2' fontWeight={700} fontSize={14} color='#fff'>
              {account.metadata.pageName || account.metadata.userName}
            </Typography>
            <Button
              size='small'
              variant='outlined'
              sx={{
                color: '#fff',
                borderColor: '#fff',
                borderRadius: 1,
                textTransform: 'none',
                fontSize: 10,
                fontWeight: 600,
                minWidth: 'auto',
                px: 1,
                py: 0.25,
                '&:hover': {
                  borderColor: '#fff',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Follow
            </Button>
          </Box>

          {/* Caption */}
          {content && (
            <Typography
              variant='body2'
              fontSize={14}
              sx={{
                color: '#fff',
                lineHeight: 1.4,
                maxHeight: 60,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {content}
            </Typography>
          )}

          {/* Audio Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography fontSize={10}>🎵</Typography>
            </Box>
            <Typography variant='caption' fontSize={12} color='#fff'>
              Original audio
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const InstagramStory = ({ account, mediaFiles, content }) => {
  const firstMedia = mediaFiles[0]

  return (
    <Box
      sx={{
        maxWidth: 250,
        width: '100%',
        mx: 'auto'
      }}
    >
      <Typography variant='caption' color='text.secondary' display='block' mb={1} textAlign='center'>
        Instagram Story Preview
      </Typography>
      <Box
        sx={{
          aspectRatio: '9 / 16',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          bgcolor: '#000',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        {/* Background Media */}
        {firstMedia ? (
          firstMedia.type && firstMedia.type.startsWith('video') ? (
            <video
              src={firstMedia.url || firstMedia.fileUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              muted
              loop
            />
          ) : (
            <img
              src={firstMedia.url || firstMedia.fileUrl}
              alt='Story background'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
            }}
          >
            <ImageIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.3)' }} />
          </Box>
        )}

        {/* Gradient Overlays */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '35%',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 1
          }}
        />

        {/* Progress Bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 8,
            right: 8,
            display: 'flex',
            gap: 0.5,
            zIndex: 2
          }}
        >
          {[...Array(mediaFiles.length || 1)].map((_, idx) => (
            <Box
              key={idx}
              sx={{
                flex: 1,
                height: 2.5,
                bgcolor: 'rgba(255,255,255,0.4)',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: idx === 0 ? '100%' : '0%',
                  height: '100%',
                  bgcolor: '#fff',
                  transition: 'width 0.3s'
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Header */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            left: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            zIndex: 2
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              border: '3px solid transparent',
              background:
                'linear-gradient(#000, #000) padding-box, linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888) border-box'
            }}
            src={account.metadata.profilePicture}
          >
            <InstagramIcon fontSize='small' />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant='subtitle2' fontWeight={600} fontSize={14} color='#fff'>
              {account.metadata.username || account.metadata.name}
            </Typography>
            <Typography variant='caption' fontSize={12} color='rgba(255,255,255,0.7)'>
              2m ago
            </Typography>
          </Box>
          <IconButton size='small' sx={{ color: '#fff' }}>
            <MoreHorizIcon sx={{ fontSize: 24 }} />
          </IconButton>
          <IconButton size='small' sx={{ color: '#fff' }}>
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Box>

        {/* Content Text Overlay */}
        {content && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              textAlign: 'center',
              zIndex: 2
            }}
          >
            <Typography
              variant='h6'
              fontWeight={700}
              sx={{
                color: '#fff',
                textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.4)',
                lineHeight: 1.3,
                fontSize: 20
              }}
            >
              {content}
            </Typography>
          </Box>
        )}

        {/* Bottom Actions */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            zIndex: 2
          }}
        >
          <TextField
            placeholder='Send message'
            size='small'
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 25,
                bgcolor: 'transparent',
                border: '2px solid rgba(255,255,255,0.8)',
                color: '#fff',
                fontSize: 14,
                height: 44,
                '& fieldset': {
                  border: 'none'
                },
                '& input::placeholder': {
                  color: 'rgba(255,255,255,0.9)',
                  opacity: 1
                }
              }
            }}
          />
          <IconButton
            sx={{
              color: '#fff',
              width: 44,
              height: 44
            }}
          >
            <FavoriteBorderIcon sx={{ fontSize: 28 }} />
          </IconButton>
          <IconButton
            sx={{
              color: '#fff',
              width: 44,
              height: 44
            }}
          >
            <SendIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

const InstagramReel = ({ account, mediaFiles, content }) => {
  const firstMedia = mediaFiles[0]

  return (
    <Box
      sx={{
        maxWidth: 250,
        width: '100%',
        mx: 'auto'
      }}
    >
      <Typography variant='caption' color='text.secondary' display='block' mb={1} textAlign='center'>
        Instagram Reel Preview
      </Typography>
      <Box
        sx={{
          aspectRatio: '9 / 16',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          bgcolor: '#000',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        {/* Background Media */}
        {firstMedia ? (
          firstMedia.type && firstMedia.type.startsWith('video') ? (
            <video
              src={firstMedia.url || firstMedia.fileUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              muted
              loop
            />
          ) : (
            <img
              src={firstMedia.url || firstMedia.fileUrl}
              alt='Reel background'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(45deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)'
            }}
          >
            <ImageIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.3)' }} />
          </Box>
        )}

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 1
          }}
        />

        {/* Right Side Actions */}
        <Box
          sx={{
            position: 'absolute',
            right: 12,
            bottom: 120,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'center',
            zIndex: 2
          }}
        >
          {/* Like */}
          <Box sx={{ textAlign: 'center' }}>
            <IconButton
              sx={{
                color: '#fff',
                mb: 0.5,
                '&:hover': {
                  transform: 'scale(1.15)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              <FavoriteBorderIcon sx={{ fontSize: 28, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
            </IconButton>
            <Typography
              variant='caption'
              fontSize={12}
              color='#fff'
              fontWeight={700}
              display='block'
              sx={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
            >
              1.2K
            </Typography>
          </Box>

          {/* Comment */}
          <Box sx={{ textAlign: 'center' }}>
            <IconButton
              sx={{
                color: '#fff',
                mb: 0.5,
                '&:hover': {
                  transform: 'scale(1.15)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: 28, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
            </IconButton>
            <Typography
              variant='caption'
              fontSize={12}
              color='#fff'
              fontWeight={700}
              display='block'
              sx={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
            >
              142
            </Typography>
          </Box>

          {/* Share */}
          <Box sx={{ textAlign: 'center' }}>
            <IconButton
              sx={{
                color: '#fff',
                mb: 0.5,
                '&:hover': {
                  transform: 'scale(1.15)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              <SendIcon
                sx={{
                  fontSize: 28,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                  transform: 'rotate(-30deg)'
                }}
              />
            </IconButton>
          </Box>

          {/* More */}
          <IconButton
            sx={{
              color: '#fff',
              '&:hover': {
                transform: 'scale(1.15)',
                transition: 'transform 0.2s'
              }
            }}
          >
            <MoreHorizIcon sx={{ fontSize: 28, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
          </IconButton>

          {/* Album Cover */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              border: '2px solid #fff',
              overflow: 'hidden',
              mt: 1
            }}
          >
            <Avatar sx={{ width: '100%', height: '100%', borderRadius: 0 }} src={account.metadata.profilePicture}>
              <InstagramIcon fontSize='small' />
            </Avatar>
          </Box>
        </Box>

        {/* Bottom Content */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: 12,
            right: 70,
            zIndex: 2
          }}
        >
          {/* User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                border: '2px solid #fff'
              }}
              src={account.metadata.profilePicture}
            >
              <InstagramIcon fontSize='small' />
            </Avatar>
            <Typography
              variant='subtitle2'
              fontWeight={700}
              fontSize={14}
              color='#fff'
              sx={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
            >
              {account.metadata.username || account.metadata.name}
            </Typography>
            <Button
              size='small'
              variant='outlined'
              sx={{
                color: '#fff',
                borderColor: '#fff',
                borderRadius: 1,
                textTransform: 'none',
                fontSize: 10,
                fontWeight: 700,
                minWidth: 'auto',
                px: 1,
                py: 0.25,
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#fff',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  borderWidth: 2
                }
              }}
            >
              Follow
            </Button>
          </Box>

          {/* Caption */}
          {content && (
            <Typography
              variant='body2'
              fontSize={14}
              sx={{
                color: '#fff',
                lineHeight: 1.4,
                maxHeight: 42,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                mb: 1
              }}
            >
              {content}
            </Typography>
          )}

          {/* Audio Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography fontSize={10}>🎵</Typography>
            </Box>
            <Typography variant='caption' fontSize={12} color='#fff'>
              Original audio
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
