// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import { IconButton } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import LogoutIcon from '@mui/icons-material/Logout'
import Icon from 'src/@core/components/icon'

// ** Context
import { useSelector } from 'react-redux'
import { getInitials } from 'src/@core/utils/get-initials'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = props => {
  // ** Props
  const { settings } = props

  // ** States
  const [drawerOpen, setDrawerOpen] = useState(false)

  // ** Hooks
  const { logout } = useAuth()

  const { user: owner } = useSelector(state => state.settings)
  const { name, user } = owner || {}

  // ** Vars
  const { direction } = settings

  const handleDrawerOpen = () => setDrawerOpen(true)
  const handleDrawerClose = () => setDrawerOpen(false)

  const handleLogout = () => {
    logout()
    handleDrawerClose()
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDrawerOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar sx={{ width: '2.5rem', height: '2.5rem' }}>{getInitials(name ?? '')}</Avatar>
      </Badge>

      {/* Drawer component */}
      <Drawer anchor={direction === 'ltr' ? 'right' : 'left'} open={drawerOpen} onClose={handleDrawerClose}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            overflowY: 'auto'
          }}
        >
          <Box>
            <Box sx={{ width: 370, py: 3, px: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', py: 4, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge
                    overlap='circular'
                    badgeContent={<BadgeContentSpan />}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Avatar sx={{ width: '2.5rem', height: '2.5rem' }}>{getInitials(name ?? '')}</Avatar>
                  </Badge>
                  <Box sx={{ ml: 2.5, display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500 }}>{name ?? ''}</Typography>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      {user?.email ?? ''}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={handleDrawerClose}>
                  <Icon icon='tabler:x' />
                </IconButton>
              </Box>

              <Divider sx={{ mb: 5 }} />
            </Box>
          </Box>
          <Box>
            <Divider sx={{ mx: 5 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main', p: 5 }}>
              <Button variant='text' color='error' sx={{ cursor: 'pointer' }} onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 2 }} />
                Sign Out
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Fragment>
  )
}

export default UserDropdown
