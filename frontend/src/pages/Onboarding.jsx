// 

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { put } from '../api/client'

const genres = [
  'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical',
  'EDM', 'Country', 'K-Pop', 'R&B', 'Metal',
  'Folk', 'Indie', 'Latin', 'Reggae', 'Blues'
]

const moods = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'angry', label: 'Angry', emoji: '😤' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
]

function Onboarding() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedMoods, setSelectedMoods] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    )
  }

  const toggleMood = (mood) => {
    setSelectedMoods((prev) =>
      prev.includes(mood)
        ? prev.filter((m) => m !== mood)
        : [...prev, mood]
    )
  }

  const handleFinish = async () => {
    setLoading(true)
    setError(null)

    try {
      await put('/auth/onboarding', {
        preferred_genres: selectedGenres,
        preferred_moods: selectedMoods,
      })

      // optional local update
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...user,
          onboarding_complete: true,
          preferred_genres: selectedGenres,
          preferred_moods: selectedMoods,
        })
      )

      navigate('/')

    } catch (err) {
      setError(err.message || 'Failed to save onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-spotify-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-lg">

        {/* ERROR */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500 text-red-400 p-2 rounded">
            {error}
          </div>
        )}

        {/* progress bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-spotify-green' : 'bg-spotify-elevated'
              }`}
            />
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h1 className="text-white text-2xl font-bold mb-2">
              What kind of music do you like?
            </h1>
            <p className="text-spotify-text-secondary text-sm mb-6">
              Pick at least 3 genres to get started.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors
                    ${selectedGenres.includes(genre)
                      ? 'bg-spotify-green text-black border-spotify-green'
                      : 'bg-transparent text-white border-spotify-border hover:border-white'
                    }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={selectedGenres.length < 3}
              className="w-full bg-spotify-green text-black font-bold py-3 rounded-full
                disabled:opacity-40"
            >
              Next
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h1 className="text-white text-2xl font-bold mb-2">
              What's your vibe?
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => toggleMood(mood.id)}
                  className={`h-24 rounded-lg flex flex-col items-center justify-center gap-2 border-2 transition-colors
                    ${selectedMoods.includes(mood.id)
                      ? 'border-spotify-green bg-spotify-green/10'
                      : 'border-spotify-border bg-spotify-elevated'
                    }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-white">{mood.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-spotify-border text-white py-3 rounded-full"
              >
                Back
              </button>

              <button
                onClick={handleFinish}
                disabled={selectedMoods.length === 0 || loading}
                className="flex-1 bg-spotify-green text-black font-bold py-3 rounded-full disabled:opacity-40"
              >
                {loading ? 'Saving...' : "Let's Go!"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default Onboarding