import { Container, Image, Menu, Icon } from 'semantic-ui-react'
import Link from 'next/link'
import { useRouter } from 'next/router'

function Header() {
  const router = useRouter()
  const user = true

  function isActive(route) {
    return route === router.pathname
  }

  return (
    <Menu fluid inverted id="menu">
      <Container text>
        <Link href="/" passHref>
          <Menu.Item header active={isActive('/')}>
            <Image
              size="mini"
              src="/logo.svg"
              style={{ marginRight: '1rem' }}
              alt="header"
            />
            NextCommerce
          </Menu.Item>
        </Link>
        <Link href="/cart" passHref>
          <Menu.Item header active={isActive('/cart')}>
            <Icon name="cart" size="large" />
            Cart
          </Menu.Item>
        </Link>

        {user && (
          <Link href="/create" passHref active={isActive('/create')}>
            <Menu.Item header>
              <Icon name="add square" size="large" />
              Create
            </Menu.Item>
          </Link>
        )}

        {user ? (
          <>
            <Link href="/account" passHref>
              <Menu.Item header active={isActive('/account')}>
                <Icon name="user" size="large" />
                Account
              </Menu.Item>
            </Link>
            <Menu.Item header>
              <Icon name="sign out" size="large" />
              Logout
            </Menu.Item>
          </>
        ) : (
          <>
            <Link href="/login" passHref>
              <Menu.Item header active={isActive('/login')}>
                <Icon name="sign in" size="large" />
                Login
              </Menu.Item>
            </Link>

            <Link href="/register" passHref>
              <Menu.Item header active={isActive('/register')}>
                <Icon name="signup" size="large" />
                Register
              </Menu.Item>
            </Link>
          </>
        )}
      </Container>
    </Menu>
  )
}

export default Header
