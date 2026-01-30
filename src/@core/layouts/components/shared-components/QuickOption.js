import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Dialog,
  FormControl,
  FormHelperText,
  Grid,
  List,
  ListItem,
  ListItemText,
  Menu,
  TextField,
  Typography
} from '@mui/material'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CustomAutocomplete from 'src/@core/components/autocomplete/Autocomplete'

const QuickOption = props => {
  const { settings = {} } = props // Default empty object for settings
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false) // Dialog state

  // const handleDropdownOpen = event => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleItemClick = (event, link) => {
    event.preventDefault()
    if (link === '/setting/user/create') {
      setIsDialogOpen(true) // Open dialog when 'Add Users' is clicked
    } else {
      router.push(link) // Navigate to other routes
    }
    setAnchorEl(null) // Close the menu
  }

  const { direction = 'ltr' } = settings

  const sections = [
    {
      title: 'GENERAL',
      items: [
        { name: 'Add Users', link: '/setting/user/create' },
        { name: 'Role', link: '/setting/roles/create' }
      ]
    },
    {
      title: 'SALES',
      items: [
        { name: 'Customer', link: '/sales/customer/create' },
        { name: 'Invoice', link: '/sales/invoice/create' },
        { name: 'Estimate', link: '/sales/estimate/create' }
      ]
    },
    {
      title: 'INVENTORY',
      items: [
        { name: 'Items', link: '/inventory/items/create' },
        { name: 'Inventory Adjustment', link: '/inventory/inventory_adjustments/create' }
      ]
    },
    {
      title: 'PURCHASES',
      items: [
        { name: 'Vendors', link: '/purchase/vendor/create' },
        { name: 'Purchase Orders', link: '/purchase/purchase-order/create' },
        { name: 'Vendor Bills', link: '/purchase/bills/create' }
      ]
    }
  ]

  return (
    <Fragment>
      {/* <Tooltip title='Quick Create' arrow>
        <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen}>
          <AddIcon />
        </IconButton>
      </Tooltip> */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ '& .MuiMenu-paper': { mt: 4.5 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ p: 4, minWidth: 750 }}>
          <Grid container spacing={2}>
            {sections.map((section, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Typography variant='body2' sx={{ p: 1, pl: 2 }}>
                  {section.title}
                </Typography>
                <List>
                  {section.items.map((item, idx) => (
                    <ListItem key={idx} onClick={event => handleItemClick(event, item.link)}>
                      <ListItemText
                        primary={
                          <Typography
                            variant='body2'
                            sx={{
                              fontSize: '0.875rem',
                              color: 'text.primary',
                              paddingBottom: 0,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              '&:hover': { color: 'primary.main' }
                            }}
                          >
                            <AddIcon fontSize='14px' sx={{ mr: 2 }} />
                            {item.name}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Menu>
      <CreateDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </Fragment>
  )
}

export default QuickOption

const CreateDialog = ({ open, onClose }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    mode: 'onChange'
  })

  const onSubmit = () => {
    reset() // Reset form on successful submission
    onClose() // Close dialog after submission
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} sx={{ '& .MuiPaper-root': { width: '100%', maxHeight: 700 } }} fullWidth>
        <Box sx={{ p: 5, pb: 4, pl: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6'>Create New User</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 5, pb: 0 }}>
          <Typography variant='h6'>User Details</Typography>
        </Box>
        <Box sx={{ p: 5, pb: 3 }}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormControl fullWidth size='small'>
                <Controller
                  name='fname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      size='small'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      label='FirstName'
                      error={Boolean(errors.fname)}
                    />
                  )}
                />
                {errors.fname && <FormHelperText sx={{ color: 'error.main' }}>{errors.fname?.message}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormControl fullWidth size='small'>
                <Controller
                  name='lname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      size='small'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      label='LastName'
                      error={Boolean(errors.lName)}
                    />
                  )}
                />
                {errors.lName && <FormHelperText sx={{ color: 'error.main' }}>{errors.lName?.message}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormControl fullWidth size='small'>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      size='small'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      label='Email'
                      error={Boolean(errors.email)}
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email?.message}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ pl: 5 }}>
          <Typography variant='h6'>Roles</Typography>
        </Box>
        <Box sx={{ p: 5, pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <FormControl fullWidth size='small'>
                <Controller
                  name='userRole'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomAutocomplete
                      multiple
                      id='id'
                      label="User's Role"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      size='small'
                      options={[
                        { id: '1', name: 'Super Admin' },
                        { id: '2', name: 'Admin' },
                        { id: '3', name: 'Manager System' },
                        { id: '4', name: 'Manager' }
                      ]}
                      labelFieldName='name'
                      error={Boolean(errors.userRole)}
                    />
                  )}
                />
                {errors.userRole && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.userRole?.message}</FormHelperText>
                )}
              </FormControl>
              <Typography variant='body2'>A user can have one or several roles</Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Box sx={{ p: 6, display: 'flex', gap: 3 }}>
          <Button variant='contained' onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
          <Button variant='outlined' color='error' onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Dialog>
    </>
  )
}
