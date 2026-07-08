import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useOutletContext, useNavigate } from 'react-router-dom'

import SectionRow from '../components/SectionRow'
import ArtistAutocomplete from '../components/ArtistAutocomplete'
import { getArtistRecommendations } from '../api/recommendations'

function Artist() {
  const { playSong } = useOutletContext()
  const navigate = useNavigate()

  const [artistInput, setArtistInput] = useState('')
  const [submittedArtist, setSubmittedArtist] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['artist', submittedArtist],
    queryFn: () =>
      getArtistRecommendations({ artist: submittedArtist, n: 15 }),
    enabled: !!submittedArtist,
  })

  return (
    <div className="pt-6">
      <h1 className="text-white text-2xl font-bold mb-6">
        Artist
      </h1>

      {/* SEARCH */}
      <div className="flex gap-3 mb-8 max-w-xl">
        <ArtistAutocomplete
          value={artistInput}
          onChange={setArtistInput}
          onSelect={(artist) => {
            setArtistInput(artist)
            setSubmittedArtist(artist)
          }}
          placeholder="Search artist (e.g. Ed Sheeran)"
        />

        <button
          onClick={() => setSubmittedArtist(artistInput.trim())}
          className="bg-spotify-green text-black font-semibold text-sm rounded-md px-6 hover:bg-spotify-green-hover"
        >
          Search
        </button>
      </div>

      {/* RESULTS */}
      {submittedArtist && (
        <SectionRow
          title={`Top songs by ${submittedArtist}`}
          songs={data?.results}
          isLoading={isLoading}
          error={error}
          // 🎯 NEW: go to Song Page instead of only playing
          onPlay={(song) => {
            const firstArtist = song.artists.split(';')[0]

            navigate(
              `/song?q=${encodeURIComponent(song.track_name)}&artist=${encodeURIComponent(firstArtist)}`
            )
          }}
        />
      )}
    </div>
  )
}

export default Artist