import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useOutletContext, useNavigate } from 'react-router-dom'

import SectionRow from '../components/SectionRow'
import { getMoodRecommendations } from '../api/recommendations'

const moods = [
  { id: 'happy', label: 'Happy', color: 'from-yellow-500 to-yellow-700' },
  { id: 'angry', label: 'Angry', color: 'from-red-600 to-red-800' },
  { id: 'sad', label: 'Sad', color: 'from-blue-600 to-blue-900' },
  { id: 'calm', label: 'Calm', color: 'from-green-600 to-green-800' },
]

function Mood() {
  const { playSong } = useOutletContext() // optional (kept for future)
  const navigate = useNavigate()

  const [selectedMood, setSelectedMood] = useState(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['mood', selectedMood],
    queryFn: () => getMoodRecommendations({ mood: selectedMood, n: 15 }),
    enabled: !!selectedMood,
  })

  return (
    <div className="pt-6">
      <h1 className="text-white text-2xl font-bold mb-6">
        What's your mood?
      </h1>

      {/* MOOD GRID */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood.id)}
            className={`h-32 rounded-lg bg-gradient-to-br ${mood.color} flex items-end p-4 transition-transform hover:scale-105 ${
              selectedMood === mood.id ? 'ring-2 ring-white' : ''
            }`}
          >
            <span className="text-white text-xl font-bold">
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      {/* SONGS */}
      {selectedMood && (
        <SectionRow
          title={`${moods.find((m) => m.id === selectedMood).label} songs`}
          songs={data?.results}
          isLoading={isLoading}
          error={error}
          // 🎯 NEW: go to Song Page
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

export default Mood