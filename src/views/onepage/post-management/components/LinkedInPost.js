import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ImageIcon from '@mui/icons-material/Image'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LoopIcon from '@mui/icons-material/Loop'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PublicIcon from '@mui/icons-material/Public'
import SendIcon from '@mui/icons-material/Send'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import { Avatar, Box, Divider, Typography } from '@mui/material'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

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

export default LinkedInPost
