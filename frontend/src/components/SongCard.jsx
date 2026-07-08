function SongCard({ song, onPlay }) {
  const handlePlay = (e) => {
    e.stopPropagation()
    onPlay?.(song)
  }

  return (
    <div
      onClick={() => onPlay?.(song)}
      className="bg-spotify-elevated hover:bg-spotify-hover rounded-xl p-3 transition duration-300 cursor-pointer group"
    >
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-800">
        <img
          src={
            song?.cover_url ||
            "https://placehold.co/300x300/181818/FFFFFF?text=♪"
          }
          alt={song?.track_name || "song"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <button
          onClick={handlePlay}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-spotify-green flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
        >
          <svg
            viewBox="0 0 24 24"
            fill="black"
            className="w-5 h-5 ml-0.5"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      <div className="mt-3 min-w-0">
        <p className="text-white text-sm font-semibold truncate">
          {song?.track_name || "Unknown Track"}
        </p>

        <p className="text-spotify-text-secondary text-xs truncate mt-1">
          {song?.artists || "Unknown Artist"}
        </p>
      </div>
    </div>
  )
}

export default SongCard