import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Truck } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      if (!err.response) {
        setError('Unable to connect to backend server. Please ensure the Django backend is running on http://localhost:8000')
      } else if (err.response.status === 404) {
        setError('API endpoint not found (404). Backend server is not running or VITE_API_URL is misconfigured.')
      } else if (err.response.status === 502 || err.response.status === 504) {
        setError('Backend proxy error. Ensure Django is running on http://localhost:8000')
      } else {
        setError(err.response?.data?.error || 'Invalid email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Truck className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TransportPro</h1>
          <p className="text-gray-500 text-sm mt-1">Transport Agency Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-slate-800">Demo Credentials:</p>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@transportpro.com')
                setPassword('Admin@12345')
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold underline text-xs"
            >
              Autofill Credentials
            </button>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Email:</span>
            <span className="font-mono text-blue-700 font-semibold select-all">admin@transportpro.com</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Password:</span>
            <span className="font-mono text-blue-700 font-semibold select-all">Admin@12345</span>
          </div>
        </div>
      </div>
    </div>
  )
}

