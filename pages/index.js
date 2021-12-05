import axios from 'axios'
import ProductList from '../components/Index/ProductList'

function Home({ products }) {
  // console.log(products)
  return (
    <div>
      <div>Home</div>
      <ProductList products={products} />
    </div>
  )
}

export async function getStaticProps() {
  const url = 'http://localhost:3000/api/products'
  // Call an external api endpoint to get products
  const { data } = await axios.get(url)

  if (!data) {
    return {
      notFound: true,
    }
  }

  // By returning { props: { products } }
  return {
    props: { products: data }, // will be passed to the page component as props
  }
}

export default Home
