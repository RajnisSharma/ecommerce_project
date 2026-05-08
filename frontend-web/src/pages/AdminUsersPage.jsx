import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AdminSidebar from '../components/admin/AdminSidebar'
import { fetchAdminUsers } from '../store/slices/adminSlice'
import Loader from '../components/common/Loader'

export default function AdminUsersPage() {
  const dispatch = useDispatch()
  const { users, loading } = useSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAdminUsers())
  }, [dispatch])

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-8">Users</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? <Loader className="h-64" /> : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">{`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User'}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.is_staff ? 'Staff' : 'Customer'}</td>
                    <td className="px-6 py-4">{new Date(user.date_joined).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
