import User from '../../models/User'
import jwt from 'jsonwebtoken'
import connectDb from '../../utils/connectDb'

async function account(req, res) {
  // if (req.method === 'GET') {
  //   if (!req.headers.cookie) {
  //     return res.status(403).json({message: 'Not Authorized'})
  //   }
  // }
  if (!('authorization' in req.headers)) {
    return res.status(401).send('Authorization header missing')
  }

  try {
    // Looks for provided header
    const authValue = req.headers.authorization
    const token = authValue.replace('Bearer ', '')
    //Validates user token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) {
      throw new Error('El token no se decodifico')
      // return res.status(404).send('Invalid Token')
    }
    const user = await User.findById(decoded.userId)
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).send('User not found')
    }
  } catch (error) {
    res.status(403).send('Invalid Token: message: ' + error.message)
  }
}

export default connectDb(account)
