// Mui Components
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CheckIcon from '@mui/icons-material/Check'
import { Box, Divider, Menu, MenuItem, TextField, Typography } from '@mui/material'

// Third-party Components
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// Components
import SearchField from '../search'

const DateFilterMenu = ({
  anchorEl,
  setAnchorEl,
  selectedFilter,
  setSelectedFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setSearchValue,
  searchValue,
  showCustomFilter = true
}) => {
  const open = Boolean(anchorEl)

  const handleOnChange = dates => {
    const [start, end] = dates

    const _endDate = end ? new Date(end.setDate(end.getDate() + 1)) : null

    const startDate = start ? new Date(start.setUTCHours(0, 0, 0, 0)) : null
    const endDate = _endDate ? new Date(_endDate.setUTCHours(23, 59, 59, 999)) : null

    setStartDate(startDate)
    setEndDate(endDate)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = filter => {
    setSelectedFilter(filter)

    const today = new Date()
    let startDate, endDate

    switch (filter) {
      case 'All':
        startDate = null
        endDate = null
        break
      case 'Today':
        startDate = today
        endDate = today
        break
      case 'This Week':
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay()) // Set to the start of the week (Sunday)
        startDate = startOfWeek
        endDate = today
        break
      case 'This Month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1) // Start of the month
        startDate = startOfMonth
        endDate = today
        break
      case 'Last Month':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1) // Start of last month
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0) // End of last month
        startDate = lastMonth
        endDate = endOfLastMonth
        break
      case 'Last 6 Months':
        const startOfLast6Months = new Date(today)
        startOfLast6Months.setMonth(today.getMonth() - 6) // 6 months ago
        startDate = startOfLast6Months
        endDate = today
        break
      case 'This Year':
        const startOfYear = new Date(today.getFullYear(), 0, 1) // Start of this year
        startDate = startOfYear
        endDate = today
        break
      default:
        startDate = null
        endDate = null
    }

    setStartDate(filter !== 'All' ? new Date(startDate.setUTCHours(0, 0, 0, 0)) : null)
    setEndDate(filter !== 'All' ? new Date(endDate.setUTCHours(23, 59, 59, 999)) : null)
    handleClose()
  }

  // Custom Input for the DatePicker
  const CustomInput = ({ value, onClick }) => {
    return (
      <TextField
        size='small'
        onClick={onClick}
        value={value || ''}
        placeholder='Select Date Range'
        InputProps={{
          endAdornment: <CalendarMonthIcon />
        }}
        fullWidth
      />
    )
  }

  return (
    <div>
      <Menu
        id='date-filter-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'date-filter-button'
        }}
        sx={{
          '& .MuiMenu-paper': {
            width: 300
          }
        }}
      >
        {['All', 'Today', 'This Week', 'This Month', 'Last Month', 'Last 6 Months', 'This Year'].map(filter => (
          <MenuItem key={filter} onClick={() => handleMenuItemClick(filter)}>
            <Typography variant='body2'>{filter}</Typography>
            {filter === selectedFilter && <CheckIcon sx={{ ml: 1 }} fontSize='small' />}
          </MenuItem>
        ))}

        <Divider />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            px: 3,
            py: 1
          }}
        >
          <Typography variant='body1' sx={{ mb: 1 }}>
            Custom Date Range
          </Typography>
          <DatePickerWrapper sx={{ mb: 2 }}>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={handleOnChange}
              customInput={<CustomInput />}
              shouldCloseOnSelect={false}
            />
          </DatePickerWrapper>
        </Box>
        {showCustomFilter && (
          <>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                px: 3,
                py: 1
              }}
            >
              <Typography variant='body1' sx={{ mb: 1 }}>
                Custom Filter
              </Typography>
              <SearchField
                value={searchValue}
                fullWidth
                onChange={e => {
                  setSearchValue(e.target.value)
                }}
                placeholder='Search your own filter...'
              />
            </Box>
          </>
        )}
      </Menu>
    </div>
  )
}

export default DateFilterMenu
