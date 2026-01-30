export default async function handler(req, res) {
  const url = req.query.url
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  res.setHeader('Content-Type', response.headers.get('content-type'))
  res.send(Buffer.from(arrayBuffer))
}
