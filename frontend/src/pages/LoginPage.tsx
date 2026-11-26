import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Truck, ArrowLeft, ShieldCheck } from 'lucide-react'

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
      const msg =
        err?.response?.data?.non_field_errors?.[0] ||
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        'Invalid email or password. Try using the demo credentials below.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
      <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1600&q=70&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(99,179,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Back link */}
      <Link to="/" className="absolute top-6 left-6 z-10 flex items-center gap-2 text-slate-300 hover:text-white text-sm font-semibold transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      {/* Card */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header stripe */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-center relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Express Logistics</h1>
            <p className="text-blue-200 text-sm mt-1">Staff & Operations Portal</p>
            <p className="text-blue-300 text-xs mt-0.5 font-mono">Kala-Amb, Himachal Pradesh</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200 flex items-start gap-2">
                <span className="mt-0.5">⚠️</span> {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                placeholder="admin@expresslogistics.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                placeholder="••••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <ShieldCheck size={14} className="text-blue-600" /> Demo Access
              </div>
              <button
                type="button"
                onClick={async () => {
                  setEmail('admin@transportpro.com')
                  setPassword('Admin@12345')
                  setError('')
                  setLoading(true)
                  try {
                    await login('admin@transportpro.com', 'Admin@12345')
                    navigate('/dashboard')
                  } catch (err: any) {
                    setError(err?.response?.data?.non_field_errors?.[0] || 'Demo login failed.')
                  } finally {
                    setLoading(false)
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-lg text-xs transition-colors shadow-sm"
              >
                One-Click Login
              </button>
            </div>
            <div className="space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-blue-600">Email:</span>
                <span className="font-bold select-all">admin@expresslogistics.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Password:</span>
                <span className="font-bold select-all">Admin@12345</span>
              </div>
              <div className="text-[11px] text-blue-500 pt-1 font-sans">
                (Also accepts: <span className="font-mono font-semibold">admin@transportpro.com</span>)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
