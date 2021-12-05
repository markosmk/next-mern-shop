// import products from '../../public/products.json'
import Product from '../../models/Product'
import connectDb from '../../utils/connectDb'

const products = async (req, res) => {
  // console.log(req.method)
  try {
    const response = await Product.find()
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
  }
}

export default connectDb(products)
