import { Box, Grid } from '@mui/material'
import Notifications from './notifications'
import SocialAccounts from './social-accounts'

const Settings = () => {
  return (
    <Box>
      <Grid container spacing={5}>
        {/* SocialAccounts Settings */}
        <Grid item xs={12}>
          <SocialAccounts />
        </Grid>

        {/* Notifications Settings */}
        <Grid item xs={12}>
          <Notifications />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Settings
