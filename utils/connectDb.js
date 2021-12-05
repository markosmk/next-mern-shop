import mongoose from 'mongoose'

const connectDB = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    // use current db connection
    console.log('Using existing Connection')
    return handler(req, res)
  }
  // use new db connection
  await mongoose.connect(process.env.MONGO_SV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('Db Connected')
  return handler(req, res)
}
export default connectDB
