function PlaylistSongList({
  playlist,
  onRemove,
  onPlay
}) {
  if (!playlist) {
    return (
      <div className="bg-spotify-elevated rounded-2xl p-12 text-center">
        <p className="text-spotify-text-secondary">
          Select a playlist to start
        </p>
      </div>
    )
  }

  const playPlaylist = () => {
    if (!playlist.songs.length) return
    onPlay(playlist.songs[0], 0)
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-4xl font-bold">
            {playlist.name}
          </h1>
          <p className="text-spotify-text-secondary mt-2">
            {playlist.songs.length} songs
          </p>
        </div>

        {playlist.songs.length > 0 && (
          <button
            onClick={playPlaylist}
            className="bg-spotify-green text-black font-bold px-8 py-3 rounded-full hover:bg-spotify-green-hover hover:scale-105 transition"
          >
            ▶ Play Playlist
          </button>
        )}
      </div>

      <div className="bg-spotify-elevated rounded-2xl overflow-hidden">
        {playlist.songs.length === 0 ? (
          <div className="p-10 text-center text-spotify-text-secondary">
            No songs added
          </div>
        ) : (
          playlist.songs.map((song, index) => (
            <div
              key={song.id}
              onClick={() => onPlay(song, index)}
              className="flex items-center justify-between px-6 py-4 border-b border-spotify-border hover:bg-spotify-hover cursor-pointer group"
            >
              <div className="flex items-center gap-5">
                <span className="text-spotify-text-secondary w-5">
                  {index + 1}
                </span>

                <img
                  src={
                    song.cover_url ||
                    "https://placehold.co/60x60/222/fff?text=♪"
                  }
                  alt={song.track_name}
                  className="w-14 h-14 rounded-lg object-cover"
                />

                <div>
                  <p className="text-white font-semibold">
                    {song.track_name}
                  </p>
                  <p className="text-sm text-spotify-text-secondary">
                    {song.artists}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(playlist.id, song.id)
                }}
                className="text-zinc-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition text-xl"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PlaylistSongList