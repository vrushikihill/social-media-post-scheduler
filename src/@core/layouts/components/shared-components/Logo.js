import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack'
import { Box, Typography } from '@mui/material'

const Logo = ({ onClick, logo }) => {
  return (
    <>
      {!logo ? (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            border: theme => `1px dashed ${theme.palette.divider}`,
            borderRadius: 1,
            py: 8,
            mt: 5,
            cursor: 'pointer',
            '&:hover': {
              borderColor: theme => theme.palette.primary.main
            },
            minHeight: 200
          }}
          onClick={onClick}
        >
          <>
            <PhotoCameraBackIcon sx={{ fontSize: 40 }} />
            <Typography variant='body1'>Upload image here</Typography>
            <Typography variant='body1'>or</Typography>
            <Typography variant='body2' sx={{ textAlign: 'center', px: 2 }}>
              You can add an image of your item, not exceeding 5 MB.
            </Typography>
          </>
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            minHeight: 180,
            border: theme => `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            my: 8,
            mx: 7,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <img src={logo} alt='img' style={{ width: 250, height: 140 }} />
          </Box>
        </Box>
      )}
    </>
  )
}

export default Logo
