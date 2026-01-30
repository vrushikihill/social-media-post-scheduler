import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/router'

const FailedPosts = ({ count }) => {
  const router = useRouter()

  return (
    <Alert
      severity='error'
      sx={{
        borderRadius: 2,
        '& .MuiAlert-message': { width: '100%' }
      }}
      icon={<ErrorOutlineIcon />}
      action={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color='inherit'
            size='small'
            startIcon={<RefreshIcon />}
            onClick={() => router.push('/post-management?filter=failed')}
          >
            Retry All
          </Button>
          <Button
            color='inherit'
            size='small'
            variant='outlined'
            onClick={() => router.push('/post-management?filter=failed')}
          >
            View Details
          </Button>
        </Box>
      }
    >
      <AlertTitle sx={{ fontWeight: 600 }}>Failed Posts Alert</AlertTitle>
      <Typography variant='body2'>
        {count} post{count > 1 ? 's' : ''} failed to publish. This might be due to expired tokens or platform issues.
        Please review and retry the failed posts.
      </Typography>
    </Alert>
  )
}

export default FailedPosts
