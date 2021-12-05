import axios from 'axios'
import ProductAttributes from '../../components/Product/ProductAttributes'
import ProductSummary from '../../components/Product/ProductSummary'
import baseUrl from '../../utils/baseUrl'

function Product({ product }) {
  return (
    <>
      <ProductSummary {...product} />
      <ProductAttributes {...product} />
    </>
  )
}

export async function getStaticPaths() {
  // Call an external API endpoint to get products
  const { data } = await axios(`${baseUrl}/api/products`)

  // Get the paths we want to pr-render based on products
  const paths = data.map((item) => {
    return {
      params: { id: item._id },
    }
  })

  return {
    paths,
    fallback: false, // means other routes should 404
  }
}

export async function getStaticProps({ params }) {
  // params contains the product id
  const url = `${baseUrl}/api/product/${params.id}`
  // Call an external api endpoint to get products
  const { data } = await axios.get(url)

  if (!data) {
    return {
      notFound: true,
    }
  }

  // By returning { props: { products } }
  return {
    props: { product: data }, // will be passed to the page component as props
  }
}

export default Product
