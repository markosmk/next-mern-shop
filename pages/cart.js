import axios from 'axios'
import { parseCookies } from 'nookies'
import { Segment } from 'semantic-ui-react'
import CartItemList from '../components/Cart/CartItemList'
import CartSummary from '../components/Cart/CartSummary'
import baseUrl from '../utils/baseUrl'

function Cart({ products }) {
  console.log(products)
  return (
    <Segment>
      <CartItemList />
      <CartSummary />
    </Segment>
  )
}

Cart.getInitialProps = async ({ ctx }) => {
  const { token } = parseCookies(ctx)

  if (!token) {
    return { products: [] }
  }
  const url = `${baseUrl}/api/cart`
  const options = { headers: { Authorization: token } }
  const response = await axios.get(url, options)
  console.log('data', response.data)
  return { products: response.data }
}

export default Cart
