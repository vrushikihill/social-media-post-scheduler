import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import LoopIcon from '@mui/icons-material/Loop'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SendIcon from '@mui/icons-material/Send'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Avatar, Box, IconButton, Typography } from '@mui/material'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

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

export default TwitterPost
