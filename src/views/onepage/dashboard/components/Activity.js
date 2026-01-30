import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Divider, Grid, Paper, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

const Activity = ({ activityData }) => {
  return (
    <Grid item xs={12} md={12}>
      <Paper
        elevation={2}
        sx={{
          p: 5,
          pt: 4,
          borderRadius: '12px'
        }}
      >
        <Box>
          <Typography
            variant='h6'
            fontWeight={500}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              pb: 2
            }}
          >
            Activity
          </Typography>
        </Box>
        <Divider />

        <Grid container spacing={4} sx={{ mt: 1 }}>
          {activityData.map((item, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  p: 4,
                  pt: 3,
                  border: theme => `1px solid ${theme.palette.divider}`,
                  borderRadius: '12px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                {/* Header with title and icon */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: item.color ? alpha(item.color, 0.2) : alpha('#4299e1', 0.2),
                      color: 'common.white',
                      width: 36,
                      height: 36,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}
                  >
                    {item.icon}
                  </Box>
                </Box>

                {/* Main value */}
                <Typography
                  variant='h4'
                  fontWeight='bold'
                  sx={{
                    fontSize: '28px',
                    lineHeight: 1
                  }}
                >
                  {item.qty}
                </Typography>

                {/* Description */}
                <Typography
                  variant='body2'
                  sx={{
                    fontSize: '13px'
                  }}
                >
                  {item.description}
                </Typography>

                {/* Trend indicator */}
                {item.trend && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                    {item.trend.type === 'up' ? (
                      <TrendingUpIcon sx={{ color: '#48bb78', fontSize: '16px' }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: '#f56565', fontSize: '16px' }} />
                    )}
                    <Typography
                      variant='caption'
                      sx={{
                        color: item.trend.type === 'up' ? '#48bb78' : '#f56565',
                        fontSize: '12px',
                        fontWeight: 500
                      }}
                    >
                      {item.trend.value}
                    </Typography>
                    <Typography
                      variant='caption'
                      sx={{
                        fontSize: '12px'
                      }}
                    >
                      {item.trend.period}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Grid>
  )
}

export default Activity
