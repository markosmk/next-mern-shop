import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button, Form, Icon, Message, Segment } from 'semantic-ui-react'
import catchErrors from '../utils/catchErrors'

const INITIAL_DATA = {
  name: '',
  email: '',
  password: '',
}

function Register() {
  const [form, setForm] = useState(INITIAL_DATA)
  const [disabled, setDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const isUser = Object.values(form).every((el) => Boolean(el))
    isUser ? setDisabled(false) : setDisabled(true)
  }, [form])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      setError('')
      // make request to register new user
      console.log(form)
    } catch (error) {
      catchErrors(error, setError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Message
        attached
        icon="settings"
        header="Get Started!"
        content="Create a new account"
        color="teal"
      />
      <Form error={Boolean(error)} onSubmit={handleSubmit} loading={loading}>
        <Message error header="Oops!" content={error} />
        <Segment>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            label="Name"
            placeholder="Name"
            name="name"
            onChange={handleChange}
          />
          <Form.Input
            fluid
            icon="mail"
            iconPosition="left"
            label="Email"
            placeholder="Email"
            name="email"
            type="email"
            onChange={handleChange}
          />
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            label="Password"
            placeholder="Password"
            name="password"
            type="password"
            onChange={handleChange}
          />
          <Button
            disabled={disabled || loading}
            icon="signup"
            type="submit"
            color="orange"
            content="Register"
          />
        </Segment>
      </Form>
      <Message attached="bottom" warning>
        <Icon name="help" />
        Existing User?{' '}
        <Link href="/login">
          <a>Log in here</a>
        </Link>{' '}
        instead.
      </Message>
    </>
  )
}

export default Register
