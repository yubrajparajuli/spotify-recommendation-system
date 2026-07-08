import { usePlayer } from "../context/PlayerContext"

function PlayerModal() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    previousSong,
    progress,
    duration,
    seekTo,
    isExpanded,
    minimizePlayer,
    closePlayer
  } = usePlayer()

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00"

    const min = Math.floor(t / 60)
    const sec = Math.floor(t % 60)

    return `${min}:${sec.toString().padStart(2, "0")}`
  }

  if (!isExpanded || !currentSong) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center px-6">
      <div className="absolute top-6 right-6 flex gap-5">
        <button
          onClick={minimizePlayer}
          className="text-white text-2xl hover:text-spotify-green"
        >
          ↓
        </button>

        <button
          onClick={closePlayer}
          className="text-white text-xl hover:text-red-500"
        >
          ✕
        </button>
      </div>

      <div className="w-80 h-80 rounded-2xl overflow-hidden bg-spotify-elevated shadow-2xl mb-8">
        {currentSong.cover_url ? (
          <img
            src={currentSong.cover_url}
            alt={currentSong.track_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🎵
          </div>
        )}
      </div>

      <h1 className="text-white text-3xl font-bold text-center">
        {currentSong.track_name}
      </h1>

      <p className="text-spotify-text-secondary text-lg mt-2">
        {currentSong.artists}
      </p>

      <div className="flex items-center gap-10 mt-10">
        <button
          onClick={previousSong}
          className="text-white text-3xl hover:text-spotify-green"
        >
          ⏮
        </button>

        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
        >
          {isPlaying ? (
            <div className="flex gap-1">
              <span className="block w-1.5 h-6 bg-black"></span>
              <span className="block w-1.5 h-6 bg-black"></span>
            </div>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="black"
              className="w-7 h-7 ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={nextSong}
          className="text-white text-3xl hover:text-spotify-green"
        >
          ⏭
        </button>
      </div>

      <div className="flex items-center gap-3 w-full max-w-lg mt-10">
        <span className="text-xs text-spotify-text-secondary">
          {formatTime(progress)}
        </span>

        <div
          className="flex-1 h-1 bg-zinc-700 rounded-full cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const percent = (e.clientX - rect.left) / rect.width
            seekTo(percent * duration)
          }}
        >
          <div
            className="h-1 bg-spotify-green rounded-full"
            style={{
              width: duration
                ? `${Math.min((progress / duration) * 100, 100)}%`
                : "0%"
            }}
          ></div>
        </div>

        <span className="text-xs text-spotify-text-secondary">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  )
}

export default PlayerModal