import { useEffect } from 'react'
import App from 'next/app'
import { useRouter } from 'next/router'
import { AuthProvider, getUser } from '../utils/context'
import nProgress from 'nprogress'
import Layout from '../components/_App/Layout'
import 'semantic-ui-css/semantic.min.css'
import '../styles/globals.css'
import '../styles/nprogress.css'

function MyApp({ Component, pageProps, auth }) {
  const router = useRouter()

  const syncLogout = (event) => {
    if (event.key === 'logout') {
      console.log('logout from of storage')
      router.push('/login')
    }
  }

  useEffect(() => {
    window.addEventListener('storage', syncLogout)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return (
    <AuthProvider myAuth={auth}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext)
  // check protect routes
  const auth = await getUser(appContext.ctx)
  return { ...appProps, auth: auth }
}

export default MyApp
