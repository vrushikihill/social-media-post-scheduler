import { CircularProgress } from '@mui/material'

const Loader = ({ size, color }) => {
  return (
    <CircularProgress
      color={color}
      size={size}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -size / 2,
        marginLeft: -size / 2
      }}
    />
  )
}

export default Loader
