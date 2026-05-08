import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  User, Mail, Phone, Calendar, MapPin, Lock, Camera, Edit2,
  Plus, Trash2, Check, Home, Package, Heart, CreditCard,
  ChevronRight, Shield
} from 'lucide-react'
import {
  fetchProfile, updateProfile, changePassword,
  fetchAddresses, addAddress, updateAddress, deleteAddress,
  clearError, clearSuccessMessage, logout
} from '../store/slices/authSlice'
import { fetchOrders } from '../store/slices/orderSlice'
import Loader from '../components/common/Loader'

const TABS = {
  OVERVIEW: 'overview',
  EDIT_PROFILE: 'edit_profile',
  ADDRESSES: 'addresses',
  SECURITY: 'security',
  ORDERS: 'orders',
  WISHLIST: 'wishlist'
}

export default function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const { user, addresses, loading, error, successMessage } = useSelector((state) => state.auth)
  const { orders } = useSelector((state) => state.orders)

  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW)
  const [isEditing, setIsEditing] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  })

  // Address form state
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    is_default: false,
  })

  useEffect(() => {
    dispatch(fetchProfile())
    dispatch(fetchAddresses())
    dispatch(fetchOrders())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  useEffect(() => {
    if (error) {
      const message = typeof error === 'string' ? error : Object.values(error).flat().join(', ')
      toast.error(message)
      dispatch(clearError())
    }
  }, [error, dispatch])

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      dispatch(clearSuccessMessage())
    }
  }, [successMessage, dispatch])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    const result = await dispatch(updateProfile(formData))
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Avatar updated successfully')
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(updateProfile(profileForm))
    if (updateProfile.fulfilled.match(result)) {
      setIsEditing(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordForm.new_password !== passwordForm.new_password_confirm) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    const result = await dispatch(changePassword({
      old_password: passwordForm.old_password,
      new_password: passwordForm.new_password,
    }))
    if (changePassword.fulfilled.match(result)) {
      setPasswordForm({ old_password: '', new_password: '', new_password_confirm: '' })
    }
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    if (editingAddress) {
      const result = await dispatch(updateAddress({ id: editingAddress.id, data: addressForm }))
      if (updateAddress.fulfilled.match(result)) {
        setShowAddressForm(false)
        setEditingAddress(null)
        resetAddressForm()
      }
    } else {
      const result = await dispatch(addAddress(addressForm))
      if (addAddress.fulfilled.match(result)) {
        setShowAddressForm(false)
        resetAddressForm()
      }
    }
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setAddressForm({
      street: address.street,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default,
    })
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await dispatch(deleteAddress(id))
    }
  }

  const resetAddressForm = () => {
    setAddressForm({
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      is_default: false,
    })
  }

  const getOrderStats = () => {
    if (!orders) return { total: 0, delivered: 0, pending: 0, totalSpent: 0 }
    const delivered = orders.filter(o => o.status === 'delivered').length
    const pending = orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length
    const totalSpent = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0)
    return { total: orders.length, delivered, pending, totalSpent }
  }

  const stats = getOrderStats()

  if (loading && !user) return <Loader className="h-96" />

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Package className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-bold">{stats.delivered}</p>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</p>
            </div>
            <CreditCard className="w-8 h-8 text-primary-500" />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{user?.first_name} {user?.last_name}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user?.phone || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">{new Date(user?.date_joined).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Default Address */}
      {addresses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Default Address</h3>
            <button
              onClick={() => setActiveTab(TABS.ADDRESSES)}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              Manage All
            </button>
          </div>
          {(() => {
            const defaultAddr = addresses.find(a => a.is_default) || addresses[0]
            return (
              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <Home className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">{defaultAddr.street}</p>
                  <p className="text-gray-500">{defaultAddr.city}, {defaultAddr.state} {defaultAddr.postal_code}</p>
                  <p className="text-gray-500">{defaultAddr.country}</p>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        {orders?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {orders?.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.total_amount}</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderEditProfile = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">Edit Profile</h3>
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={profileForm.first_name}
              onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={profileForm.last_name}
              onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false)
              setActiveTab(TABS.OVERVIEW)
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Addresses</h3>
        <button
          onClick={() => {
            setEditingAddress(null)
            resetAddressForm()
            setShowAddressForm(true)
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Address
        </button>
      </div>

      {showAddressForm && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={addressForm.postal_code}
                  onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_default"
                checked={addressForm.is_default}
                onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                Set as default address
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingAddress ? 'Update' : 'Save')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddressForm(false)
                  setEditingAddress(null)
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {addresses.length === 0 ? (
          <p className="text-gray-500 col-span-2 text-center py-8">No addresses saved yet</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className={`bg-white rounded-lg shadow p-4 border-2 ${address.is_default ? 'border-primary-500' : 'border-transparent'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">{address.street}</p>
                    <p className="text-gray-500 text-sm">{address.city}, {address.state} {address.postal_code}</p>
                    <p className="text-gray-500 text-sm">{address.country}</p>
                    {address.is_default && (
                      <span className="inline-flex items-center mt-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                        <Check className="w-3 h-3 mr-1" />
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="p-1 text-gray-400 hover:text-primary-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  const renderSecurity = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">Security Settings</h3>

      <div className="mb-8">
        <h4 className="font-medium mb-4 flex items-center">
          <Lock className="w-4 h-4 mr-2" />
          Change Password
        </h4>
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={passwordForm.old_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
              minLength={8}
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.new_password_confirm}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium mb-4 flex items-center text-red-600">
          <Shield className="w-4 h-4 mr-2" />
          Account Actions
        </h4>
        <p className="text-sm text-gray-500 mb-4">These actions are irreversible. Please proceed with caution.</p>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) {
              dispatch(logout())
              navigate('/login')
            }
          }}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-100">
                      <User className="w-12 h-12 text-primary-600" />
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 p-1.5 bg-primary-600 text-white rounded-full hover:bg-primary-700"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <h2 className="mt-4 font-semibold text-lg">{user?.first_name} {user?.last_name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          <nav className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => setActiveTab(TABS.OVERVIEW)}
              className={`w-full flex items-center px-4 py-3 text-left ${activeTab === TABS.OVERVIEW ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <User className="w-5 h-5 mr-3" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab(TABS.ADDRESSES)}
              className={`w-full flex items-center px-4 py-3 text-left ${activeTab === TABS.ADDRESSES ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <MapPin className="w-5 h-5 mr-3" />
              Addresses
              <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {addresses.length}
              </span>
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
            >
              <Package className="w-5 h-5 mr-3" />
              Orders
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
            <button
              onClick={() => navigate('/wishlist')}
              className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
            >
              <Heart className="w-5 h-5 mr-3" />
              Wishlist
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
            <button
              onClick={() => setActiveTab(TABS.SECURITY)}
              className={`w-full flex items-center px-4 py-3 text-left ${activeTab === TABS.SECURITY ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Shield className="w-5 h-5 mr-3" />
              Security
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {isEditing || activeTab === TABS.EDIT_PROFILE ? renderEditProfile()
            : activeTab === TABS.ADDRESSES ? renderAddresses()
              : activeTab === TABS.SECURITY ? renderSecurity()
                : renderOverview()
          }
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100'
}

function ClockIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
