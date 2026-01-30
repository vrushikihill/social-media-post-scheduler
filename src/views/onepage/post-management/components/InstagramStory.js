import CloseIcon from '@mui/icons-material/Close'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ImageIcon from '@mui/icons-material/Image'
import InstagramIcon from '@mui/icons-material/Instagram'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SendIcon from '@mui/icons-material/Send'
import { Avatar, Box, IconButton, TextField, Typography } from '@mui/material'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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

export default InstagramStory
