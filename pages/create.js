import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  Form,
  Input,
  TextArea,
  Button,
  Image,
  Message,
  Header,
  Icon,
} from 'semantic-ui-react'
import baseUrl from '../utils/baseUrl'
import catchErrors from '../utils/catchErrors'

const INITIAL_VALUES = {
  name: '',
  price: '',
  media: '',
  description: '',
}

function Create() {
  const [form, setForm] = useState(INITIAL_VALUES)
  const [mediaPreview, setMediaPreview] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const isProduct = Object.values(form).every((el) => Boolean(el))
    isProduct ? setDisabled(false) : setDisabled(true)
  }, [form])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'media') {
      setForm({ ...form, media: files[0] })
      if (files[0]) {
        setMediaPreview(window.URL.createObjectURL(files[0]))
      }
    } else {
      setForm({
        ...form,
        [name]: value,
      })
    }
  }

  const handleImageUpload = async () => {
    const data = new FormData()
    data.append('file', form.media)
    data.append('upload_preset', 'mern-shop')
    data.append('cloud_name', 'dqpawvm92')
    const response = await axios.post(process.env.CLOUDINARY_URL, data)
    const mediaUrl = response.data.url
    return mediaUrl
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)
      setError('')
      const mediaUrl = await handleImageUpload()
      const url = `${baseUrl}/api/product`
      const { name, price, description } = form
      const response = await axios.post(url, {
        name,
        price,
        description,
        mediaUrl,
      })
      console.log({ response })
      setForm(INITIAL_VALUES)
      setSuccess(true)
    } catch (error) {
      catchErrors(error, setError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="blue" />
        Create New Product
      </Header>
      <Form
        loading={loading}
        error={Boolean(error)}
        success={success}
        onSubmit={handleSubmit}
      >
        <Message error header="Oops!" content={error} />
        <Message
          success
          icon="check"
          header="Success"
          content="Your product has been posted"
        />
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            name="name"
            label="Name"
            placeholder="Name"
            onChange={handleChange}
            value={form.name}
          />
          <Form.Field
            control={Input}
            name="price"
            label="Price"
            placeholder="Price"
            min="0.00"
            step="0.01"
            type="number"
            onChange={handleChange}
            value={form.price}
          />
          <Form.Field
            control={Input}
            name="media"
            label="Media"
            accept="image/*"
            content="Select Image"
            type="file"
            onChange={handleChange}
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size="small" alt="" />
        <Form.Field
          control={TextArea}
          name="description"
          label="Description"
          placeholder="Description here"
          onChange={handleChange}
          value={form.description}
        />
        <Form.Field
          control={Button}
          disabled={disabled || loading}
          color="blue"
          icon="pencil alternate"
          content="Submit"
          type="submit"
        />
      </Form>
    </>
  )
}

export default Create
