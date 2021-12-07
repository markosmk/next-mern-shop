import axios from 'axios'
import Cookies from 'js-cookie'
import Router from 'next/router'
import { destroyCookie, parseCookies } from 'nookies'
import baseUrl from './baseUrl'

export function handleLogin({ token }) {
  if (token) {
    Cookies.set('token', token, {
      // `secure` garantiza que la cookie solo se transmita a través de una conexión segura https. Debido a que localhost no es una conexión https, lo configuramos en false si el entorno en el que estamos ejecutando la aplicación es development.
      secure: process.env.NODE_ENV !== 'development',
      // `expires` determina cuántos dias será válida la cookie. En este ejemplo, se establece en 2 días.
      expires: 2,
      // `path` determina en qué ruta debe ser válida la cookie. Está configurado para '/' que la cookie esté disponible para todas las rutas.
      path: '/',
    })
    Router.push({ pathname: '/account' })
  }
}

export function handleLogout() {
  Cookies.remove('token')
  window.localStorage.setItem('logout', Date.now())
  Router.push({ pathname: '/' })
}

export function redirectUser(ctx, location) {
  if (typeof window === 'undefined' || ctx.req) {
    ctx.res.writeHead(302, { Location: location })
    ctx.res.end()
  } else {
    console.log('uso el router push')
    Router.push({ pathname: location })
  }
}

export async function authCheck(ctx, protectedRoutes = []) {
  // 1- Get token of client
  //const token = ctx.req.headers.cookie?.replace('token=', '')
  const { token } = parseCookies(ctx)
  // 2- if not exists, check if we are in a protected route to redirect at login page (only protected route)
  if (!token) {
    const isProtectedRoute = protectedRoutes
    if (isProtectedRoute.includes(ctx.pathname)) {
      redirectUser(ctx, '/login')
    }
  } else {
    // 3- if exists, we try to get data of logged user
    try {
      /*
      if use Bearer Auth
      const options = {
        headers: {
          Authorization: 'Bearer ' + ctx.req.headers.cookie.replace('token=', ''),
        }
      }
      */
      const options = { headers: { Authorization: token } }
      const url = `${baseUrl}/api/account`
      const { data } = await axios.get(url, options)

      // 4- if authenticated, but not of role 'admin' or 'root' redirect from '/create' page
      const isRoot = data.role === 'root'
      const isAdmin = data.role === 'admin'

      const isNotPermitted = !(isRoot || isAdmin) && ctx.pathname === '/create'

      if (isNotPermitted) {
        redirectUser(ctx, '/')
      }

      return data
    } catch (error) {
      console.log('Error: ', error.message)
      // 5- if there was an error, we remove the invalid token
      destroyCookie(ctx, 'token')
      // 6- and redirect to login page
      redirectUser(ctx, '/login')
    }
  }
}

export async function authCheckFetch(ctx, protectedRoutes = []) {
  try {
    const url = `${baseUrl}/api/account`
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        Authorization: JSON.stringify({ token }),
      },
    })
    if (response.ok) {
      const data = await response.json()
      console.log('data', data)
      return data
    } else {
      // https://github.com/developit/unfetch#caveats
      return redirectUser(ctx, '/login')
    }
  } catch (error) {
    console.log(error.message)
    // Implementation or Network error
    return redirectUser(ctx, '/login')
  }
}
