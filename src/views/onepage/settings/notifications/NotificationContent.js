import { Alert, Box, Divider, FormControlLabel, Paper, Switch, Typography } from '@mui/material'
import React from 'react'

const NotificationContent = ({ handleSettingChange, settings }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 5,
        pt: 4,
        borderRadius: '12px'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant='h6'>Notification Settings</Typography>
        </Box>
      </Box>
      <Box>
        <Alert severity='info' sx={{ mb: 3 }}>
          Email notifications will be sent to your registered email address.
        </Alert>

        <Typography variant='h6' sx={{ mb: 3 }}>
          Email Notifications
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={<Switch checked={settings.postFailure} onChange={handleSettingChange('postFailure')} />}
            label={
              <Box>
                <Typography variant='body1'>Post Failure Alerts</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Get notified when a scheduled post fails to publish
                </Typography>
              </Box>
            }
          />

          <Divider />

          <FormControlLabel
            control={<Switch checked={settings.tokenExpiration} onChange={handleSettingChange('tokenExpiration')} />}
            label={
              <Box>
                <Typography variant='body1'>Token Expiration Warnings</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Get notified when social media tokens are about to expire
                </Typography>
              </Box>
            }
          />

          <Divider />

          <FormControlLabel
            control={
              <Switch checked={settings.successfulPublishing} onChange={handleSettingChange('successfulPublishing')} />
            }
            label={
              <Box>
                <Typography variant='body1'>Successful Publishing</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Get notified when posts are successfully published
                </Typography>
              </Box>
            }
          />

          <Divider />

          <FormControlLabel
            control={<Switch checked={settings.weeklyReport} onChange={handleSettingChange('weeklyReport')} />}
            label={
              <Box>
                <Typography variant='body1'>Weekly Performance Report</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Receive a weekly summary of your social media performance
                </Typography>
              </Box>
            }
          />

          <Divider />

          <FormControlLabel
            control={<Switch checked={settings.dailyReminder} onChange={handleSettingChange('dailyReminder')} />}
            label={
              <Box>
                <Typography variant='body1'>Daily Posting Reminders</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Get daily reminders about upcoming scheduled posts
                </Typography>
              </Box>
            }
          />
        </Box>
      </Box>
    </Paper>
  )
}

export default NotificationContent
