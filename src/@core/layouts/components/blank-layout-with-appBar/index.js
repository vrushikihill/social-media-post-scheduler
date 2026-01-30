// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Hook
import { useSettings } from 'src/@core/hooks/useSettings'

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const BlankLayoutAppBar = () => {
  // ** Hooks & Vars
  const theme = useTheme()
  const { settings } = useSettings()
  const { skin } = settings

  return (
    <AppBar
      color='default'
      position='sticky'
      elevation={skin === 'bordered' ? 0 : 3}
      sx={{
        backgroundColor: 'background.paper',
        ...(skin === 'bordered' && { borderBottom: `1px solid ${theme.palette.divider}` })
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          p: theme => `${theme.spacing(0, 6)} !important`,
          minHeight: `${theme.mixins.toolbar.minHeight - (skin === 'bordered' ? 1 : 0)}px !important`
        }}
      >
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

          <Typography
            variant='h6'
            sx={{
              ml: 2.5,
              fontWeight: 600,
              lineHeight: '24px',
              fontSize: '1.375rem !important'
            }}
          >
            {themeConfig.appName}
          </Typography>
        </LinkStyled>
      </Toolbar>
    </AppBar>
  )
}

export default BlankLayoutAppBar
