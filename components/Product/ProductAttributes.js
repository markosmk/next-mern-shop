import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button, Header, Modal } from 'semantic-ui-react'
import baseUrl from '../../utils/baseUrl'

function ProductAttributes({ description, _id }) {
  const [modal, setModal] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const url = `${baseUrl}/api/product/${_id}`
    const result = await axios.delete(url)
    if (result) {
      // console.log('Deleted', result)
      router.push('/')
    }
  }

  return (
    <>
      <Header as="h3">About this product</Header>
      <p>{description}</p>
      <Button
        icon="trash alternate outline"
        color="red"
        content="Delete Product"
        onClick={() => setModal(true)}
      />
      <Modal open={modal} size="mini" dimmer="blurring">
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete this product?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Cancel" onClick={() => setModal(false)} />
          <Button
            negative
            icon="trash"
            labelPosition="right"
            content="Delete"
            onClick={handleDelete}
          />
        </Modal.Actions>
      </Modal>
    </>
  )
}

export default ProductAttributes
