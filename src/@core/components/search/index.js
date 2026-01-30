import SearchIcon from '@mui/icons-material/Search'
import { FormControl, InputAdornment, TextField } from '@mui/material'

const SearchField = ({ placeholder, variant, size, value, onChange, fullWidth }) => {
  const _size = size || 'small'
  const _variant = variant || 'outlined'

  return (
    <FormControl size={_size} fullWidth={fullWidth}>
      <TextField
        id='input-with-icon-textfield'
        placeholder={placeholder}
        variant={_variant}
        size={_size}
        onChange={onChange}
        value={value}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon fontSize={size} />
            </InputAdornment>
          )
        }}
      />
    </FormControl>
  )
}

export default SearchField
