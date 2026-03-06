import React from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Controller } from 'react-hook-form'
import FacebookPost from '../components/FacebookPost'
import FacebookReel from '../components/FacebookReel'
import FacebookStory from '../components/FacebookStory'
import InstagramPost from '../components/InstagramPost'
import InstagramReel from '../components/InstagramReel'
import InstagramStory from '../components/InstagramStory'
import LinkedInPost from '../components/LinkedInPost'
import TwitterPost from '../components/TwitterPost'
import { PLATFORM_CAPABILITIES } from './utils'

export const Preview = ({ showPreview, accounts, selectedAccountIds, control, localMediaFiles }) => {
  if (!showPreview) {
    return null
  }

  return (
    <Controller
      name='content'
      control={control}
      render={({ field: { value: content } }) => (
        <Controller
          name='postType'
          control={control}
          render={({ field: { value: postType } }) => (
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
                    (() => {
                      const account = accounts.find(acc => acc.provider === 'instagram-business')
                      const capabilities = PLATFORM_CAPABILITIES['instagram-business'] || []

                      if (!capabilities.includes(postType)) {
                        return (
                          <Box
                            sx={{
                              p: 2,
                              border: theme => `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              bgcolor: 'background.paper'
                            }}
                          >
                            <Typography variant='body2' color='text.secondary'>
                              Instagram: {postType} not supported
                            </Typography>
                          </Box>
                        )
                      }

                      // Convert local media files to preview format
                      const previewMediaFiles = localMediaFiles.map(file => ({
                        url: file.previewUrl,
                        fileUrl: file.previewUrl,
                        type: file.type,
                        size: file.size
                      }))

                      if (postType === 'post') {
                        return <InstagramPost account={account} mediaFiles={previewMediaFiles} content={content} />
                      } else if (postType === 'story') {
                        return <InstagramStory account={account} mediaFiles={previewMediaFiles} content={content} />
                      } else if (postType === 'reel') {
                        return <InstagramReel account={account} mediaFiles={previewMediaFiles} content={content} />
                      }
                    })()}

                  {selectedAccountIds.includes(accounts.find(acc => acc.provider === 'facebook')?.id) &&
                    (() => {
                      const account = accounts.find(acc => acc.provider === 'facebook')
                      const capabilities = PLATFORM_CAPABILITIES['facebook'] || []

                      if (!capabilities.includes(postType)) {
                        return (
                          <Box
                            sx={{
                              p: 2,
                              border: theme => `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              bgcolor: 'background.paper'
                            }}
                          >
                            <Typography variant='body2' color='text.secondary'>
                              Facebook: {postType} not supported
                            </Typography>
                          </Box>
                        )
                      }

                      // Convert local media files to preview format
                      const previewMediaFiles = localMediaFiles.map(file => ({
                        url: file.previewUrl,
                        fileUrl: file.previewUrl,
                        type: file.type,
                        size: file.size
                      }))

                      if (postType === 'post') {
                        return <FacebookPost account={account} mediaFiles={previewMediaFiles} content={content} />
                      } else if (postType === 'story') {
                        return <FacebookStory account={account} mediaFiles={previewMediaFiles} content={content} />
                      } else if (postType === 'reel') {
                        return <FacebookReel account={account} mediaFiles={previewMediaFiles} content={content} />
                      }
                    })()}

                  {selectedAccountIds.includes(accounts.find(acc => acc.provider === 'linkedin')?.id) &&
                    (() => {
                      const account = accounts.find(acc => acc.provider === 'linkedin')
                      const capabilities = PLATFORM_CAPABILITIES['linkedin'] || []

                      if (!capabilities.includes(postType)) {
                        return (
                          <Box
                            sx={{
                              p: 2,
                              border: theme => `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              bgcolor: 'background.paper'
                            }}
                          >
                            <Typography variant='body2' color='text.secondary'>
                              LinkedIn: {postType} not supported
                            </Typography>
                          </Box>
                        )
                      }

                      // Convert local media files to preview format
                      const previewMediaFiles = localMediaFiles.map(file => ({
                        url: file.previewUrl,
                        fileUrl: file.previewUrl,
                        type: file.type,
                        size: file.size
                      }))

                      return <LinkedInPost account={account} mediaFiles={previewMediaFiles} content={content} />
                    })()}

                  {selectedAccountIds.includes(accounts.find(acc => acc.provider === 'twitter')?.id) &&
                    (() => {
                      const account = accounts.find(acc => acc.provider === 'twitter')
                      const capabilities = PLATFORM_CAPABILITIES['twitter'] || []

                      if (!capabilities.includes(postType)) {
                        return (
                          <Box
                            sx={{
                              p: 2,
                              border: theme => `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              bgcolor: 'background.paper'
                            }}
                          >
                            <Typography variant='body2' color='text.secondary'>
                              Twitter: {postType} not supported
                            </Typography>
                          </Box>
                        )
                      }

                      // Convert local media files to preview format
                      const previewMediaFiles = localMediaFiles.map(file => ({
                        url: file.previewUrl,
                        fileUrl: file.previewUrl,
                        type: file.type,
                        size: file.size
                      }))

                      return <TwitterPost account={account} mediaFiles={previewMediaFiles} content={content} />
                    })()}
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
        />
      )}
    />
  )
}
