import {
  createContext,
  useContext,
  useRef,
  useState
} from 'react'

const PlayerContext = createContext()

export function PlayerProvider({ children }) {
  const audioRef = useRef(
    new Audio()
  )

  const queueRef = useRef([])
  const indexRef = useRef(0)

  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const [showLoginModal, setShowLoginModal] = useState(false)

  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const [isExpanded, setIsExpanded] = useState(false)

  const fallbackAudio =
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

  const startAudio = (audio, url) => {
    audio.src = url
    audio.load()

    audio.play()
      .then(() => {
        setIsPlaying(true)
      })
      .catch(err => {
        // fallback
        if (url !== fallbackAudio) {
          audio.src = fallbackAudio
          audio.load()

          audio.play()
            .then(() => {
              setIsPlaying(true)
            })
            .catch(error => {
              setIsPlaying(false)
            })
        }
      })
  }

  const playSong = (
    song,
    playlist = [song],
    index = 0
  ) => {
    const token =
      localStorage.getItem("token")

    if (!token) {
      setShowLoginModal(true)
      return
    }

    const audio =
      audioRef.current

    queueRef.current = playlist
    indexRef.current = index

    setQueue(playlist)
    setCurrentIndex(index)

    audio.pause()

    const audioUrl =
      song?.audio_url ||
      song?.preview_url

    setCurrentSong(song)

    if (!audioUrl) {
      startAudio(
        audio,
        fallbackAudio
      )
    } else {
      startAudio(
        audio,
        audioUrl
      )
    }

    audio.onloadedmetadata = () => {
      setDuration(
        audio.duration || 0
      )
    }

    audio.ontimeupdate = () => {
      setProgress(
        audio.currentTime || 0
      )
    }

    audio.onended = () => {
      nextSong()
    }
  }

  const playPlaylist = (songs) => {
    if (
      !songs ||
      songs.length === 0
    )
      return

    playSong(
      songs[0],
      songs,
      0
    )
  }

  const nextSong = () => {
    const queue =
      queueRef.current

    const index =
      indexRef.current

    const next =
      index + 1

    if (
      next >= queue.length
    ) {
      setIsPlaying(false)
      setProgress(0)
      return
    }

    indexRef.current = next
    setCurrentIndex(next)

    playSong(
      queue[next],
      queue,
      next
    )
  }

  const previousSong = () => {
    const queue =
      queueRef.current

    const index =
      indexRef.current

    const previous =
      index - 1

    if (previous < 0)
      return

    indexRef.current = previous
    setCurrentIndex(previous)

    playSong(
      queue[previous],
      queue,
      previous
    )
  }

  const pauseSong = () => {
    audioRef.current.pause()
    setIsPlaying(false)
  }

  const togglePlay = () => {
    const audio =
      audioRef.current

    if (!audio.src)
      return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch(err => {
          console.error(
            "Resume failed:",
            err
          )
        })
    }
  }

  const seekTo = (time) => {
    const audio =
      audioRef.current

    audio.currentTime =
      time

    setProgress(time)
  }

  const expandPlayer = () => {
    setIsExpanded(true)
  }

  const minimizePlayer = () => {
    setIsExpanded(false)
  }

  const closePlayer = () => {
    const audio =
      audioRef.current

    audio.pause()
    audio.currentTime = 0

    audio.removeAttribute(
      "src"
    )

    audio.load()

    queueRef.current = []
    indexRef.current = 0

    setCurrentSong(null)
    setQueue([])
    setCurrentIndex(0)
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)
    setIsExpanded(false)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        showLoginModal,
        setShowLoginModal,
        queue,
        currentIndex,
        playSong,
        playPlaylist,
        nextSong,
        previousSong,
        pauseSong,
        togglePlay,
        isExpanded,
        expandPlayer,
        minimizePlayer,
        closePlayer,
        progress,
        duration,
        seekTo,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () =>
  useContext(PlayerContext)