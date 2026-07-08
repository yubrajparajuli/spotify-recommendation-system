import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from './Button'
import SongAutocomplete from './SongAutocomplete'

import { logout } from '../auth/auth'

function TopBar({ user }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSelect = (song) => {
    const firstArtist = song.artists.split(';')[0]

    navigate(
      `/search?q=${encodeURIComponent(song.track_name)}&artist=${encodeURIComponent(firstArtist)}`
    )
    setQuery('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return

    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setQuery('')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-spotify-black/80 backdrop-blur sticky top-0 z-10 gap-4">
      {/* BACK / FORWARD */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black transition"
        >
          ←
        </button>

        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black transition"
        >
          →
        </button>
      </div>

      {/* SEARCH */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-md">
        <SongAutocomplete
          value={query}
          onChange={setQuery}
          onSelect={handleSelect}
          placeholder="What do you want to play?"
        />
      </form>

      {/* USER */}
      <div className="flex items-center gap-3">
        {user?.username ? (
          <>
            <div className="w-8 h-8 rounded-full bg-spotify-hover flex items-center justify-center text-spotify-green font-bold text-sm uppercase">
              {user.username.charAt(0)}
            </div>

            <span className="text-white text-sm font-medium">
              {user.username}
            </span>

            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Log in
            </Button>

            <Button variant="primary" onClick={() => navigate('/signup')}>
              Sign up
            </Button>
          </>
        )}
      </div>
    </header>
  )
}

export default TopBar