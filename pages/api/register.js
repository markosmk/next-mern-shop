import connectDb from '../../utils/connectDb'
import User from '../../models/User'
import Cart from '../../models/Cart'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

async function register(req, res) {
  const { name, email, password } = req.body
  try {
    // 0- Validate name / email / password values
    if (!isLength(name, { min: 3, max: 10 })) {
      return res.status(422).send('Name must be 3-10 characters long')
    } else if (!isLength(password, { min: 6 })) {
      return res.status(422).send('Password must be at least 6 characters')
    } else if (!isEmail(email)) {
      return res.status(422).send('Email must be valid')
    }

    // 1- Check to see if the user already exist in the db
    const user = await User.findOne({ email })
    if (user) {
      return res.status(422).send(`USer already exists with email ${email}`)
    }
    // 2- if not, hash their password
    const pass = await bcrypt.hash(password, 10)
    // 3- create user'
    const newUser = await new User({
      name,
      email,
      password: pass,
    }).save()
    // 4- create cart for new user
    const cartUser = await new Cart({
      user: newUser._id,
    }).save()

    if (newUser && cartUser) {
      // 5- create token for the new user
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: '30m',
      })
      // 6- send back token
      res.status(201).json({ token })
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Error signup user. Please try again later')
  }
}

export default connectDb(register)
