import AddIcon from '@mui/icons-material/Add'
import { Autocomplete, Button, Paper, TextField, Typography } from '@mui/material'

const CustomAutocomplete = ({
  options,
  id,
  labelFieldName,
  value,
  onChange,
  getOptionLabel,
  renderOption,
  filterOptions,
  isOptionEqualToValue,
  onBlur,
  label,
  error,
  multiple,
  disabled,
  disableListWrap,
  ListboxComponent,
  size,
  disableCloseOnSelect,
  fullWidth,
  className,
  focused,
  setDialogOpen, // URL to redirect when button is clicked
  buttonLabel
}) => {
  let option
  if (multiple) {
    option = options.filter(option => value?.includes(option[id]))
  } else {
    option = options.find(option => value === option[id])
  }

  const _size = size || 'medium'

  const _getOptionLabel = getOptionLabel ? getOptionLabel : option => option[labelFieldName]

  const _renderOption = renderOption
    ? renderOption
    : (props, option) => {
        return (
          <Typography {...props} component='li' value={option[id]} key={option[id]}>
            {option[labelFieldName]}
          </Typography>
        )
      }

  const _filterOptions = filterOptions
    ? filterOptions
    : (options, state) => {
        return options.filter(option => {
          return option[labelFieldName]?.toLowerCase()?.includes(state.inputValue.toLowerCase())
        })
      }

  const _isOptionEqualToValue = isOptionEqualToValue
    ? isOptionEqualToValue
    : (options, value) => options[id] === value[id]

  const handleCreateOptionClick = () => {
    setDialogOpen(true) // Redirect to the page for creating the option
  }

  return (
    <Autocomplete
      className={className}
      size={_size}
      options={options}
      getOptionLabel={_getOptionLabel}
      renderOption={_renderOption}
      filterOptions={_filterOptions}
      isOptionEqualToValue={_isOptionEqualToValue}
      value={option || null}
      onBlur={onBlur}
      onChange={(e, newValue) => {
        if (multiple) {
          return onChange(newValue.map(item => item[id]) || [])
        }
        onChange(newValue?.[id] || null)
      }}
      renderInput={params => {
        return <TextField focused={focused} {...params} label={label} error={error} size={_size} />
      }}
      PaperComponent={({ children }) => (
        <Paper sx={{ position: 'relative' }}>
          {children}
          {buttonLabel && (
            <Button
              sx={{
                position: 'sticky',
                bottom: 0,
                zIndex: 1,
                m: 2
              }}
              onMouseDown={e => {
                e.stopPropagation()
                handleCreateOptionClick()
              }}
              startIcon={<AddIcon />}
              variant='text'
            >
              {buttonLabel}
            </Button>
          )}
        </Paper>
      )}
      openOnFocus
      disabled={disabled}
      multiple={multiple}
      disableListWrap={disableListWrap}
      ListboxComponent={ListboxComponent}
      disableCloseOnSelect={disableCloseOnSelect}
      fullWidth={fullWidth}
    />
  )
}

export default CustomAutocomplete
