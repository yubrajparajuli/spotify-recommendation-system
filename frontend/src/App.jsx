import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import Search from './pages/Search'
import Mood from './pages/Mood'
import Genre from './pages/Genre'
import Playlist from './pages/Playlist'
import Artist from './pages/Artist'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import SongPage from './pages/SongPage'

import { getUser, isLoggedIn } from './auth/auth'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const syncUser = () => {
      if (isLoggedIn()) {
        setUser(getUser())
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    syncUser()

    window.addEventListener('auth-change', syncUser)

    return () => {
      window.removeEventListener('auth-change', syncUser)
    }
  }, [])
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-spotify-black text-white">
        Loading...
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<AppLayout user={user} />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/genre" element={<Genre />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/artist" element={<Artist />} />
        <Route path="/song" element={<SongPage />} />
      </Route>
    </Routes>
  )
}

export default App