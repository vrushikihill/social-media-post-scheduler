const data = {
  promotions: [
    {
      id: 1,
      name: 'Feb 2022 ATA',
      date: '02/09/2023',
      program: 'ATA',
      nominated: 5,
      promoted: 5,
      updated: 5
    },
    {
      id: 2,
      name: 'Tigers Aug 2022',
      date: '01/31/2023',
      program: 'ATA',
      nominated: 5,
      promoted: 4,
      updated: 4
    },
    {
      id: 3,
      name: 'Wrestlers',
      date: '01/03/2022',
      program: 'Wrestlers',
      nominated: 5,
      promoted: 1,
      updated: 1
    }
  ]
}

// ------------------------------------------------
// GET: Return Promotion List
// ------------------------------------------------
export const getPromotions = params => {
  const { q = '' } = params ?? ''
  const queryLowered = q.toLowerCase()

  const filteredData = data.promotions.filter(promotion => {
    return (
      promotion.name.toLowerCase().includes(queryLowered) ||
      promotion.date.toLowerCase().includes(queryLowered) ||
      promotion.program.toLowerCase().includes(queryLowered) ||
      String(promotion.nominated).toLowerCase().includes(queryLowered) ||
      String(promotion.promoted).toLowerCase().includes(queryLowered) ||
      String(promotion.updated).toLowerCase().includes(queryLowered)
    )
  })

  return {
    params: params,
    allData: data.promotions,
    promotions: filteredData,
    total: filteredData.length
  }
}

// ------------------------------------------------
// GET: Return Single Promotion
// ------------------------------------------------
export const getPromotion = params => {
  const { id } = params
  const promotionData = data.promotions.filter(promotion => promotion.id === parseInt(id, 10))
  if (promotionData.length) {
    const responseData = {
      promotion: promotionData[0],
      promotionDetails: {}
    }

    return responseData
  } else {
    return { message: 'Unable to find the requested invoice!' }
  }
}

// ------------------------------------------------
// DELETE: Deletes Promotion
// ------------------------------------------------
export const deletePromotion = id => {
  // Get promotion id from URL
  const promotionId = Number(id)
  const promotionIndex = data.promotions.findIndex(p => p.id === promotionId)
  data.promotions.splice(promotionIndex, 1)

  return true
}
