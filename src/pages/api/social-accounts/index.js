// Mock API endpoint for social accounts
export default function handler(req, res) {
  if (req.method === 'GET') {
    // Mock connected social accounts
    const accounts = [
      {
        id: 2,
        platform: 'instagram',
        accountName: '@review_genie_ihill',
        accountAvatar: '/images/avatars/instagram-avatar.jpg',
        status: 'active',
        tokenExpiry: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000),
        postsCount: 8,
        businessId: '17841468422898809'
      },
      {
        id: 1,
        platform: 'facebook',
        accountName: 'Review Genie Page',
        accountAvatar: '/images/avatars/facebook-avatar.jpg', // You might want to ensure this file exists or use a placeholder
        status: 'active',
        tokenExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        postsCount: 15,
        businessId: '123456789'
      }
    ]

    res.status(200).json(accounts)
  } else if (req.method === 'POST') {
    // Mock account connection
    const { platform, authCode } = req.body

    if (platform !== 'instagram' && platform !== 'facebook') {
      res.status(400).json({ error: 'Only Instagram and Facebook are supported' })
      
return
    }

    // Simulate OAuth flow
    const newAccount = {
      id: Date.now(),
      platform,
      accountName: `New ${platform} Account`,
      status: 'active',
      tokenExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      lastSync: new Date(),
      postsCount: 0
    }

    res.status(201).json(newAccount)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}