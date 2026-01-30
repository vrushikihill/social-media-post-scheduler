import moment from 'moment'

export const periodToTimeFormat = {
  daily: 'days',
  weekly: 'weeks',
  monthly: 'months'
}

export const makeZeroArray = (array, index) => {
  for (let i = 0; i < index; i++) {
    array.push(0)
  }

  return array
}

export const spikeColor = spike => {
  if (spike > 0) {
    return 'success.main'
  } else if (spike < 0) {
    return 'error.main'
  }

  return 'text.main'
}

export const spikeSign = spike => {
  if (spike > 0) {
    return '+'
  }

  return ''
}

export const durationText = (startDate, endDate, period) => {
  return `Last ${moment(endDate).diff(moment(startDate), periodToTimeFormat[period])} ${periodToTimeFormat[period]}`
}

export const createStats = ({ startDate, endDate, key, period = 'daily' }) => {
  const stats = []

  let _startDate = moment(startDate)
  let _endDate = moment(endDate)

  const diff = moment(_endDate).diff(moment(_startDate), periodToTimeFormat[period])

  for (let i = 0; i < diff; i++) {
    stats.push({
      date: moment(_startDate).add(i, periodToTimeFormat[period]).format('MM/DD/YYYY'),
      [key]: 0
    })
  }

  return stats
}

export const customDates = (start, end, val) => {
  //@Set Range of dates from select inputs @moment js
  let result = []
  let start_date = moment(start)
  let end_date = moment(end).utcOffset(10 / 60)
  result = [moment(start_date)]

  // let result = [moment({...start_date})];
  const ago = Math.abs(moment(start).diff(end_date, val))

  let nowCount = 0
  while (nowCount < ago) {
    start_date.add(1, val)
    result.push(moment(start_date))
    nowCount++
  }

  return result
}

export const downloadCSV = (data, filename) => {
  const a = document.createElement('a')
  const file = new Blob([data], { type: 'text/csv' })
  a.href = URL.createObjectURL(file)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

export const formatCurrency = ({ number, currency }) => {
  if (typeof number !== 'number') {
    number = Number(number)
  }

  if (Number.isNaN(number)) {
    number = 0
  }

  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(number)
}
