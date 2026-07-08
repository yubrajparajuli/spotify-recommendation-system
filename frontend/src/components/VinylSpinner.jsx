import { useEffect, useState } from 'react'

function VinylSpinner({ isPlaying = false }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    let timer

    if (isPlaying) {
      timer = setTimeout(() => {
        setActive(true)
      }, 180)
    } else {
      setActive(false)
    }

    return () => clearTimeout(timer)
  }, [isPlaying])

  return (
    <div className="w-48 h-48 flex items-center justify-center">
      <div
        className={`w-48 h-48 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center transition-all duration-300 ${
          active ? 'animate-spin-slow' : ''
        }`}
        style={{
          backgroundImage:
            'repeating-radial-gradient(circle, #1a1a1a 0px, #1a1a1a 2px, #0d0d0d 2px, #0d0d0d 4px)',
        }}
      >
        <div className="w-1/3 h-1/3 rounded-full bg-spotify-green" />
      </div>
    </div>
  )
}

export default VinylSpinner