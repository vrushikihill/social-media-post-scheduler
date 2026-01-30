import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ImageIcon from '@mui/icons-material/Image'
import InstagramIcon from '@mui/icons-material/Instagram'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SendIcon from '@mui/icons-material/Send'
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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

export default InstagramReel
