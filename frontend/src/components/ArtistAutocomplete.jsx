import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchArtists } from '../api/recommendations'

function ArtistAutocomplete({ value, onChange, onSelect, placeholder }) {
  const [open, setOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ['artist-search', value],
    queryFn: () => searchArtists({ query: value, n: 8 }),
    enabled: value.length > 1,
  })

  const results = data?.results || []

  return (
    <div className="relative w-full">

      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        placeholder={placeholder}
        className="w-full bg-spotify-elevated text-white text-sm rounded-md px-4 py-2.5 border border-spotify-border focus:border-white outline-none"
      />

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-spotify-elevated border border-spotify-border rounded-md max-h-60 overflow-auto">

          {results.map((artist, i) => (
            <div
              key={i}
              onClick={() => {
                onSelect(artist.artist)
                setOpen(false)
              }}
              className="px-4 py-2 text-sm text-white hover:bg-spotify-hover cursor-pointer"
            >
              {artist.artist}
            </div>
          ))}

        </div>
      )}
    </div>
  )
}

export default ArtistAutocomplete