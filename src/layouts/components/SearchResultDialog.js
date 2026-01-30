// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import MuiDialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const Dialog = styled(MuiDialog)({
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)'
  },
  '& .MuiDialog-paper': {
    overflow: 'hidden',
    '&:not(.MuiDialog-paperFullScreen)': {
      height: '100%',
      maxHeight: 550,
      overflowY: 'scroll'
    }
  }
})

const NoResult = ({ value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
    <Box sx={{ mb: 2.5, color: 'text.primary' }}>
      <Icon icon='tabler:file-off' fontSize='5rem' />
    </Box>
    <Typography variant='h6' sx={{ mb: 11.5 }}>
      No results for <Typography component='span'>{`"${value}"`}</Typography>
    </Typography>
  </Box>
)

const SearchResultDialog = ({
  open,
  setOpenDialog,
  onClose,
  searchValue,
  handleSearchChange,
  hidden,
  options,
  handleOptionClick
}) => {
  const router = useRouter()

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            px: 4,
            pt: 4,
            backgroundColor: theme => theme.palette.background.paper
          }}
        >
          <TextField
            placeholder='Search...'
            autoFocus
            fullWidth
            value={searchValue}
            onChange={e => handleSearchChange(e.target.value)}
            variant='standard'
            InputProps={{
              disableUnderline: true,
              sx: {
                backgroundColor: theme => theme.palette.action.hover,
                borderRadius: 2,
                px: 3,
                py: 1.5,
                mb: 3
              },
              startAdornment: (
                <InputAdornment position='start'>
                  <Icon icon='tabler:search' fontSize='1.5rem' />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  {!hidden && <Typography sx={{ mr: 2.5, color: 'text.disabled' }}>[esc]</Typography>}
                  <IconButton size='small' onClick={onClose}>
                    <Icon icon='tabler:x' fontSize='1.25rem' />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Scrollable Result Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            px: 4,
            pb: 6,
            display: 'flex',
            flexDirection: 'column',
            ...(options.length === 0 && {
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px' // you can tweak this if needed
            })
          }}
        >
          {options.length === 0 ? (
            <NoResult value={searchValue} />
          ) : (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ px: 3, py: 0 }}>
                <Grid container spacing={2} sx={{ mt: 2, mx: 0 }}>
                  {['Users', 'Media Assets', 'Category', 'Sub Category', 'Warehouse', 'Branches', 'Trusted People'].map(
                    group => {
                      const groupItems = options.filter(opt => opt.label === group)
                      if (groupItems.length === 0) return null

                      return (
                        <Grid item xs={12} sm={6} key={group}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              mb: 1,
                              px: 2
                            }}
                          >
                            {group}
                          </Typography>
                          <Box sx={{ pb: 2 }}>
                            {groupItems.map(option => (
                              <Box
                                key={option.title}
                                onClick={() => handleOptionClick(option)}
                                sx={{
                                  cursor: 'pointer',
                                  px: 2,
                                  py: 1.3,
                                  borderRadius: 1,
                                  transition: 'background-color 0.2s ease',
                                  '&:hover': {
                                    backgroundColor: theme => theme.palette.action.hover
                                  }
                                }}
                              >
                                <Typography variant='body2'>{option.title}</Typography>
                              </Box>
                            ))}

                            <Box sx={{ px: 2, pt: 1.3 }}>
                              <Typography
                                onClick={() => {
                                  const groupToUrlMap = {
                                    Users: '/user',
                                    'Media Assets': '/media-library',
                                    Category: '/category',
                                    'Sub Category': '/subcategory',
                                    Warehouse: '/warehouse',
                                    Branches: '/branch',
                                    'Trusted People': '/trusted-people'
                                  }

                                  const baseUrl = groupToUrlMap[group]
                                  if (baseUrl) router.push(`${baseUrl}?search=${encodeURIComponent(searchValue)}`)

                                  setOpenDialog(false)
                                }}
                                sx={{
                                  cursor: 'pointer',
                                  color: 'primary.main',
                                  fontSize: '0.875rem',
                                  fontWeight: 500,
                                  '&:hover': {
                                    textDecoration: 'underline'
                                  }
                                }}
                              >
                                Read More...
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )
                    }
                  )}
                </Grid>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  )
}

export default SearchResultDialog
