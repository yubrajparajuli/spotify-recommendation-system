import { useState, useEffect } from 'react'
import { useSearchParams, useOutletContext } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import SectionRow from '../components/SectionRow'
import SongAutocomplete from '../components/SongAutocomplete'
import { getSimilarSongs, searchSongs } from '../api/recommendations'

function Search() {
  const { playSong, currentSong } = useOutletContext()

  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialArtist = searchParams.get('artist') || ''

  const [songName, setSongName] = useState(initialQuery)
  const [artist, setArtist] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery)
  const [submittedArtist, setSubmittedArtist] = useState(initialArtist)

  useEffect(() => {
    if (initialQuery) {
      setSongName(initialQuery)
      setSubmittedQuery(initialQuery)
      setSubmittedArtist(initialArtist)
    }
  }, [initialQuery, initialArtist])

  // 🎯 exact match song
  const { data: exactMatchData } = useQuery({
    queryKey: ['search-songs-exact', submittedQuery],
    queryFn: () => searchSongs({ query: submittedQuery, n: 1 }),
    enabled: !!submittedQuery,
  })

  // 🎯 similar songs
  const { data, isLoading, error } = useQuery({
    queryKey: ['similar-song', submittedQuery, submittedArtist],
    queryFn: () =>
      getSimilarSongs({
        songName: submittedQuery,
        artist: submittedArtist || undefined,
        n: 15,
      }),
    enabled: !!submittedQuery,
  })

  const handleSelect = (song) => {
    const firstArtist = song.artists.split(';')[0]
    setSongName(song.track_name)
    setArtist(firstArtist)
    setSubmittedQuery(song.track_name)
    setSubmittedArtist(firstArtist)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmittedQuery(songName.trim())
    setSubmittedArtist(artist.trim())
  }

  const exactSong = exactMatchData?.results?.[0]

  // ✅ FIX: check real playback state
  const isPlayingThisSong =
    currentSong?.track_name === exactSong?.track_name

  return (
    <div className="pt-6">
      <h1 className="text-white text-2xl font-bold mb-6">
        Find songs like...
      </h1>

      {/* SEARCH */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8 max-w-xl">
        <SongAutocomplete
          value={songName}
          onChange={setSongName}
          onSelect={handleSelect}
          placeholder="Song name (e.g. Shape of You)"
        />

        <button
          type="submit"
          className="bg-spotify-green text-black font-semibold text-sm rounded-md px-6 hover:bg-spotify-green-hover"
        >
          Search
        </button>
      </form>

      {/* HERO SONG */}
      {exactSong && (
        <div
          onClick={() => {
            if (!isPlayingThisSong) {
              playSong(exactSong)
            }
          }}
          className="flex items-center gap-4 bg-spotify-elevated hover:bg-spotify-hover rounded-md p-4 mb-8 max-w-xl cursor-pointer group"
        >
          <div className="w-16 h-16 rounded bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <div className="min-w-0">
            <p className="text-spotify-text-secondary text-xs uppercase mb-1">
              {isPlayingThisSong ? 'Now Playing' : 'Search Result'}
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
      {submittedQuery && (
        <SectionRow
          title={`Songs similar to "${submittedQuery}"`}
          songs={data?.results ?? []}
          isLoading={isLoading}
          error={error}
          onPlay={playSong}
        />
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm">{error.message}</p>
      )}
    </div>
  )
}

export default Search