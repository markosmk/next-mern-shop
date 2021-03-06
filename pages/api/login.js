import connectDb from '../../utils/connectDb'
import User from '../../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

async function login(req, res) {
  const { email, password } = req.body

  try {
    // 1- check to see if a user exists with the provided email
    const user = await User.findOne({ email }).select('+password')
    // 2- if not, return error
    if (!user) {
      return res.status(404).send('No user exists with that email')
    }
    // 3- check to see if users password matches the one in db
    const passMatch = await bcrypt.compare(password, user.password)
    // 4- if so, generate a token,
    if (passMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30m',
      })
      // 5- send that token and userData to the client
      const { password, ...useData } = user
      res.status(200).json({ token, user: useData })
    } else {
      res.status(401).send('Password do not match')
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Error logging in user')
  }
}

export default connectDb(login)
