import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FacebookIcon from '@mui/icons-material/Facebook'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ImageIcon from '@mui/icons-material/Image'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PublicIcon from '@mui/icons-material/Public'
import ReplyIcon from '@mui/icons-material/Reply'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import { Avatar, Box, Typography } from '@mui/material'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

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

export default FacebookPost
