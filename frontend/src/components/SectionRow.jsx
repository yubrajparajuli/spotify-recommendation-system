import SongCard from "./SongCard"

function SectionRow({
  title,
  songs,
  isLoading,
  error,
  onPlay
}) {
  if (error) return null

  return (
    <section className="mb-12 w-full min-w-0">
      <h2 className="text-white text-2xl font-bold mb-6">
        {title}
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-spotify-elevated rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.isArray(songs) &&
            songs.map((song, index) => (
              <div
                key={song.id || index}
                className="min-w-0 transition hover:-translate-y-1"
              >
                <SongCard
                  song={song}
                  onPlay={onPlay}
                />
              </div>
            ))}
        </div>
      )}
    </section>
  )
}

export default SectionRow