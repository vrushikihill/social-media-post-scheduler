// Mock API endpoint for AI templates
export default function handler(req, res) {
  if (req.method === 'GET') {
    // Mock AI templates data - Only Instagram compatible
    const templates = [
      {
        id: 1,
        name: 'Festival Post',
        category: 'festival',
        description: 'Create engaging visual posts for festivals and holidays',
        template: 'Celebrate {festival_name} with us! {custom_message} #festival #{festival_name} #instagram',
        platforms: ['instagram'],
        toneOptions: ['festive', 'artistic', 'casual'],
        placeholders: [
          { name: 'festival_name', type: 'text', required: true },
          { name: 'custom_message', type: 'textarea', required: false }
        ]
      },
      {
        id: 2,
        name: 'Product Promotion',
        category: 'product_promotion',
        description: 'Promote your products with stunning visuals',
        template: 'Introducing {product_name}! {product_description} Link in bio to get {discount}% off! #MustHave #NewArrival',
        platforms: ['instagram'],
        toneOptions: ['exciting', 'chic', 'minimalist'],
        placeholders: [
          { name: 'product_name', type: 'text', required: true },
          { name: 'product_description', type: 'textarea', required: true },
          { name: 'discount', type: 'number', required: false }
        ]
      }
    ]

    res.status(200).json(templates)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}