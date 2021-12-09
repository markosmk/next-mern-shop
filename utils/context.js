import axios from 'axios'
import Cookies from 'js-cookie'
import Router from 'next/router'
import { destroyCookie, parseCookies } from 'nookies'
import { createContext, useContext, useMemo } from 'react'
import { redirectUser } from './auth'
import baseUrl from './baseUrl'

// Estado Inicial
const initialState = {
  isLoggedin: false,
  user: null,
}

// Contexto
const AuthContext = createContext(initialState)

const getUser = async (ctx) => {
  // 1- Get token of client
  //const token = ctx.req.headers.cookie?.replace('token=', '')
  const { token } = parseCookies(ctx)
  // 2- if not exists, check if we are in a protected route to redirect at login page (only protected route)
  if (!token) {
    const isProtectedRoute = ['/account', '/create']
    if (isProtectedRoute.includes(ctx.pathname)) {
      redirectUser(ctx, '/login')
    }
  } else {
    // 3- if exists, try to get data of logged user
    try {
      const options = { headers: { Authorization: token } }
      const url = `${baseUrl}/api/account`
      const { data } = await axios.get(url, options)
      /*const { data } = await axios.get(url, {
        headers: ctx.req.headers.cookie
          ? { cookie: ctx.req.headers.cookie }
          : undefined,
        withCredentials: true,
      })*/
      if (data) {
        // 4- if authenticated, but not of role 'admin' or 'root' redirect from '/create' page
        const isRoot = data.role === 'root'
        const isAdmin = data.role === 'admin'
        const isNotPermitted =
          !(isRoot || isAdmin) && ctx.pathname === '/create'
        if (isNotPermitted) {
          redirectUser(ctx, '/')
        }

        return { isLoggedin: true, user: data }
      } else {
        return initialState
      }
    } catch (error) {
      console.log('Error: ', error.message)
      // 5- if there was an error, we remove the invalid token
      destroyCookie(ctx, 'token')
      // 6- and redirect to login page
      redirectUser(ctx, '/login')
      return initialState
    }
  }
}

// Proveedor
const AuthProvider = ({ children, myAuth }) => {
  const auth = myAuth || initialState

  const login = async (email, password) => {
    try {
      const url = `${baseUrl}/api/login`
      const { data } = await axios.post(url, { email, password })
      if (data) {
        Cookies.set('token', data.token, {
          // `secure` garantiza que la cookie solo se transmita a través de una conexión segura https. Debido a que localhost no es una conexión https, lo configuramos en false si el entorno en el que estamos ejecutando la aplicación es development.
          secure: process.env.NODE_ENV !== 'development',
          // `expires` determina cuántos dias será válida la cookie. En este ejemplo, se establece en 2 días.
          expires: 2,
          // `path` determina en qué ruta debe ser válida la cookie. Está configurado para '/' que la cookie esté disponible para todas las rutas.
          path: '/',
        })
        Router.push('/account')
        console.log('user logged in success')
        return data.user
      }
    } catch (error) {
      console.error('Incorrect email or password entered', error)
    }
  }

  const register = async (name, email, password) => {
    try {
      const url = `${baseUrl}/api/register`
      const { data } = await axios.post(url, { name, email, password })
      if (data) {
        Router.push('/')
        console.log('user registered success')
        return data
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const logout = () => {
    Cookies.remove('token')
    window.localStorage.setItem('logout', Date.now())
    Router.push({ pathname: '/' })
    /*
    try {
      const url = `${baseUrl}/api/logout`
      const { data } = await axios.get(url, { withCredentials: true })
      if (data) {
        Router.push('/')
        console.log('user logout')
        return data
      }
    } catch (error) {
      console.error(error.message)
    }
    return data*/
  }

  const values = useMemo(
    () => ({
      auth, // Estado que sera visible en el contexto
      login, // funciones que son exportadas para el por ejemplo handleLogin
      register,
      logout,
    }),
    [auth]
  ) // estado que sera visible en el contexto

  // Interfaz donde sera expuesto el proveedor y envolvera la app
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

// use context hook
const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

const IsLoggedin = () => {
  const { auth } = useAuth()
  return auth.isLoggedin
}

// Roles
const IsAdminOrRoot = () => {
  const {
    auth: { user },
  } = useAuth()
  return user && user.role === 'root'
}

// export const AuthConsumer = AuthContext.Consumer
export { getUser, IsAdminOrRoot, IsLoggedin, useAuth, AuthProvider }
