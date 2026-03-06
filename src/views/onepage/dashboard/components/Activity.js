import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Divider, Grid, Paper, Skeleton, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

const Activity = ({ activityData, loading }) => {
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

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(5, 1fr)'
            },
            gap: 4,
            mt: 4
          }}
        >
          {activityData.map((item, index) => (
            <Box
              key={index}
              sx={{
                p: 4,
                pt: 3,
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: '12px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: item.color,
                  boxShadow: () => `0 4px 12px ${alpha(item.color, 0.1)}`,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {/* Header with title and icon */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                  variant='body2'
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'text.secondary'
                  }}
                >
                  {item.label}
                </Typography>
                <Box
                  sx={{
                    bgcolor: item.color ? alpha(item.color, 0.1) : alpha('#4299e1', 0.1),
                    color: item.color || '#4299e1',
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& svg': {
                      fontSize: '22px'
                    }
                  }}
                >
                  {item.icon}
                </Box>
              </Box>

              {/* Main value */}
              <Box sx={{ mt: 'auto' }}>
                {loading ? (
                  <Skeleton variant='text' width='60%' height={40} sx={{ mb: 1 }} />
                ) : (
                  <Typography
                    variant='h4'
                    fontWeight='bold'
                    sx={{
                      fontSize: '28px',
                      lineHeight: 1,
                      mb: 1
                    }}
                  >
                    {item.qty ?? 0}
                  </Typography>
                )}

                {/* Description */}
                {loading ? (
                  <Skeleton variant='text' width='80%' height={20} />
                ) : (
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: '12px',
                      color: 'text.secondary'
                    }}
                  >
                    {item.description}
                  </Typography>
                )}
              </Box>

              {/* Trend indicator */}
              {item.trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
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
          ))}
        </Box>
      </Paper>
    </Grid>
  )
}

export default Activity
