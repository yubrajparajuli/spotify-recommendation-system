function PlaylistCard({
  playlist,
  active,
  onClick
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl transition ${
        active
          ? 'bg-spotify-green text-black'
          : 'bg-spotify-elevated text-white hover:bg-spotify-hover'
      }`}
    >
      <h3 className="font-bold">
        {playlist.name}
      </h3>

      <p className="text-sm opacity-70">
        {playlist.songs.length} songs
      </p>
    </button>
  )
}

export default PlaylistCard