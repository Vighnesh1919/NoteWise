import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const THEMES = {
  blue:  { accent: 'bg-blue-600', hover: 'hover:bg-blue-700', text: 'text-blue-600', ring: 'focus:ring-blue-200', border: 'focus:border-blue-500' },
  sage:  { accent: 'bg-green-700', hover: 'hover:bg-green-800', text: 'text-green-700', ring: 'focus:ring-green-200', border: 'focus:border-green-600' },
  rose:  { accent: 'bg-rose-600', hover: 'hover:bg-rose-700', text: 'text-rose-600', ring: 'focus:ring-rose-200', border: 'focus:border-rose-500' },
  amber: { accent: 'bg-amber-600', hover: 'hover:bg-amber-700', text: 'text-amber-600', ring: 'focus:ring-amber-200', border: 'focus:border-amber-500' },
}

const DOTS = [
  { key: 'blue',  bg: 'bg-blue-600' },
  { key: 'sage',  bg: 'bg-green-700' },
  { key: 'rose',  bg: 'bg-rose-600' },
  { key: 'amber', bg: 'bg-amber-600' },
]

function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: 'bg-gray-200' }
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^a-zA-Z0-9]/.test(pw)]
  const score = checks.filter(Boolean).length
  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' }
  if (score === 3) return { score, label: 'Fair', color: 'bg-yellow-500' }
  return { score, label: 'Strong', color: 'bg-green-500' }
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const [theme, setTheme] = useState('blue')

  const t = THEMES[theme]
  const strength = getStrength(form.password)
  const isValid = form.email && form.password.length >= 8 && form.password === form.confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await register(form.email, form.password)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f3f0] px-4 font-sans">

      <div className="w-full max-w-sm bg-white rounded-2xl p-8 border border-black/10 shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <span className={`text-xs font-semibold px-3 py-1 rounded bg-gray-100 ${t.text}`}>
            NoteWise
          </span>

          <div className="flex gap-2">
            {DOTS.map(d => (
              <button
                key={d.key}
                onClick={() => setTheme(d.key)}
                className={`w-4 h-4 rounded-full ${d.bg} border-2 ${
                  theme === d.key ? 'border-black' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-[#1a1916] mb-1">
          Start writing
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Create your NoteWise account
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className={`w-full border border-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ${t.ring} ${t.border}`}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="text-xs font-semibold text-gray-500">
                Password
              </label>
              {strength.label && (
                <span className="text-xs font-medium text-gray-500">
                  {strength.label}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                minLength={8}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min 8 characters"
                className={`w-full border border-black/20 rounded-lg px-3 py-2 pr-10 text-sm outline-none focus:ring-2 ${t.ring} ${t.border}`}
              />

              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400"
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Strength bar */}
            <div className="flex gap-1 mt-2">
              {[0,1,2,3].map(i => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded ${
                    i < strength.score ? strength.color : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Confirm */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Confirm password
            </label>

            <div className="relative">
              <input
                type={showCf ? 'text' : 'password'}
                required
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="••••••••"
                className={`w-full border border-black/20 rounded-lg px-3 py-2 pr-10 text-sm outline-none focus:ring-2 ${t.ring} ${t.border}`}
              />

              <button
                type="button"
                onClick={() => setShowCf(!showCf)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400"
              >
                {showCf ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white transition ${
              !isValid || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : `${t.accent} ${t.hover}`
            }`}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* <button className="w-full flex items-center justify-center gap-2 border border-black/20 bg-gray-50 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
          <GoogleIcon />
          Sign up with Google
        </button> */}

        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{' '}
          <Link to="/login" className={`${t.text} font-semibold`}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}