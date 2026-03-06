import { Box } from '@mui/material'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from 'src/services/api'
import NotificationContent from './NotificationContent'

const Notifications = () => {
  const [settings, setSettings] = useState({
    postFailure: true,
    tokenExpiration: true,
    successfulPublishing: false,
    weeklyReport: true,
    dailyReminder: false
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/v1/users/me/notifications')
        if (response.data) {
          let data = response.data?.data || response.data
          if (data?.notificationSettings) {
            data = data.notificationSettings
          }
          if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            // Merge to avoid undefined fields
            setSettings(prev => ({ ...prev, ...data }))
          }
        }
      } catch (error) {
        // console.error('Failed to fetch notification settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleSettingChange = setting => async event => {
    const newValue = event.target.checked
    setSettings(prev => ({
      ...prev,
      [setting]: newValue
    }))

    try {
      await api.put('/v1/users/me/notifications', {
        ...settings,
        [setting]: newValue
      })
      toast.success('Settings updated successfully')
    } catch (error) {
      // console.error('Failed to update settings:', error)
      toast.error('Failed to update settings')
      setSettings(prev => ({
        ...prev,
        [setting]: !newValue
      }))
    }
  }

  return (
    <Box>
      <NotificationContent handleSettingChange={handleSettingChange} settings={settings} />
    </Box>
  )
}

export default Notifications
