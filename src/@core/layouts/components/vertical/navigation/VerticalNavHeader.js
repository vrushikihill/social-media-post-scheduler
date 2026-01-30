// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Styled Components
const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: '24px',
  fontSize: '1.275rem !important',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))

const LinkStyled = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = props => {
  // ** Props
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    navMenuBranding: userNavMenuBranding,
    menuUnlockedIcon: userMenuUnlockedIcon
  } = props

  // ** Hooks & Vars
  const theme = useTheme()
  const { mode, navCollapsed } = settings
  const menuCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 15) / 8
      }
    } else {
      return 4.5
    }
  }

  const conditionalColors = () => {
    if (mode === 'semi-dark') {
      return {
        '& .MuiTypography-root, & .MuiIconButton-root': {
          color: `rgba(${theme.palette.customColors.dark}, 0.87)`
        }
      }
    } else {
      return {
        '& .MuiTypography-root, & .MuiIconButton-root': {
          color: `rgba(${theme.palette.customColors.dark}, 0.87)`
        }
      }
    }
  }
  const MenuLockedIcon = () => userMenuLockedIcon || <Icon icon='tabler:circle-dot' />
  const MenuUnlockedIcon = () => userMenuUnlockedIcon || <Icon icon='tabler:circle' />

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: menuHeaderPaddingLeft(), ...conditionalColors() }}>
      {userNavMenuBranding ? (
        userNavMenuBranding(props)
      ) : (
        <LinkStyled href='/'>
          <svg width='36' height='26' viewBox='0 0 712 819' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M585.756 232.336L705 130.628C654.499 68.9012 571.726 34.7648 536.653 25.4125C258.884 -58.7599 88.9045 137.642 38.6357 246.365C-65.1768 496.076 95.9197 689.439 189.444 754.906V172.714C250.236 171.545 387.951 169.908 452.483 172.714C517.015 175.52 568.22 213.631 585.756 232.336Z'
              fill='white'
            />
            <path
              d='M340.251 807.514V642.677C491.761 662.317 567.05 608.774 585.756 579.547L705 691.777C595.578 820.841 416.241 822.712 340.251 807.514Z'
              fill='white'
            />
            <path
              d='M585.756 232.336L705 130.628C654.499 68.9012 571.726 34.7648 536.653 25.4125C258.884 -58.7599 88.9045 137.642 38.6357 246.365C-65.1768 496.076 95.9197 689.439 189.444 754.906V172.714C250.236 171.545 387.951 169.908 452.483 172.714C517.015 175.52 568.22 213.631 585.756 232.336Z'
              stroke='white'
              stroke-width='10'
            />
            <path
              d='M340.251 807.514V642.677C491.761 662.317 567.05 608.774 585.756 579.547L705 691.777C595.578 820.841 416.241 822.712 340.251 807.514Z'
              stroke='white'
              stroke-width='10'
            />
            <path d='M321 359C321 336.909 338.909 319 361 319H411V409H321V359Z' fill='white' />
            <path d='M411 409H501V459C501 481.091 483.091 499 461 499H411V409Z' fill='white' />
            <path
              d='M461 322C481.435 322 498 338.565 498 359V406H414V322H461Z'
              fill='#090854'
              stroke='white'
              stroke-width='6'
            />
            <path
              d='M408 412V496H361C340.565 496 324 479.435 324 459V412H408Z'
              fill='#090854'
              stroke='white'
              stroke-width='6'
            />
          </svg>

          <HeaderTitle variant='h6' sx={{ ...menuCollapsedStyles, ...(navCollapsed && !navHover ? {} : { ml: 2.5 }) }}>
            {themeConfig.appName}
          </HeaderTitle>
        </LinkStyled>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{
            p: 0,
            backgroundColor: 'transparent !important',
            color: `${
              mode === 'semi-dark' ? `rbga(${theme.palette.customColors.dark}, 0.6)` : theme.palette.text.secondary
            } !important`
          }}
        >
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </IconButton>
      ) : userMenuLockedIcon === null && userMenuUnlockedIcon === null ? null : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
          sx={{
            p: 0,
            backgroundColor: 'transparent !important',
            '& svg': {
              fontSize: '1.25rem',
              ...menuCollapsedStyles,
              transition: 'opacity .25s ease-in-out'
            }
          }}
        >
          {navCollapsed ? MenuUnlockedIcon() : MenuLockedIcon()}
        </IconButton>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
