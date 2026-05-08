import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from './Loader'

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth)

  if (loading) {
    return <Loader className="h-screen" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user?.is_staff) {
    return <Navigate to="/" replace />
  }

  return children
}
