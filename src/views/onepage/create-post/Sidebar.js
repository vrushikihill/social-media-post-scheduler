import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { Avatar, Box, Button, Chip, Paper, Typography, Stack } from '@mui/material'
import { useRouter } from 'next/router'

const Sidebar = ({ getPlatformColor, getPlatformIcon, handlePlatformToggle, connectedAccounts, formData }) => {
  const router = useRouter()

  return (
    <>
      {/* Platform Selection */}
      <Paper
        elevation={2}
        sx={{
          p: 5,
          pt: 4,
          borderRadius: '12px'
        }}
      >
        {/* Header */}
        <Box>
          <Typography variant='h6' fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 2 }}>
            Select Platforms
            <Chip
              label={`${formData?.platforms?.length || 0} selected`}
              size='small'
              color='primary'
              variant='outlined'
            />
          </Typography>
        </Box>
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 3 }} />

        {/* Content */}
        <Box>
          {connectedAccounts?.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                No connected accounts found
              </Typography>
              <Button variant='outlined' onClick={() => router.push('/social-accounts')}>
                Connect Accounts
              </Button>
            </Box>
          ) : (
            <Stack spacing={2}>
              {connectedAccounts?.map(account => (
                <Box
                  key={account.id}
                  onClick={() => handlePlatformToggle(account.id)}
                  sx={{
                    p: 3,
                    border: '1px solid',
                    borderColor: formData?.platforms.includes(account.id)
                      ? theme => theme.palette.primary.main
                      : 'divider',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  {/* Platform Icon */}
                  <Avatar
                    sx={{
                      bgcolor: getPlatformColor(account.platform),
                      color: 'common.white',
                      width: 35,
                      height: 35,
                      fontSize: 20
                    }}
                  >
                    {getPlatformIcon(account.platform)}
                  </Avatar>

                  {/* Account Info */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary'
                      }}
                    >
                      {account.accountName}
                    </Typography>
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      sx={{
                        textTransform: 'capitalize',
                        fontSize: '0.75rem'
                      }}
                    >
                      {account.platform}
                    </Typography>
                  </Box>

                  {/* Selection Status */}
                  <Box>
                    {formData?.platforms.includes(account.id) ? (
                      <CheckCircleIcon
                        sx={{
                          color: theme => theme.palette.primary.main,
                          fontSize: 24
                        }}
                      />
                    ) : (
                      <RadioButtonUncheckedIcon
                        sx={{
                          color: 'text.secondary',
                          fontSize: 24
                        }}
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>
    </>
  )
}

export default Sidebar
