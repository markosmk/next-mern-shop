import { useState } from 'react'
import { Input } from 'semantic-ui-react'

function AddProductToCart() {
  const [quantity, setQuantity] = useState(1)

  return (
    <>
      <Input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder="Quantity"
        action={{ color: 'orange', content: 'Add to Cart', icon: 'plus cart' }}
      />
    </>
  )
}

export default AddProductToCart
