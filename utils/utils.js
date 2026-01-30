const truncateText = (text, maxLength = 20) => {
  if (!text) return ''

  if (text.length <= maxLength) return text

  return `${text.substring(0, maxLength)}...`
}

async function getFileFromUrl(url, name, defaultType = 'image/jpeg') {
  const response = await fetch(url)
  const data = await response.blob()

  return new File([data], name, {
    type: data.type || defaultType
  })
}

const getImageMeta = url =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = err => reject(err)
    img.src = url
  })

const formatCurrency = (amount, float = 2) => {
  if (!amount || isNaN(amount)) return '₹ 0.00'

  return `₹ ${parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: float,
    maximumFractionDigits: float
  })} `
}

const formatPercentage = (value, { separate = true } = {}) => {
  if (Number.isNaN(value)) return 0

  return `${value.toFixed(2)}${separate ? ' ' : ''}%`
}

export { truncateText, getFileFromUrl, getImageMeta, formatCurrency, formatPercentage }
