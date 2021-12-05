import mongoose from 'mongoose'
import Product from '../../../models/Product'

export default async function handler(req, res) {
  const { id } = req.query

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Identificador Invalido' })
  }

  const result = await Product.findById(id).exec()

  return result
    ? res.status(200).json(result)
    : res.status(404).json({ error: 'No encontrado' })
}
