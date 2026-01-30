import { Box } from '@mui/material'
import { useState } from 'react'
import NotificationContent from './NotificationContent'

const Notifications = () => {
  const [settings, setSettings] = useState({
    postFailure: true,
    tokenExpiration: true,
    successfulPublishing: false,
    weeklyReport: true,
    dailyReminder: false
  })

  const handleSettingChange = setting => event => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }))
  }

  return (
    <Box>
      <NotificationContent handleSettingChange={handleSettingChange} settings={settings} />
    </Box>
  )
}

export default Notifications
