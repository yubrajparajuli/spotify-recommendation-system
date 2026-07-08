import { useEffect, useState } from 'react'
import { useSearchParams, useOutletContext } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { searchSongs, getSimilarSongs } from '../api/recommendations'
import SectionRow from '../components/SectionRow'

function SongPage() {
  const { playSong } = useOutletContext()

  const [searchParams] = useSearchParams()

  const songName = searchParams.get('q') || ''
  const artist = searchParams.get('artist') || ''

  const [submitted, setSubmitted] = useState({ songName, artist })

  useEffect(() => {
    setSubmitted({ songName, artist })
  }, [songName, artist])

  // 🎯 exact song
  const { data: exactMatch } = useQuery({
    queryKey: ['song-exact', submitted.songName],
    queryFn: () => searchSongs({ query: submitted.songName, n: 1 }),
    enabled: !!submitted.songName,
  })

  // 🎯 similar songs
  const { data, isLoading, error } = useQuery({
    queryKey: ['song-similar', submitted.songName, submitted.artist],
    queryFn: () =>
      getSimilarSongs({
        songName: submitted.songName,
        artist: submitted.artist || undefined,
        n: 15,
      }),
    enabled: !!submitted.songName,
  })

  const exactSong = exactMatch?.results?.[0]

  return (
    <div className="pt-6">
      {/* HERO SONG */}
      {exactSong && (
        <div
          onClick={() => playSong(exactSong)}
          className="flex items-center gap-4 bg-spotify-elevated hover:bg-spotify-hover rounded-md p-4 mb-8 max-w-xl cursor-pointer"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <div className="min-w-0">
            <p className="text-spotify-text-secondary text-xs uppercase">
              Now selected
            </p>
            <p className="text-white font-semibold truncate">
              {exactSong.track_name}
            </p>
            <p className="text-spotify-text-secondary text-sm truncate">
              {exactSong.artists}
            </p>
          </div>
        </div>
      )}

      {/* SIMILAR SONGS */}
      <SectionRow
        title="Recommended Songs"
        songs={data?.results ?? []}
        isLoading={isLoading}
        error={error}
        onPlay={playSong}
      />
    </div>
  )
}

export default SongPage