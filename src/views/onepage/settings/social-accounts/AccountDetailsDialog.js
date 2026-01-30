import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import React from 'react'
import InfoIcon from '@mui/icons-material/Info'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PostAddIcon from '@mui/icons-material/PostAdd'
import SyncIcon from '@mui/icons-material/Sync'
import TokenIcon from '@mui/icons-material/Token'
import { format, formatDistanceToNow } from 'date-fns'

const AccountDetailsDialog = ({ open, onClose, account, getPlatformColor, getPlatformIcon }) => {
  if (!account) return null

  const getStatusColor = status => {
    const colors = {
      active: 'success',
      expired: 'error',
      revoked: 'error',
      pending: 'warning'
    }

    return colors[status] || 'default'
  }

  const accountDetails = [
    {
      label: 'Platform',
      value: account.platform,
      icon: <InfoIcon />
    },
    {
      label: 'Account ID',
      value: account.pageId || account.businessId || account.platformUserId || 'N/A',
      icon: <TokenIcon />
    },
    {
      label: 'Status',
      value: account.status,
      icon: <SyncIcon />,
      chip: true
    },
    {
      label: 'Scheduled Posts',
      value: account.postsCount,
      icon: <PostAddIcon />
    },
    {
      label: 'Last Sync',
      value: formatDistanceToNow(new Date(account.lastSync), { addSuffix: true }),
      icon: <AccessTimeIcon />,
      subtitle: format(new Date(account.lastSync), 'PPpp')
    }
  ]

  if (account.tokenExpiry) {
    accountDetails.push({
      label: 'Token Expires',
      value: format(new Date(account.tokenExpiry), 'PPP'),
      icon: <TokenIcon />,
      subtitle: formatDistanceToNow(new Date(account.tokenExpiry), { addSuffix: true })
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={account.accountAvatar}
            sx={{
              bgcolor: getPlatformColor(account.platform),
              color: 'common.white',
              width: 48,
              height: 48
            }}
          >
            {!account.accountAvatar && getPlatformIcon(account.platform)}
          </Avatar>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              {account.accountName}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ textTransform: 'capitalize' }}>
              {account.platform} Account Details
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
            Account Information
          </Typography>

          <List sx={{ p: 0 }}>
            {accountDetails.map((detail, index) => (
              <React.Fragment key={detail.label}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>{detail.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant='body2' color='text.secondary'>
                          {detail.label}:
                        </Typography>
                        {detail.chip ? (
                          <Chip
                            label={detail.value}
                            color={getStatusColor(detail.value)}
                            size='small'
                            sx={{ textTransform: 'capitalize' }}
                          />
                        ) : (
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {detail.value}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={detail.subtitle}
                  />
                </ListItem>
                {index < accountDetails.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* Platform Specific Information */}
        <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
            Platform Permissions
          </Typography>

          <Grid container spacing={2}>
            {account.platform === 'facebook' && (
              <>
                <Grid item xs={12}>
                  <Typography variant='body2'>✓ Manage and publish posts to Facebook pages</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2'>✓ Read engagement metrics and insights</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2'>✓ Access Facebook pages list</Typography>
                </Grid>
              </>
            )}

            {account.platform === 'instagram' && (
              <>
                <Grid item xs={12}>
                  <Typography variant='body2'>✓ Publish posts to Instagram business account</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2'>✓ Access basic profile information</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2'>✓ Read engagement metrics</Typography>
                </Grid>
              </>
            )}

            {account.platform === 'linkedin' && (
              <>
                <Grid item xs={12}>
                  <Typography variant='body2'>✓ Publish posts to LinkedIn profile and company pages</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2'>✓ Access basic profile information</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2'>✓ Read engagement metrics</Typography>
                </Grid>
              </>
            )}

            {account.platform === 'twitter' && (
              <>
                <Grid item xs={12}>
                  <Typography variant='body2'>✓ Publish tweets on your behalf</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2'>✓ Read your profile information</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2'>✓ Access engagement metrics</Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant='contained'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AccountDetailsDialog
