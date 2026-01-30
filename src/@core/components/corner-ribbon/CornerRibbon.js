import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  leftRibbon: {
    position: 'absolute',
    top: '40px',
    right: '40px',
    backgroundColor: props => props.backgroundColor || theme.palette.primary.main,
    color: props => props.color || theme.palette.primary.contrastText,
    padding: '0 0.5rem',
    transform: 'translate(50%, -50%) rotate(45deg)',
    zIndex: 1,
    fontSize: '15px',
    width: '100%',
    textAlign: 'center'
  },
  rightRibbon: {
    position: 'absolute',
    top: '40px',
    left: '40px',
    backgroundColor: props => props.backgroundColor || theme.palette.primary.main,
    color: props => props.color || theme.palette.primary.contrastText,
    padding: '0 0.5rem',
    transform: 'translate(-50%, 0%) rotate(-45deg)',
    zIndex: 1,
    fontSize: '15px',
    width: '100%',
    textAlign: 'center'
  }
}))

const CornerRibbon = ({ text, backgroundColor, color, directions }) => {
  const classes = useStyles({ backgroundColor, color })

  return (
    <>
      {directions === 'right' ? (
        <div className={classes.rightRibbon}>{text}</div>
      ) : (
        <div className={classes.leftRibbon}>{text}</div>
      )}
    </>
  )
}

export default CornerRibbon
