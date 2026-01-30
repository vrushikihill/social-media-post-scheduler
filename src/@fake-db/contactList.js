const data = {
  users: [
    {
      id: 1,
      username: 'tuckerdog',
      firstName: 'Tucker',
      lastName: 'Dog',
      email: 'tuck@dog.com',
      gender: 'male',
      contactType: 'member',
      age: 32,
      tags: 'N/A',
      status: 'active',
      club: 'N/A',
      avatar: '',
      program: '1',
      rank: '1',
      agreement: '1',
      billing: '1'
    },
    {
      id: 2,
      username: 'support',
      firstName: 'Jordan',
      lastName: 'Schreiber',
      email: 'support@flo.com',
      gender: 'male',
      contactType: 'lead',
      age: 35,
      tags: 'N/A',
      status: 'active',
      club: 'N/A',
      avatar: '/images/avatars/3.png',
      program: '2',
      rank: '2',
      agreement: '2',
      billing: '2'
    },
    {
      id: 3,
      username: 'doug',
      firstName: 'Jenny',
      lastName: 'Block',
      email: 'doug@xyz.com',
      gender: 'female',
      contactType: 'member',
      age: 33,
      tags: 'N/A',
      status: 'active',
      club: 'N/A',
      avatar: '/images/avatars/2.png',
      program: '1',
      rank: '2',
      agreement: '1',
      billing: '2'
    }
  ]
}

// POST: Add new user
export const addContact = contact => {
  // Get event from post data
  const user = contact
  const { length } = data.users
  let lastIndex = 0
  if (length) {
    lastIndex = data.users[length - 1].id
  }
  user.id = lastIndex + 1
  data.users.unshift({ ...user, avatar: '', avatarColor: 'primary', status: 'active' })

  return user
}

// GET: DATA
export const getContacts = params => {
  const { q = '', program = null, billing = null, agreement = null, rank = null } = params ?? ''
  const queryLowered = q.toLowerCase()

  const filteredData = data.users.filter(
    user =>
      (user.username.toLowerCase().includes(queryLowered) ||
        user.firstName.toLowerCase().includes(queryLowered) ||
        user.lastName.toLowerCase().includes(queryLowered) ||
        user.contactType.toLowerCase().includes(queryLowered) ||
        (user.program.toLowerCase().includes(queryLowered) &&
          user.billing.toLowerCase().includes(queryLowered) &&
          user.agreement.toLowerCase().includes(queryLowered) &&
          user.rank.toLowerCase().includes(queryLowered))) &&
      user.program === (program || user.program) &&
      user.billing === (billing || user.billing) &&
      user.agreement === (agreement || user.agreement) &&
      user.rank === (rank || user.rank)
  )

  return {
    allData: data.users,
    users: filteredData,
    params: params,
    total: filteredData.length
  }
}

// DELETE: Deletes User
export const deleteContact = contactId => {
  // Get user id from URL
  const userId = contactId
  const userIndex = data.users.findIndex(t => t.id === userId)
  data.users.splice(userIndex, 1)

  return true
}
