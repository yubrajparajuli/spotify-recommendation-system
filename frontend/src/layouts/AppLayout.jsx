import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import NowPlayingBar from '../components/NowPlayingBar'
import PlayerModal from '../components/PlayerModal'
import LoginModal from '../components/LoginModal'
import { usePlayer } from '../context/PlayerContext'

function AppLayout({ user }) {
  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    showLoginModal,
    setShowLoginModal
  } = usePlayer()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    window.location.href = '/login'
  }

  return (
    <div className="h-screen flex flex-col bg-spotify-black">
      {/* MAIN LAYOUT */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar
          user={user}
          onLogout={handleLogout}
        />

        {/* MAIN CONTENT */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <TopBar user={user} />

          <div className="px-6 pb-6">
            <Outlet
              context={{
                playSong
              }}
            />
          </div>
        </main>
      </div>

      {/* MINI PLAYER */}
      <NowPlayingBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
      />

      {/* FULLSCREEN PLAYER MODAL */}
      <PlayerModal />

      {/* LOGIN REQUIRED MODAL */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  )
}

export default AppLayout