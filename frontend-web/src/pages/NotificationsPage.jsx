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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold dark:text-gray-100">Notifications</h1>
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
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-800">
          <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => !notification.is_read && dispatch(markAsRead(notification.id))}
              className={`w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-800 p-4 border ${notification.is_read ? 'border-transparent dark:border-gray-700' : 'border-primary-300 dark:border-primary-700'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">{notification.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                </div>
                {!notification.is_read && <span className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400 mt-2" />}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
