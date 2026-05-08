import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bell, CheckCheck } from 'lucide-react'
import { fetchNotifications, markAllAsRead, markAsRead } from '../store/slices/notificationSlice'
import Loader from '../components/common/Loader'

export default function NotificationsPage() {
  const dispatch = useDispatch()
  const { notifications, loading } = useSelector((state) => state.notifications)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  if (loading) return <Loader className="h-96" />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="btn-secondary flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => !notification.is_read && dispatch(markAsRead(notification.id))}
              className={`w-full text-left bg-white rounded-lg shadow-sm p-4 border ${notification.is_read ? 'border-transparent' : 'border-primary-300'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-gray-900">{notification.title}</h2>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                </div>
                {!notification.is_read && <span className="w-2 h-2 rounded-full bg-primary-600 mt-2" />}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
