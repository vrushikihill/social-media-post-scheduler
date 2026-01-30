import MessageIcon from '@mui/icons-material/Message'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { Box, CircularProgress, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import toast from 'react-hot-toast'
import api from 'utils/api'

const SocialShare = ({ anchorEl, setAnchorEl, phoneNumber, message, adjustment }) => {
  const open = Boolean(anchorEl)
  const [loading, setLoading] = useState(false)

  // Detect if the user is on a desktop or mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  // Use WhatsApp Web for desktop and WhatsApp app for mobile
  const whatsappUrl = isMobile
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSendSMS = async () => {
    setLoading(true)
    try {
      await api.post('/v1/sms/send', {
        number: phoneNumber,
        message:
          'Please use the code 123456 to log in to the MyPredict11 by Invention Hill. Please do not share this code with anyone for security reasons.'
      })
      toast.success('SMS sent successfully')
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Failed to send SMS')
    }
  }

  return (
    <Menu
      id='date-filter-menu'
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button'
      }}
    >
      <MenuItem onClick={() => window.open(whatsappUrl, '_blank')}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            fontSize: 14
          }}
        >
          <WhatsAppIcon fontSize='small' />
          WhatsApp
        </Box>
      </MenuItem>

      {!adjustment && (
        <MenuItem disabled={loading} onClick={() => handleSendSMS()}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              fontSize: 14
            }}
          >
            {loading && <CircularProgress size={20} color='inherit' />}
            <MessageIcon fontSize='small' />
            SMS
          </Box>
        </MenuItem>
      )}
    </Menu>
  )
}

export default SocialShare
