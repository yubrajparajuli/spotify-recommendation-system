import { usePlayer } from '../context/PlayerContext'

function NowPlayingBar() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    previousSong,
    progress,
    duration,
    seekTo,
    expandPlayer,
    closePlayer
  } = usePlayer()

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00"

    const min = Math.floor(t / 60)
    const sec = Math.floor(t % 60)

    return `${min}:${sec.toString().padStart(2, "0")}`
  }

  if (!currentSong) {
    return (
      <footer className="h-20 bg-spotify-elevated border-t border-spotify-border flex items-center justify-center">
        <p className="text-spotify-text-secondary text-sm">
          No song playing
        </p>
      </footer>
    )
  }

  return (
    <footer className="h-24 bg-spotify-elevated border-t border-spotify-border px-5 flex items-center justify-between gap-5">
      {/* LEFT */}
      <div className="flex items-center gap-4 w-1/3 min-w-0">
        <img
          src={
            currentSong.cover_url ||
            "https://placehold.co/80x80/222/fff?text=♪"
          }
          alt={currentSong.track_name}
          className="w-16 h-16 rounded-lg object-cover"
        />

        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {currentSong.track_name}
          </p>
          <p className="text-spotify-text-secondary text-xs truncate">
            {currentSong.artists}
          </p>
        </div>
      </div>

      {/* CENTER */}
      <div className="w-1/3 flex flex-col items-center gap-2">
        <div className="flex items-center gap-6">
          <button
            onClick={previousSong}
            className="text-zinc-300 hover:text-white text-lg"
          >
            ⏮
          </button>

          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-white flex items-center justify-center hover:scale-105 transition"
          >
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-1.5 h-5 bg-black"></div>
                <div className="w-1.5 h-5 bg-black"></div>
              </div>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="black"
                className="w-5 h-5 ml-1"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={nextSong}
            className="text-zinc-300 hover:text-white text-lg"
          >
            ⏭
          </button>
        </div>

        {/* PROGRESS */}
        <div className="flex items-center gap-2 w-full">
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

      {/* RIGHT */}
      <div className="w-1/3 flex justify-end items-center gap-5">
        <button
          onClick={expandPlayer}
          className="text-zinc-300 hover:text-spotify-green"
        >
          ⛶
        </button>

        <button
          onClick={closePlayer}
          className="text-zinc-300 hover:text-red-400"
        >
          ✕
        </button>
      </div>
    </footer>
  )
}

export default NowPlayingBar