import Head from 'next/head'
import { Container } from 'semantic-ui-react'

import Header from './Header'
import HeadContent from './HeadContent'

function Layout({ children }) {
  return (
    <>
      <Head>
        <HeadContent />
        <title>ReactCommerce</title>
      </Head>
      <Header />
      <Container text style={{ paddingTop: '1em' }}>
        {children}
      </Container>
    </>
  )
}

export default Layout
