import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search'

const Filter = ({ setSearchQuery, platformFilter, setPlatformFilter, statusFilter, setStatusFilter, searchQuery }) => {
  return (
    <Box>
      <Grid container spacing={3} alignItems='center'>
        {/* Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size='small'
            placeholder='Search posts...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Platform Filter */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size='small'>
            <InputLabel>Platform</InputLabel>
            <Select
              value={platformFilter}
              onChange={e => setPlatformFilter(e.target.value)}
              input={<OutlinedInput label='Platform' />}
            >
              <MenuItem value=''>All Platforms</MenuItem>
              <MenuItem value='facebook'>Facebook</MenuItem>
              <MenuItem value='instagram'>Instagram</MenuItem>
              <MenuItem value='linkedin'>LinkedIn</MenuItem>
              <MenuItem value='twitter'>Twitter</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Status Filter */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size='small'>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              input={<OutlinedInput label='Status' />}
            >
              <MenuItem value=''>All Status</MenuItem>
              <MenuItem value='scheduled'>Scheduled</MenuItem>
              <MenuItem value='published'>Published</MenuItem>
              <MenuItem value='failed'>Failed</MenuItem>
              <MenuItem value='draft'>Draft</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Clear Filters */}
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant='outlined'
            onClick={() => {
              setSearchQuery('')
              setPlatformFilter('')
              setStatusFilter('')
            }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Filter
