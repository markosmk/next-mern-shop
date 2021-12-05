import Link from 'next/link'
import { Card } from 'semantic-ui-react'

function ProductList({ products }) {
  return (
    <Card.Group stackable doubling itemsPerRow="3" centered>
      {products.map((item) => (
        <Link key={item._id} href={`/product/${item._id}`} passHref>
          <Card
            header={item.name}
            image={item.mediaUrl}
            color="teal"
            fluid
            meta={`$${item.price}`}
          />
        </Link>
      ))}
    </Card.Group>
  )
}

export default ProductList
