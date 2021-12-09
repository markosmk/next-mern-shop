import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button, Form, Icon, Message, Segment } from 'semantic-ui-react'
import catchErrors from '../utils/catchErrors'
import { useAuth } from '../utils/context'

const INITIAL_DATA = {
  email: '',
  password: '',
}

function Login() {
  const [form, setForm] = useState(INITIAL_DATA)
  const [disabled, setDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

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
      // make request to login user
      login(form.email, form.password)
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
        icon="privacy"
        header="Welcome back!"
        content="Log in with your email and password"
        color="blue"
      />
      <Form error={Boolean(error)} onSubmit={handleSubmit} loading={loading}>
        <Message error header="Oops!" content={error} />
        <Segment>
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
            icon="sign in"
            type="submit"
            color="orange"
            content="Login"
          />
        </Segment>
      </Form>
      <Message attached="bottom" warning>
        <Icon name="help" />
        New User?{' '}
        <Link href="/register">
          <a>Register here!</a>
        </Link>{' '}
        instead.
      </Message>
    </>
  )
}

export default Login
