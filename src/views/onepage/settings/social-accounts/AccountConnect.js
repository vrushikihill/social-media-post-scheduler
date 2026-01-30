import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Typography,
  Tooltip,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import React, { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorIcon from '@mui/icons-material/Error'
import RefreshIcon from '@mui/icons-material/Refresh'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SyncIcon from '@mui/icons-material/Sync'
import InfoIcon from '@mui/icons-material/Info'
import { format, formatDistanceToNow } from 'date-fns'

const AccountConnect = ({
  getStatusColor,
  getPlatformColor,
  getPlatformIcon,
  account,
  handleRefreshToken,
  setSelectedAccount,
  setDisconnectDialogOpen,
  onSyncAccount,
  onViewDetails
}) => {
  const [loading, setLoading] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState(null)

  const handleRefresh = async () => {
    setLoading(true)
    try {
      await handleRefreshToken(account.id)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setLoading(true)
    try {
      await onSyncAccount?.(account.id)
    } finally {
      setLoading(false)
      setMenuAnchor(null)
    }
  }

  const getStatusIcon = status => {
    const icons = {
      active: <CheckCircleIcon />,
      expired: <ErrorIcon />,
      revoked: <ErrorIcon />,
      pending: <WarningIcon />
    }

    return icons[status] || <WarningIcon />
  }

  const getTokenExpiryWarning = () => {
    if (!account.tokenExpiry) return null

    const expiryDate = new Date(account.tokenExpiry)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 0) {
      return { severity: 'error', message: 'Token has expired' }
    } else if (daysUntilExpiry <= 7) {
      return {
        severity: 'warning',
        message: `Token expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`
      }
    }

    return null
  }

  const tokenWarning = getTokenExpiryWarning()

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        height: '100%',
        position: 'relative',
        border: account.status === 'expired' ? '2px solid' : '1px solid',
        borderColor: account.status === 'expired' ? 'error.main' : 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          elevation: 4,
          borderColor: getPlatformColor(account.platform)
        }
      }}
    >
      {/* Account Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
        <Avatar
          src={account.accountAvatar}
          sx={{
            bgcolor: getPlatformColor(account.platform),
            color: 'common.white',
            width: 48,
            height: 48,
            border: '2px solid',
            borderColor: 'background.paper'
          }}
        >
          {!account.accountAvatar && getPlatformIcon(account.platform)}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5 }} noWrap>
            {account.accountName}
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ textTransform: 'capitalize', mb: 1 }}>
            {account.platform}
          </Typography>
          <Chip
            label={account.status}
            color={getStatusColor(account.status)}
            size='small'
            icon={getStatusIcon(account.status)}
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>

        <IconButton size='small' onClick={e => setMenuAnchor(e.currentTarget)} disabled={loading}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* Token Expiry Warning */}
      {tokenWarning && (
        <Alert severity={tokenWarning.severity} sx={{ mb: 2, fontSize: '0.8rem' }}>
          {tokenWarning.message}
        </Alert>
      )}

      {/* Account Stats */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant='body2' color='text.secondary'>
            Scheduled Posts
          </Typography>
          <Typography variant='body2' fontWeight={600}>
            {account.postsCount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant='body2' color='text.secondary'>
            Last Sync
          </Typography>
          <Tooltip title={format(new Date(account.lastSync), 'PPpp')}>
            <Typography variant='body2' fontWeight={600}>
              {formatDistanceToNow(new Date(account.lastSync), { addSuffix: true })}
            </Typography>
          </Tooltip>
        </Box>

        {account.tokenExpiry && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='body2' color='text.secondary'>
              Token Expires
            </Typography>
            <Typography
              variant='body2'
              fontWeight={600}
              color={account.status === 'expired' ? 'error.main' : 'text.primary'}
            >
              {format(new Date(account.tokenExpiry), 'MMM dd, yyyy')}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {account.status === 'active' && (
          <Button
            variant='outlined'
            size='small'
            startIcon={loading ? <CircularProgress size={16} /> : <SyncIcon />}
            onClick={handleSync}
            disabled={loading}
            fullWidth
          >
            Sync Now
          </Button>
        )}
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            onViewDetails?.(account)
            setMenuAnchor(null)
          }}
        >
          <ListItemIcon>
            <InfoIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleSync()
          }}
          disabled={loading}
        >
          <ListItemIcon>
            <SyncIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Sync Account</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleRefresh()
          }}
          disabled={loading || account.status === 'active'}
        >
          <ListItemIcon>
            <RefreshIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Refresh Token</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setSelectedAccount(account)
            setDisconnectDialogOpen(true)
            setMenuAnchor(null)
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize='small' color='error' />
          </ListItemIcon>
          <ListItemText>
            <Typography color='error'>Disconnect</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  )
}

export default AccountConnect
