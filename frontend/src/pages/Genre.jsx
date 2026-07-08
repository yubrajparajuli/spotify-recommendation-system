import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useOutletContext, useNavigate } from 'react-router-dom'

import SectionRow from '../components/SectionRow'
import { getGenreRecommendations } from '../api/recommendations'

const genres = [
  { id: 'pop', label: 'Pop', color: '#8C1932' },
  { id: 'rock', label: 'Rock', color: '#E8115B' },
  { id: 'hip-hop', label: 'Hip-Hop', color: '#BC5900' },
  { id: 'jazz', label: 'Jazz', color: '#8D67AB' },
  { id: 'classical', label: 'Classical', color: '#1E3264' },
  { id: 'edm', label: 'EDM', color: '#148A08' },
  { id: 'country', label: 'Country', color: '#E1118C' },
  { id: 'k-pop', label: 'K-Pop', color: '#777777' },
]

function GenreTile({ genre, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: genre.color }}
      className={`relative h-32 rounded-lg p-4 overflow-hidden text-left transition-transform hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-white' : ''
      }`}
    >
      <span className="text-white text-xl font-bold relative z-10">
        {genre.label}
      </span>

      <div
        className="absolute -right-3 -bottom-4 w-20 h-20 rounded-md rotate-[25deg] shadow-xl"
        style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
      />
    </button>
  )
}

function Genre() {
  const { playSong } = useOutletContext() // still kept (optional future use)
  const navigate = useNavigate()

  const [selectedGenre, setSelectedGenre] = useState(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['genre', selectedGenre],
    queryFn: () => getGenreRecommendations({ genre: selectedGenre, n: 15 }),
    enabled: !!selectedGenre,
  })

  return (
    <div className="pt-6">
      <h1 className="text-white text-2xl font-bold mb-6">
        Browse Genres
      </h1>

      {/* GENRE GRID */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {genres.map((genre) => (
          <GenreTile
            key={genre.id}
            genre={genre}
            isSelected={selectedGenre === genre.id}
            onClick={() => setSelectedGenre(genre.id)}
          />
        ))}
      </div>

      {/* SONGS */}
      {selectedGenre && (
        <SectionRow
          title={`${genres.find((g) => g.id === selectedGenre).label} essentials`}
          songs={data?.results}
          isLoading={isLoading}
          error={error}
          // 🎯 NEW: redirect to Song Page
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

export default Genre