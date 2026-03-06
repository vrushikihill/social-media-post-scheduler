import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HubIcon from '@mui/icons-material/Hub'
import PostAddIcon from '@mui/icons-material/PostAdd'
import TodayIcon from '@mui/icons-material/Today'
import { Box, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { activityAPI } from 'src/services/socialMediaService'
import { facebookLogin } from 'src/utils/facebook'
import Activity from './components/Activity'
import PlatformStatus from './components/PlatformStatus'
import RecentPosts from './components/RecentPosts'
import UpcomingPosts from './components/UpcomingPosts'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)

  const [dashboardStats, setDashboardStats] = useState({
    totalPosts: 0,
    connectedPlatforms: 0,
    todaysPosts: 0,
    avgEngagement: '0%',
    scheduledPosts: 0,
    publishedPosts: 0,
    failedPosts: 0,
    draftPosts: 0
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await activityAPI.getStats()

      // console.log('Dashboard Stats Response:', response.data)

      const data = response.data?.data?.data
      if (data) {
        setDashboardStats({
          totalPosts: data.totalPosts || 0,
          connectedPlatforms: data.connectedPlatforms || 0,
          todaysPosts: data.todaysPosts || 0,
          avgEngagement: data.avgEngagement || '0%',
          scheduledPosts: data.scheduledPosts || 0,
          publishedPosts: data.publishedPosts || 0,
          failedPosts: data.failedPosts || 0,
          draftPosts: data.draftPosts || 0
        })
      }
    } catch (error) {
      // console.error('Error fetching dashboard stats:', error)
      toast.error('Error fetching dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  const activityData = [
    {
      label: 'Total Posts',
      qty: dashboardStats.totalPosts,
      description: 'Total posts in system',
      icon: <PostAddIcon />,
      color: '#4299e1'
    },
    {
      label: 'Connected Platforms',
      qty: dashboardStats.connectedPlatforms,
      description: 'Active accounts',
      icon: <HubIcon />,
      color: '#805ad5'
    },
    {
      label: "Today's Posts",
      qty: dashboardStats.todaysPosts,
      description: 'Scheduled for today',
      icon: <TodayIcon />,
      color: '#38b2ac'
    },
    {
      label: 'Published Posts',
      qty: dashboardStats.publishedPosts,
      description: 'Successfully published',
      icon: <CheckCircleIcon />,
      color: '#48bb78'
    },
    {
      label: 'Failed Posts',
      qty: dashboardStats.failedPosts,
      description: 'Needs attention',
      icon: <CancelIcon />,
      color: '#f56565'
    }
  ]

  // eslint-disable-next-line no-unused-vars
  const connectFacebook = async () => {
    try {
      const response = await facebookLogin({
        scope: 'pages_show_list,pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish'
      })

      if (response.authResponse) {
        toast.success('Facebook connected successfully!')

        // Send access token to your backend
        const apiResponse = await fetch('/api/social/facebook/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken: response.authResponse.accessToken,
            userID: response.authResponse.userID
          })
        })

        if (apiResponse.ok) {
          toast.success('Facebook account linked successfully!')

          // Refresh dashboard stats
          fetchDashboardStats()
        } else {
          toast.error('Failed to link Facebook account')
        }
      }
    } catch (error) {
      if (error.message.includes('HTTPS')) {
        toast.error('Facebook login requires HTTPS. Please use HTTPS or run on localhost for development.')
      } else if (error.message.includes('App ID')) {
        toast.error('Facebook App ID not configured. Please check your environment variables.')
      } else {
        toast.error('Failed to connect Facebook: ' + error.message)
      }
    }
  }

  return (
    <>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 600, mb: 1 }}>
            Social Media Dashboard
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Manage your social media presence from one place
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={5.5}>
        {/* Statistics Cards */}
        <Activity activityData={activityData} loading={loading} />

        {/* Platform Status */}
        <Grid item xs={12} md={12}>
          <PlatformStatus />
        </Grid>

        {/* Upcoming Posts */}
        <Grid item xs={12} md={6}>
          <UpcomingPosts loading={loading} />
        </Grid>

        {/* Recent Posts */}
        <Grid item xs={12} md={6}>
          <RecentPosts loading={loading} />
        </Grid>

      
      </Grid>
    </>
  )
}

export default Dashboard
