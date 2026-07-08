import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/mood', label: 'Mood' },
  { to: '/genre', label: 'Genres' },
  { to: '/playlist', label: 'Build Playlist' },
  { to: '/artist', label: 'Artist' },
]

function Sidebar() {
  return (
    <aside className="w-60 bg-gradient-to-b from-black to-spotify-black h-full flex flex-col px-2 py-4 border-r border-spotify-border">
      {/* LOGO */}
      <div className="px-3 py-2 mb-4">
        <NavLink
          to="/"
          className="text-spotify-green text-xl font-bold tracking-wide hover:opacity-80 transition"
        >
          Spotify
        </NavLink>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? 'text-white bg-spotify-hover'
                  : 'text-spotify-text-secondary hover:text-spotify-green hover:bg-spotify-hover'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* SPACER (important for full-height look) */}
      <div className="mt-auto" />
    </aside>
  )
}

export default Sidebar