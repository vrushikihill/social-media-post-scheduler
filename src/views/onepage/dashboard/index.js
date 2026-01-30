import { Box, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { analyticsAPI } from 'src/services/socialMediaService'
import { facebookLogin } from 'src/utils/facebook'
import Activity from './components/Activity'
import FailedPosts from './components/FailedPosts'
import PlatformStatus from './components/PlatformStatus'
import RecentPosts from './components/RecentPosts'
import UpcomingPosts from './components/UpcomingPosts'
import FacebookIcon from '@mui/icons-material/Facebook'

const Dashboard = () => {
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
      const response = await analyticsAPI.getDashboardStats()
      setDashboardStats(response.data)
    } catch (error) {
      toast.error('Error fetching dashboard stats:', error)
    }
  }

  // Mock data for development
  const activityData = [
    {
      label: 'Total Posts',
      qty: dashboardStats.totalPosts || '24',
      description: 'All time posts',
      icon: '📝',
      color: '#4299e1',
      trend: {
        type: 'up',
        value: '+12%',
        period: 'this month'
      }
    },
    {
      label: 'Connected Platforms',
      qty: dashboardStats.connectedPlatforms || '4',
      description: 'Active integrations',
      icon: '🔗',
      color: '#805ad5',
      trend: {
        type: 'up',
        value: '+2',
        period: 'new platforms'
      }
    },
    {
      label: "Today's Posts",
      qty: dashboardStats.todaysPosts || '3',
      description: 'Scheduled for today',
      icon: '📅',
      color: '#38b2ac',
      trend: {
        type: 'up',
        value: '+1',
        period: 'from yesterday'
      }
    }
  ]

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
          <FacebookIcon onClick={connectFacebook} />
          <Typography variant='body2' color='text.secondary'>
            Manage your social media presence from one place
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={5.5}>
        {/* Statistics Cards */}
        <Activity activityData={activityData} />

        {/* Platform Status */}
        <Grid item xs={12} md={12}>
          <PlatformStatus />
        </Grid>

        {/* Upcoming Posts */}
        <Grid item xs={12} md={6}>
          <UpcomingPosts />
        </Grid>

        {/* Recent Posts */}
        <Grid item xs={12} md={6}>
          <RecentPosts />
        </Grid>

        {/* Failed Posts Alert */}
        {dashboardStats.failedPosts > 0 && (
          <Grid item xs={12}>
            <FailedPosts count={dashboardStats.failedPosts} />
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default Dashboard
