import { useAuth } from '../utils/context'

const Account = () => {
  const {
    auth: { user },
  } = useAuth()

  return (
    <>
      <h2>Esta es mi cuenta</h2>
      <pre>Nombre: {user?.name}</pre>
      <pre>Email: {user?.email}</pre>
      <pre>Rool: {user?.role}</pre>
      <pre>CreatedAt: {user?.createdAt}</pre>
      <pre>id: {user?._id}</pre>
    </>
  )
}

export default Account
