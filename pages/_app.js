import { useEffect } from 'react'
import { useRouter } from 'next/router'
import nProgress from 'nprogress'
import Layout from '../components/_App/Layout'
import 'semantic-ui-css/semantic.min.css'
import '../styles/globals.css'
import '../styles/nprogress.css'
import App from 'next/app'
import { authCheck } from '../utils/auth'

function MyApp({ Component, pageProps, user }) {
  const router = useRouter()

  useEffect(() => {
    const handleStart = (url) => {
      console.log(`Loading: ${url}`)
      nProgress.start()
    }
    const handleStop = () => {
      nProgress.done()
    }
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  return (
    <Layout user={user}>
      <Component {...pageProps} />
    </Layout>
  )
}

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext)
  // check protect routes
  const protectedRoutes = ['/account', '/create']
  const user = await authCheck(appContext.ctx, protectedRoutes)
  // If logged in, allow protected pages
  appProps.user = user ? user : false

  return { ...appProps }
}

export default MyApp
