import Product from '../../../models/Product'
import connectDb from '../../../utils/connectDb'

async function handlePostRequest(req, res) {
  if (req.method === 'POST') {
    const { name, price, description, mediaUrl } = req.body

    try {
      if (!name || !price || !description || !mediaUrl) {
        return res.status(422).send('Product missing one or more fields')
      }
      const newData = await new Product({
        name,
        price,
        description,
        mediaUrl,
      }).save()
      if (newData) {
        return res.status(201).json({ status: 'success', data: newData })
      }
    } catch (error) {
      console.error(error)
      res.status(500).send('Server error creating product')
    }
  }

  res.status(200).json({ status: 'ups' })
}

export default connectDb(handlePostRequest)
