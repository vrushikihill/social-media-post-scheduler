import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FacebookIcon from '@mui/icons-material/Facebook'
import ImageIcon from '@mui/icons-material/Image'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ReplyIcon from '@mui/icons-material/Reply'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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

export default FacebookReel
