import jwt from 'jsonwebtoken'
import Cart from '../../models/Cart'
// import Product from '../../models/Product'
import connectDb from '../../utils/connectDb'

const cart = async (req, res) => {
  if (!('authorization' in req.headers)) {
    return res.status(401).send('Authorization header missing')
  }

  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    )
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'products.product',
      model: 'Product',
    })
    res.status(200).json(cart.products)
  } catch (error) {
    console.error(error)
    res.status(403).send('Please login again')
  }
}

export default connectDb(cart)
