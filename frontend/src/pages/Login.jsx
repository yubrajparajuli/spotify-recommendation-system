import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { notifyAuthChange } from '../auth/auth'
import { post } from '../api/client'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await post("/auth/login", {
        email,
        password,
      })

      localStorage.setItem(
        "token",
        data.access_token
      )

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      )

      notifyAuthChange()
      navigate("/")
    } catch (error) {
      alert(
        error.message || "Login failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden px-4">
      <div className="wave-login top-[-120px] left-[-160px]" />
      <div className="wave-login-2 bottom-[-120px] right-[-160px]" />

      <div className="relative z-10 w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-spotify-green">
            Spotify
          </h1>
          <p className="text-spotify-text-secondary text-sm mt-1">
            Welcome back
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-spotify-text-secondary focus:outline-none focus:border-spotify-green"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              className="w-full px-4 py-3 pr-12 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-spotify-text-secondary focus:outline-none focus:border-spotify-green"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-spotify-text-secondary hover:text-white"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-spotify-green text-black font-bold hover:bg-spotify-green-hover transition disabled:opacity-60"
          >
            {
              loading
                ? "Logging in..."
                : "Login"
            }
          </button>
        </form>

        <p className="text-center text-spotify-text-secondary text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-white hover:text-spotify-green"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login