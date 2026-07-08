import { useNavigate } from "react-router-dom"

function LoginModal({ onClose }) {
  const navigate = useNavigate()

  const handleLogin = () => {
    onClose()
    navigate("/login")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-spotify-elevated border border-white/10 p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Login Required
        </h2>

        <p className="text-spotify-text-secondary mb-6">
          Please login to play music and enjoy your personalized experience.
        </p>

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-full bg-spotify-green text-black font-bold hover:bg-spotify-green-hover transition"
        >
          Login
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default LoginModal