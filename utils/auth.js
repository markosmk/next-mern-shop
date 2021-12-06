import cookie from 'js-cookie'
import Router from 'next/router'

export function handleLogin({ token }) {
  if (token) {
    cookie.set('token', token)
    Router.push('/account')
  }
}
