import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, ShieldCheck } from 'lucide-react'
import { authAPI } from '../services/api'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('request')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    new_password: '',
    new_password_confirm: '',
  })

  const requestReset = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await authAPI.requestPasswordReset({ email: formData.email })
      toast.success('If this email exists, a reset code has been sent.')
      setStep('verify')
    } catch {
      toast.error('Could not request a reset code')
    } finally {
      setLoading(false)
    }
  }

  const verifyReset = async (event) => {
    event.preventDefault()
    if (formData.new_password !== formData.new_password_confirm) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await authAPI.verifyPasswordReset({
        email: formData.email,
        otp: formData.otp,
        new_password: formData.new_password,
      })
      toast.success('Password reset successful')
      navigate('/login')
    } catch (error) {
      const message = typeof error.response?.data?.error === 'string'
        ? error.response.data.error
        : 'Could not reset password'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset password</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">Back to sign in</Link>
          </p>
        </div>

        {step === 'request' ? (
          <form className="space-y-6" onSubmit={requestReset}>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Email address"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50">
              {loading ? 'Sending...' : 'Send reset code'}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={verifyReset}>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                maxLength={6}
                className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Reset code"
                value={formData.otp}
                onChange={(event) => setFormData({ ...formData, otp: event.target.value })}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                minLength={8}
                className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="New password"
                value={formData.new_password}
                onChange={(event) => setFormData({ ...formData, new_password: event.target.value })}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                minLength={8}
                className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Confirm new password"
                value={formData.new_password_confirm}
                onChange={(event) => setFormData({ ...formData, new_password_confirm: event.target.value })}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50">
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
