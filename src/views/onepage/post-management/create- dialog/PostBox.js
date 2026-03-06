import React from 'react'
import {
  Avatar,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ImageIcon from '@mui/icons-material/Image'
import CloseIcon from '@mui/icons-material/Close'
import CropIcon from '@mui/icons-material/Crop'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Controller } from 'react-hook-form'
import {
  getAccountIcon,
  PLATFORM_CAPABILITIES,
  getAllowMultiple,
  getAcceptedFileTypes,
  getFileTypeHint,
  getAspectRatioHint
} from './utils'
import dayjs from 'dayjs'

export const PostBox = ({
  control,
  accounts,
  handleToggleAccount,
  handleUnselectAll,
  handleSelectAll,
  selectedAccountIds,
  localMediaFiles,
  handleRemoveMedia,
  handleCropImage,
  handleClearAllMedia,
  fileInputRef,
  uploadingMedia,
  handleFileSelect,
  availablePostTypes,
  selectedAccounts,
  isScheduled,
  postType,
  invalidImages
}) => {
  const getPostTypeLabel = type => {
    switch (type) {
      case 'post':
        return 'Post'
      case 'reel':
        return 'Reel'
      case 'story':
        return 'Story'
      default:
        return type
    }
  }

  const getDisabledTooltip = type => {
    if (selectedAccounts.length === 0) return 'Select an account first'

    const unsupportedPlatforms = selectedAccounts
      .filter(account => {
        const capabilities = PLATFORM_CAPABILITIES[account.provider] || []

        return !capabilities.includes(type)
      })
      .map(account => account.provider)

    if (unsupportedPlatforms.length > 0) {
      return `${getPostTypeLabel(type)} not supported for: ${unsupportedPlatforms.join(', ')}`
    }

    return ''
  }

  return (
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          {selectedAccountIds.length > 0 && (
            <Button size='small' sx={{ textTransform: 'none', color: 'text.secondary' }} onClick={handleUnselectAll}>
              Unselect All
            </Button>
          )}
          {selectedAccountIds.length < accounts.length && accounts.length > 0 && (
            <Button size='small' sx={{ textTransform: 'none', color: 'primary.main' }} onClick={handleSelectAll}>
              Select All
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, overflowX: 'auto', pb: 1, minHeight: 50 }}>
        {accounts.map(account => (
          <Tooltip
            key={account.id}
            title={`${
              account.accountName ||
              account.metadata?.username ||
              account.metadata?.name ||
              account.name ||
              account.provider
            } (${account.provider})`}
            arrow
          >
            <Box
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
          </Tooltip>
        ))}

        {accounts.length === 0 && (
          <Typography variant='caption' color='text.secondary'>
            No connected accounts found.
          </Typography>
        )}
      </Box>

      {/* Selected Accounts Info */}
      {selectedAccounts.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography variant='caption' color='text.secondary'>
            Selected ({selectedAccounts.length}): {selectedAccounts.map(acc => acc.provider).join(', ')}
          </Typography>
        </Box>
      )}

      {/* Post Type */}
      <Controller
        name='postType'
        control={control}
        render={({ field }) => (
          <RadioGroup row {...field} sx={{ gap: 2 }}>
            {['post', 'reel', 'story'].map(type => {
              const isAvailable = availablePostTypes.includes(type)
              const tooltip = getDisabledTooltip(type)

              return (
                <Tooltip key={type} title={!isAvailable ? tooltip : ''} arrow>
                  <FormControlLabel
                    value={type}
                    disabled={!isAvailable}
                    control={
                      <Radio
                        sx={{
                          color: 'divider',
                          '&.Mui-checked': {
                            color: 'primary.main'
                          },
                          '&.Mui-disabled': {
                            color: 'action.disabled'
                          }
                        }}
                      />
                    }
                    label={
                      <Typography
                        fontSize={14}
                        color={
                          isAvailable ? (field.value === type ? 'text.primary' : 'text.secondary') : 'action.disabled'
                        }
                      >
                        {getPostTypeLabel(type)}
                      </Typography>
                    }
                  />
                </Tooltip>
              )
            })}
          </RadioGroup>
        )}
      />

      {/* Schedule Toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: 'action.hover',
          mb: 1
        }}
      >
        <ScheduleIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant='body2' fontWeight={600} color='text.primary'>
            Schedule for later
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            Post at a specific date and time
          </Typography>
        </Box>
        <Controller
          name='isScheduled'
          control={control}
          render={({ field }) => <Switch {...field} checked={field.value} disabled={selectedAccountIds.length === 0} />}
        />
      </Box>

      {/* DateTime Picker */}
      {isScheduled && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name='scheduledAt'
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                label='Schedule Date & Time'
                value={field.value ? dayjs(field.value) : null}
                onChange={newValue => field.onChange(newValue?.toDate())}
                minDateTime={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: !field.value && isScheduled,
                    helperText: !field.value && isScheduled ? 'Please select a date and time' : '',
                    sx: { mb: 2 }
                  }
                }}
              />
            )}
          />
        </LocalizationProvider>
      )}

      {/* Content Field */}
      <Controller
        name='content'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
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
        )}
      />

      {/* Media Upload */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Media Files and Clear Button */}
        {localMediaFiles.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='body2' fontWeight={600} color='text.primary'>
              Media Files ({localMediaFiles.length})
            </Typography>
            <Button
              size='small'
              variant='outlined'
              color='error'
              onClick={handleClearAllMedia}
              sx={{ textTransform: 'none' }}
            >
              Clear All
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {localMediaFiles.map((mediaFile, index) => {
            const isInvalid = invalidImages.some(invalid => invalid.index === index)

            return (
              <Box
                key={index}
                sx={{
                  width: 100,
                  height: 100,
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: theme => `2px solid ${isInvalid ? theme.palette.warning.main : theme.palette.divider}`,
                  boxShadow: isInvalid ? theme => `0 0 8px ${theme.palette.warning.main}40` : 'none'
                }}
              >
                {mediaFile.type && mediaFile.type.startsWith('video') ? (
                  <video src={mediaFile.previewUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img
                    src={mediaFile.previewUrl}
                    alt='media'
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}

                {/* Invalid aspect ratio indicator */}
                {isInvalid && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      left: 4,
                      bgcolor: 'warning.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 12 }} />
                  </Box>
                )}

                {/* Cropped indicator */}
                {mediaFile.isCropped && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'success.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CropIcon sx={{ fontSize: 12 }} />
                  </Box>
                )}

                <Box sx={{ position: 'absolute', bottom: 4, right: 4, display: 'flex', gap: 0.5 }}>
                  {/* Crop button for images */}
                  {mediaFile.type && mediaFile.type.startsWith('image/') && (
                    <IconButton
                      size='small'
                      onClick={() => handleCropImage(index)}
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                        p: 0.5
                      }}
                      title='Crop Image'
                    >
                      <CropIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  )}

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
                    title='Remove'
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              </Box>
            )
          })}

          {(() => {
            // Check if we already have a video - if so, hide the entire add more area
            const hasVideo = localMediaFiles.some(file => {
              const fileType = file.type || (file.file && file.file.type)

              return fileType && fileType.startsWith('video/')
            })

            // Hide add more area if video exists (since only 1 video allowed)
            if (hasVideo) {
              return null
            }

            // Show add more area for images or when no files
            return (
              <Box
                component='label'
                sx={{
                  width: localMediaFiles.length > 0 ? 100 : '100%',
                  height: localMediaFiles.length > 0 ? 100 : 'auto',
                  minHeight: 100,
                  border: theme => `2px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: localMediaFiles.length > 0 ? 1 : 5,
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
                  multiple={getAllowMultiple(selectedAccounts, postType, localMediaFiles)}
                  accept={getAcceptedFileTypes(selectedAccounts, postType, localMediaFiles)}
                  onChange={handleFileSelect}
                  disabled={selectedAccountIds.length === 0}
                />
                {uploadingMedia ? (
                  <Typography fontSize={12} color='text.secondary'>
                    Uploading...
                  </Typography>
                ) : (
                  <>
                    {localMediaFiles.length === 0 ? (
                      <>
                        <ImageIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                        <Typography fontSize={14} color='text.secondary' mb={1}>
                          {selectedAccountIds.length === 0
                            ? 'Select an account first'
                            : (() => {
                                const hint = getFileTypeHint(selectedAccounts, postType, localMediaFiles)
                                const allowMultiple = getAllowMultiple(selectedAccounts, postType, localMediaFiles)

                                if (!allowMultiple && hint.includes('video')) {
                                  return `${hint} (single video only)`
                                }

                                return hint
                              })()}
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
                      (() => {
                        // Check if we already have a video - if so, hide the add more button
                        const hasVideo = localMediaFiles.some(file => {
                          const fileType = file.type || (file.file && file.file.type)

                          return fileType && fileType.startsWith('video/')
                        })

                        // Hide add more button if video exists (since only 1 video allowed)
                        if (hasVideo) {
                          return null
                        }

                        // Show add more button for images or when no files
                        return (
                          <Box sx={{ textAlign: 'center' }}>
                            <ImageIcon sx={{ fontSize: 24, color: 'text.secondary' }} />
                            <Typography fontSize={10} color='text.secondary'>
                              Add
                            </Typography>
                          </Box>
                        )
                      })()
                    )}
                  </>
                )}
              </Box>
            )
          })()}
        </Box>
      </Box>

      {/* Media Type Restriction Info */}
      {localMediaFiles.length > 0 && (
        <Box
          sx={{
            mt: 1,
            p: 2,
            borderRadius: 1,
            border: theme => `1px solid ${theme.palette.info.main}`
          }}
        >
          <Typography variant='caption' color='info.dark' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoOutlinedIcon sx={{ fontSize: 14 }} />
            {(() => {
              const imageFiles = localMediaFiles.filter(file => {
                const fileType = file.type || (file.file && file.file.type)

                return fileType && fileType.startsWith('image/')
              })

              const videoFiles = localMediaFiles.filter(file => {
                const fileType = file.type || (file.file && file.file.type)

                return fileType && fileType.startsWith('video/')
              })

              if (imageFiles.length > 0 && videoFiles.length === 0) {
                return `${imageFiles.length} image(s) selected. You can add more images or remove all to upload a video instead.`
              } else if (videoFiles.length > 0 && imageFiles.length === 0) {
                return `1 video selected. Only one video allowed per post. Remove to upload images or different video.`
              } else if (imageFiles.length > 0 && videoFiles.length > 0) {
                return `Mixed media detected! Please keep only images OR videos, not both.`
              }

              return `${localMediaFiles.length} file(s) ready. Files will be uploaded when you post.`
            })()}
          </Typography>
        </Box>
      )}

      {/* Aspect Ratio Requirements Hint */}
      {selectedAccounts.length > 0 && getAspectRatioHint(selectedAccounts, postType) && (
        <Box
          sx={{
            mt: 1,
            p: 2,
            borderRadius: 1,
            border: theme => `1px solid ${theme.palette.info.main}`
          }}
        >
          <Typography variant='caption' color='info.dark' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoOutlinedIcon sx={{ fontSize: 14 }} />
            Image requirements: {getAspectRatioHint(selectedAccounts, postType)}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
