import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from './Loader'

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  if (loading) {
    return <Loader className="h-screen" />
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
