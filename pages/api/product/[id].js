import mongoose from 'mongoose'
import Product from '../../../models/Product'

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      await handleGetRequest(req, res)
      break
    case 'DELETE':
      await handleDeleteRequest(req, res)
      break
    default:
      res.status(405).json({ error: `method ${req.method} not allowed` })
      break
  }
}

async function handleGetRequest(req, res) {
  const { id } = req.query

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Identificador Invalido' })
  }

  const result = await Product.findById(id).exec()

  return result
    ? res.status(200).json(result)
    : res.status(404).json({ error: 'No encontrado' })
}

async function handleDeleteRequest(req, res) {
  const { id } = req.query

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Identificador Invalido' })
  }

  const result = await Product.findByIdAndDelete({ _id: id })

  return result
    ? res.status(204).json({})
    : res.status(404).json({ error: 'No encontrado' })
}
