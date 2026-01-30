import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'
import Cards from 'react-credit-cards'
import { useState } from 'react'
import { unwrapResult } from '@reduxjs/toolkit'
import { formatCVC, formatCreditCardNumber, formatExpirationDate } from 'src/@core/utils/format'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import cardValidator from 'card-validator'

const CardInput = ({ submit, openAddCard, setOpenAddCard }) => {
  // ** States
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [focus, setFocus] = useState()
  const [expiry, setExpiry] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [isPrimary, setIsPrimary] = useState(true)
  const [cardErrors, setCardErrors] = useState({})
  const [addCardLoading, setAddCardLoading] = useState(false)

  const handleAddCardClose = () => {
    setCardNumber('')
    setName('')
    setCvc('')
    setExpiry('')
    setIsPrimary(true)
    setOpenAddCard(false)
  }

  const handleSubmitCard = async () => {
    const { isValid: isValidNumber } = cardValidator.number(cardNumber)
    const { isValid: isValidName } = cardValidator.cardholderName(name)
    const { isValid: isValidExpiry } = cardValidator.expirationDate(expiry)
    const { isValid: isValidCvc } = cardValidator.cvv(cvc)

    const errors = {}

    if (!isValidNumber) {
      errors.number = 'Invalid card number'
    }
    if (!isValidName) {
      errors.name = "Invalid holder's name"
    }
    if (!isValidExpiry) {
      errors.expiry = 'Invalid expiry date'
    }
    if (!isValidCvc) {
      errors.cvc = 'Invalid CVC'
    }

    setCardErrors(errors)

    if (isValidNumber && isValidName && isValidExpiry && isValidCvc) {
      const data = {
        cardNumber,
        expiry,
        cvc,
        holderName: name,
        isPrimary
      }
      setAddCardLoading(true)
      const addCardAction = await submit(data)
      unwrapResult(addCardAction)
      setAddCardLoading(false)
      handleAddCardClose()
    }
  }

  const handleInputChange = ({ target }) => {
    if (target.name === 'number') {
      setCardErrors({
        ...cardErrors,
        number: undefined
      })
      target.value = formatCreditCardNumber(target.value, Payment)
      setCardNumber(target.value)
    } else if (target.name === 'expiry') {
      setCardErrors({
        ...cardErrors,
        expiry: undefined
      })
      target.value = formatExpirationDate(target.value)
      setExpiry(target.value)
    } else if (target.name === 'cvc') {
      setCardErrors({
        ...cardErrors,
        cvc: undefined
      })
      target.value = formatCVC(target.value, cardNumber, Payment)
      setCvc(target.value)
    } else if (target.name === 'name') {
      setCardErrors({
        ...cardErrors,
        name: undefined
      })
      setName(target.value)
    }
  }

  const handleBlur = () => setFocus(undefined)

  return (
    <Dialog
      open={openAddCard}
      onClose={handleAddCardClose}
      aria-labelledby='user-view-billing-edit-card'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
      aria-describedby='user-view-billing-edit-card-description'
    >
      <DialogTitle
        id='user-view-billing-edit-card'
        sx={{
          textAlign: 'center',
          fontSize: '1.5rem !important',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        Add Card
      </DialogTitle>
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(5)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}
      >
        <form>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <CardWrapper sx={{ '& .rccs': { m: '0 auto' } }}>
                <Cards cvc={cvc} focused={focus} expiry={expiry} name={name} number={cardNumber} />
              </CardWrapper>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name='number'
                    value={cardNumber}
                    autoComplete='off'
                    label='Card Number'
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    placeholder='0000 0000 0000 0000'
                    onFocus={e => setFocus(e.target.name)}
                    error={Boolean(cardErrors.number)}
                    helperText={cardErrors.number}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name='expiry'
                    label='Expiry'
                    value={expiry}
                    onBlur={handleBlur}
                    placeholder='MM/YY'
                    onChange={handleInputChange}
                    inputProps={{ maxLength: '5' }}
                    onFocus={e => setFocus(e.target.name)}
                    error={Boolean(cardErrors.expiry)}
                    helperText={cardErrors.expiry}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name='cvc'
                    label='CVC'
                    value={cvc}
                    autoComplete='off'
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    onFocus={e => setFocus(e.target.name)}
                    placeholder={Payment.fns.cardType(cardNumber) === 'amex' ? '1234' : '123'}
                    error={Boolean(cardErrors.cvc)}
                    helperText={cardErrors.cvc}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name='name'
                    value={name}
                    autoComplete='off'
                    onBlur={handleBlur}
                    label='Name on Card'
                    placeholder='John Doe'
                    onChange={handleInputChange}
                    onFocus={e => setFocus(e.target.name)}
                    error={Boolean(cardErrors.name)}
                    helperText={cardErrors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch checked={isPrimary} onChange={e => setIsPrimary(e.target.checked)} />}
                    label='Set as Primary'
                    sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmitCard}>
          {addCardLoading ? (
            <CircularProgress
              sx={{
                color: 'common.white',
                width: '20px !important',
                height: '20px !important',
                mr: theme => theme.spacing(2)
              }}
            />
          ) : null}
          Submit
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleAddCardClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CardInput
