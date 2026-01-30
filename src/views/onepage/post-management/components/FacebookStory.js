import FacebookIcon from '@mui/icons-material/Facebook'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ImageIcon from '@mui/icons-material/Image'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SendIcon from '@mui/icons-material/Send'
import { Avatar, Box, IconButton, TextField, Typography } from '@mui/material'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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

export default FacebookStory
