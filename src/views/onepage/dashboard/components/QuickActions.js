import AddIcon from '@mui/icons-material/Add'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LinkIcon from '@mui/icons-material/Link'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { Avatar, Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'

const QuickActions = () => {
  const router = useRouter()

  const actions = [
    {
      title: 'Create New Post',
      description: 'Write and schedule a new post',
      icon: <AddIcon />,
      color: '#4299e1',
      path: '/one-page-tabs?tab=create-post'
    },
    {
      title: 'Use AI Template',
      description: 'Generate content with AI',
      icon: <SmartToyIcon />,
      color: '#805ad5',
      path: '/one-page-tabs?tab=ai-templates'
    },
    {
      title: 'Post Management',
      description: 'See scheduled posts',
      icon: <CalendarTodayIcon />,
      color: '#38b2ac',
      path: '/one-page-tabs?tab=post-management'
    },
    {
      title: 'Connect Account',
      description: 'Add social media account',
      icon: <LinkIcon />,
      color: '#48bb78',
      path: '/one-page-tabs?tab=settings'
    }
  ]

  return (
    <Paper
      elevation={2}
      sx={{
        p: 5,
        pt: 4,
        borderRadius: '12px'
      }}
    >
      <Box>
        <Typography variant='h6' sx={{ mb: 2, fontWeight: 500 }}>
          Quick Actions
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Stack spacing={3}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant='outlined'
              fullWidth
              onClick={() => router.push(action.path)}
              sx={{
                p: 2,
                justifyContent: 'flex-start',
                textAlign: 'left',
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: `${action.color}10`
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Avatar
                  sx={{
                    bgcolor: `${action.color}40`,
                    color: action.color,
                    width: 40,
                    height: 40
                  }}
                >
                  {action.icon}
                </Avatar>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                    {action.title}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {action.description}
                  </Typography>
                </Box>
              </Box>
            </Button>
          ))}
        </Stack>
      </Box>
    </Paper>
  )
}

export default QuickActions
