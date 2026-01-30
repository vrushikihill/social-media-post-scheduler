// Mock API endpoint for dashboard analytics
export default function handler(req, res) {
  if (req.method === 'GET') {
    // Mock dashboard statistics - ONLY Instagram
    const stats = {
      totalPosts: 8,
      connectedPlatforms: 1,
      todaysPosts: 1,
      avgEngagement: '16.8%',
      scheduledPosts: 2,
      publishedPosts: 5,
      failedPosts: 1,
      draftPosts: 0,
      weeklyGrowth: {
        posts: '+15%',
        engagement: '+8.2%',
        followers: '+3.1%'
      },
      platformBreakdown: {
        instagram: { posts: 18, engagement: '16.8%' }
      }
    }

    res.status(200).json(stats)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}