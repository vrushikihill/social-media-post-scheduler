export default function handler(req, res) {
    res.status(200).json({
        data: {
            id: 1,
            email: 'admin@xyz.com',
            fullName: 'Test User',
            role: 'admin',
            avatar: '/images/avatars/1.png'
        }
    })
}
