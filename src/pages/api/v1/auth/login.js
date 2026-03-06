export default function handler(req, res) {
  if (req.method === 'POST') {
    // eslint-disable-next-line no-unused-vars
    const { email } = req.body

    // Accept any login
    res.status(200).json({
      data: {
        authToken: 'mock-jwt-token-1234567890',
        user: {
          id: 1,
          email: email,
          fullName: 'Test User',
          role: 'admin'
        }
      }
    })
  } else {
    res.status(405).end()
  }
}
