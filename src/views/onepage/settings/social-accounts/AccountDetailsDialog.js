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
import SyncIcon from '@mui/icons-material/Sync'
import TokenIcon from '@mui/icons-material/Token'

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
      value: account.providerAccountId || 'N/A',
      icon: <TokenIcon />
    },
    {
      label: 'Status',
      value: account.status,
      icon: <SyncIcon />,
      chip: true
    }
  ]

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
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }} color='text.primary'>
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
                          <Typography variant='body2' sx={{ fontWeight: 600 }} color='text.primary'>
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
        <Paper sx={{ p: 3, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }} color='text.primary'>
            Platform Permissions
          </Typography>

          <Grid container spacing={2}>
            {account.platform === 'facebook' && (
              <>
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.primary'>
                    ✓ Manage and publish posts to Facebook pages
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.primary'>
                    ✓ Read engagement metrics and insights
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.primary'>
                    ✓ Access Facebook pages list
                  </Typography>
                </Grid>
              </>
            )}

            {(account.platform === 'instagram' || account.platform === 'instagram-business') && (
              <>
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.primary'>
                    ✓ Publish posts to Instagram business account
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.primary'>
                    ✓ Access basic profile information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.primary'>
                    ✓ Read engagement metrics
                  </Typography>
                </Grid>
              </>
            )}

            {account.platform === 'linkedin' && (
              <>
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.primary'>
                    ✓ Publish posts to LinkedIn profile and company pages
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.primary'>
                    ✓ Access basic profile information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.primary'>
                    ✓ Read engagement metrics
                  </Typography>
                </Grid>
              </>
            )}

            {account.platform === 'twitter' && (
              <>
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.primary'>
                    ✓ Publish tweets on your behalf
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.primary'>
                    ✓ Read your profile information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.primary'>
                    ✓ Access engagement metrics
                  </Typography>
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
