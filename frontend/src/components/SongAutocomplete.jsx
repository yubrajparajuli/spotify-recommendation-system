import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'

import { searchSongs } from '../api/recommendations'

function SongAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Search a song...'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const { data, isLoading } = useQuery({
    queryKey: ['search-songs', value],
    queryFn: () => searchSongs({ query: value, n: 8 }),
    enabled: value.trim().length >= 2
  })

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleChange = (newValue) => {
    onChange(newValue)
    setIsOpen(newValue.trim().length >= 2)
  }

  const handleSelect = (song) => {
    onSelect(song)
    setIsOpen(false)
  }

  const showDropdown = isOpen && value.trim().length >= 2

  return (
    <div ref={containerRef} className="relative flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => value.trim().length >= 2 && setIsOpen(true)}
        placeholder={placeholder}
        className="w-full bg-spotify-hover text-white text-sm rounded-lg px-4 py-3 outline-none placeholder:text-spotify-text-secondary border border-spotify-border focus:border-spotify-green transition"
      />

      {showDropdown && (
        <div className="absolute z-30 mt-2 w-full bg-spotify-elevated border border-spotify-border rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
          {isLoading && (
            <p className="px-5 py-4 text-sm text-spotify-text-secondary">
              Searching songs...
            </p>
          )}

          {!isLoading && data?.results?.length === 0 && (
            <p className="px-5 py-4 text-sm text-spotify-text-secondary">
              No songs found
            </p>
          )}

          {!isLoading &&
            data?.results?.map((song, index) => (
              <button
                key={index}
                onClick={() => handleSelect(song)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-spotify-hover transition"
              >
                <img
                  src={
                    song.cover_url ||
                    "https://placehold.co/50x50/222/fff?text=♪"
                  }
                  alt={song.track_name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />

                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    {song.track_name}
                  </p>
                  <p className="text-spotify-text-secondary text-xs truncate mt-1">
                    {song.artists}
                  </p>
                  {song.track_genre && (
                    <p className="text-zinc-500 text-xs truncate">
                      {song.track_genre}
                    </p>
                  )}
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export default SongAutocomplete