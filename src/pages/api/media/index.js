// Mock API endpoint for media library
export default function handler(req, res) {
  if (req.method === 'GET') {
    // Mock media files data
    const mediaFiles = [
      {
        id: 1,
        fileName: 'product-launch.jpg',
        fileUrl: '/images/product-launch.jpg',
        fileType: 'image',
        fileSize: 2048576, // 2MB
        dimensions: { width: 1920, height: 1080 },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        fileName: 'behind-scenes.mp4',
        fileUrl: '/videos/behind-scenes.mp4',
        fileType: 'video',
        fileSize: 15728640, // 15MB
        dimensions: { width: 1280, height: 720 },
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
      }
    ]

    res.status(200).json(mediaFiles)
  } else if (req.method === 'POST') {
    // Mock file upload
    const newFile = {
      id: Date.now(),
      fileName: 'uploaded-file.jpg',
      fileUrl: '/images/uploaded-file.jpg',
      fileType: 'image',
      fileSize: 1024000,
      dimensions: { width: 800, height: 600 },
      createdAt: new Date()
    }

    res.status(201).json(newFile)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}