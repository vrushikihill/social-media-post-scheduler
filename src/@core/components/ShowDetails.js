import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
  parent: {
    position: 'relative',
    '&:hover $child': {
      height: '40px'
    },
    height: '100%'
  },
  child: {
    position: 'absolute',
    opacity: 0.8,
    bottom: 0,
    left: 0,
    width: '100%',
    height: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'height .3s ease-in-out',
    overflow: 'hidden',
    cursor: 'pointer'
  }
}))

const ShowDetailsWrapper = ({ children, onClick }) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <Box className={classes.parent}>
      {children}
      <Box className={classes.child} sx={{ backgroundColor: theme.palette.background.default }} onClick={onClick}>
        <Typography>View Details</Typography>
      </Box>
    </Box>
  )
}

export default ShowDetailsWrapper
