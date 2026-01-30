import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ImageIcon from '@mui/icons-material/Image'
import InstagramIcon from '@mui/icons-material/Instagram'
import LoopIcon from '@mui/icons-material/Loop'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SendIcon from '@mui/icons-material/Send'
import { Avatar, Box, Typography } from '@mui/material'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

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

export default InstagramPost
