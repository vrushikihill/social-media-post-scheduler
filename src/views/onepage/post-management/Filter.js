import SearchIcon from '@mui/icons-material/Search'
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

const Filter = ({ setSearchQuery, platformFilter, setPlatformFilter, setStatusFilter, searchQuery }) => {
  return (
    <Box>
      <Grid container spacing={3} alignItems='center'>
        {/* Search */}
        <Grid item xs={12} md={5}>
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
        <Grid item xs={12} md={5}>
          <FormControl fullWidth size='small'>
            <InputLabel>Platform</InputLabel>
            <Select
              value={platformFilter}
              onChange={e => setPlatformFilter(e.target.value)}
              input={<OutlinedInput label='Platform' />}
            >
              <MenuItem value=''>All Platforms</MenuItem>
              <MenuItem value='facebook'>Facebook</MenuItem>
              <MenuItem value='instagram-business'>Instagram</MenuItem>
              <MenuItem value='linkedin'>LinkedIn</MenuItem>
              <MenuItem value='twitter'>Twitter</MenuItem>
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
