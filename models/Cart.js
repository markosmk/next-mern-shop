import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
  },
  products: [
    {
      quantity: {
        type: Number,
        default: 1,
      },
      product: {
        type: 'ObjectId', // option alternate by mongoose docs
        ref: 'Product',
      },
    },
  ],
})

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema)
