import { useQuery } from '@tanstack/react-query'
import { useOutletContext, useNavigate } from 'react-router-dom'
import SectionRow from '../components/SectionRow'
import {
  getPopularityRecommendations,
  getMoodRecommendations,
  getGenreRecommendations,
} from '../api/recommendations'

function Home() {
  const { playSong } = useOutletContext()
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const moods = user.preferred_moods?.length
    ? user.preferred_moods
    : ['happy']

  const genres = user.preferred_genres?.length
    ? user.preferred_genres
    : ['pop']

  const popular = useQuery({
    queryKey: ['popularity'],
    queryFn: () => getPopularityRecommendations({ n: 10 }),
  })

  const moodQuery = useQuery({
    queryKey: ['mood', moods[0]],
    queryFn: () => getMoodRecommendations({
      mood: moods[0],
      n: 10
    }),
  })

  const genre1 = useQuery({
    queryKey: ['genre', genres[0]],
    queryFn: () => getGenreRecommendations({
      genre: genres[0],
      n: 10
    }),
  })

  const genre2 = useQuery({
    queryKey: ['genre', genres[1] || genres[0]],
    queryFn: () =>
      getGenreRecommendations({
        genre: genres[1] || genres[0],
        n: 10
      }),
  })

  const handleSongClick = (song) => {
    if (!song) return

    const firstArtist = song.artists
      ? song.artists.split(';')[0]
      : ''

    navigate(
      `/song?q=${encodeURIComponent(song.track_name)}&artist=${encodeURIComponent(firstArtist)}`,
      {
        state: {
          song
        }
      }
    )
  }

  return (
    <div className="pt-6">
      <h1 className="text-white text-2xl font-bold mb-6">
        Good evening
      </h1>

      <SectionRow
        title="Popular right now"
        songs={popular.data?.results}
        isLoading={popular.isLoading}
        error={popular.error}
        onPlay={handleSongClick}
      />

      <SectionRow
        title={`Because you like ${moods[0]}`}
        songs={moodQuery.data?.results}
        isLoading={moodQuery.isLoading}
        error={moodQuery.error}
        onPlay={handleSongClick}
      />

      <SectionRow
        title={`Based on ${genres[0]}`}
        songs={genre1.data?.results}
        isLoading={genre1.isLoading}
        error={genre1.error}
        onPlay={handleSongClick}
      />

      <SectionRow
        title={`More ${genres[1] || genres[0]} songs`}
        songs={genre2.data?.results}
        isLoading={genre2.isLoading}
        error={genre2.error}
        onPlay={handleSongClick}
      />
    </div>
  )
}

export default Home