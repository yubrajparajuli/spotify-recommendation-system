import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { post } from '../api/client'
import { notifyAuthChange } from '../auth/auth'

function Signup() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await post('/auth/register', {
        email,
        username,
        password,
      })

      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))

      notifyAuthChange()
      navigate('/onboarding')

    } catch (error) {
      alert(error.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden px-4">

      {/* 🌊 SIGNUP WAVES (different vibe than login) */}
      <div className="wave-signup top-[-140px] left-[-180px] will-change-transform" />
      <div className="wave-signup-2 bottom-[-140px] right-[-180px] will-change-transform" />

      {/* SIGNUP CARD */}
      <div className="relative z-10 w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-spotify-green">
            Spotify
          </h1>
          <p className="text-spotify-text-secondary text-sm mt-1">
            Create your account
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* EMAIL */}
          <input
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-spotify-text-secondary focus:outline-none focus:border-spotify-green transition"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          {/* USERNAME */}
          <input
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-spotify-text-secondary focus:outline-none focus:border-spotify-green transition"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 pr-12 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-spotify-text-secondary focus:outline-none focus:border-spotify-green transition"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            {/* EYE ICON */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-spotify-text-secondary hover:text-white transition"
            >
              {showPassword ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-10-8-10-8a18.45 18.45 0 015.06-6.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 10 8 10 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" d="M2.1 12s3.7-8 9.9-8 9.9 8 9.9 8-3.7 8-9.9 8-9.9-8-9.9-8z" />
                  <circle cx="12" cy="12" r="3" strokeWidth="2" />
                </svg>
              )}
            </button>

          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-spotify-green text-black font-bold hover:bg-spotify-green-hover transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-spotify-text-secondary text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:text-spotify-green transition">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Signup