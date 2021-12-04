import { useEffect } from 'react'
import { useRouter } from 'next/router'
import nProgress from 'nprogress'
import Layout from '../components/_App/Layout'
import 'semantic-ui-css/semantic.min.css'
import '../styles/globals.css'
import '../styles/nprogress.css'

function MyApp({ Component, pageProps }) {
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
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
