import { useState, useEffect } from "react"

import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"

import {
  getPlaylists,
  createPlaylist,
  addSongToPlaylist,
  deleteSongFromPlaylist
} from "../api/playlists"

import PlaylistSidebar from "../components/PlaylistSidebar"
import PlaylistSongList from "../components/PlaylistSongList"
import CreatePlaylistModal from "../components/CreatePlaylistModal"
import SongAutocomplete from "../components/SongAutocomplete"
import SectionRow from "../components/SectionRow"

import {
  getPlaylistRecommendations
} from "../api/recommendations"

import { usePlayer } from "../context/PlayerContext"

function Playlist() {
  const queryClient = useQueryClient()

  const {
    playSong,
    setShowLoginModal
  } = usePlayer()

  const [activePlaylist, setActivePlaylist] = useState(null)
  const [openCreate, setOpenCreate] = useState(false)
  const [songInput, setSongInput] = useState("")
  const [recommend, setRecommend] = useState(false)

  const {
    data: playlists = []
  } = useQuery({
    queryKey: ["playlists"],
    queryFn: getPlaylists
  })

  useEffect(() => {
    if (!activePlaylist) return

    const updated =
      playlists.find(
        p => p.id === activePlaylist.id
      )

    if (updated) {
      setActivePlaylist(updated)
    }
  }, [playlists])

  const createMutation = useMutation({
    mutationFn: createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playlists"]
      })
    }
  })

  const addMutation = useMutation({
    mutationFn: ({ id, song }) =>
      addSongToPlaylist(id, song),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playlists"]
      })
      setSongInput("")
    }
  })

  const removeMutation = useMutation({
    mutationFn: ({ id, songId }) =>
      deleteSongFromPlaylist(
        id,
        songId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playlists"]
      })
    }
  })

  const {
    data: recommendations
  } = useQuery({
    queryKey: [
      "playlist-recommendation",
      activePlaylist?.id
    ],
    queryFn: () =>
      getPlaylistRecommendations({
        songs:
          activePlaylist.songs.map(
            s => s.track_name
          ),
        n: 15
      }),
    enabled:
      recommend &&
      !!activePlaylist
  })

  const playPlaylistSong = (
    song,
    index
  ) => {
    playSong(
      song,
      activePlaylist.songs,
      index
    )
  }

  return (
    <div className="
      pt-6
      grid
      grid-cols-[320px_1fr]
      gap-8
      min-w-0
    ">
      <PlaylistSidebar
        playlists={playlists}
        activePlaylist={activePlaylist}
        setActivePlaylist={(playlist)=>{
          setActivePlaylist(playlist)
          setRecommend(false)
        }}
        onCreate={() =>
          setOpenCreate(true)
        }
        onRequireLogin={() =>
          setShowLoginModal(true)
        }
      />

      <div className="min-w-0">
        <PlaylistSongList
          playlist={activePlaylist}
          onPlay={playPlaylistSong}
          onRemove={(id, songId)=>
            removeMutation.mutate({
              id,
              songId
            })
          }
        />

        {
          activePlaylist &&
          <>
            {/* ADD SONG */}
            <div className="
              mt-10
              bg-spotify-elevated
              rounded-2xl
              p-6
            ">
              <h2 className="
                text-white
                font-bold
                text-xl
                mb-5
              ">
                Add Music
              </h2>

              <SongAutocomplete
                value={songInput}
                onChange={setSongInput}
                onSelect={(song)=>{
                  addMutation.mutate({
                    id: activePlaylist.id,
                    song: {
                      ...song,
                      preview_url: song.preview_url || song.audio_url || null
                    }
                  })
                }}
              />
            </div>

            {/* RECOMMEND BUTTON */}
            <button
              onClick={()=>setRecommend(true)}
              className="
                mt-14
                mb-20
                w-full
                py-4
                rounded-full
                bg-spotify-green
                text-black
                font-bold
                text-lg
                hover:bg-spotify-green-hover
                hover:scale-[1.02]
                transition
              "
            >
              Generate Recommendations ✨
            </button>
          </>
        }

        {
          recommend &&
          <SectionRow
            title="Recommended Songs"
            songs={
              recommendations?.results
            }
            onPlay={(song)=>{
              const index =
                recommendations.results.findIndex(
                  item =>
                    item.track_name === song.track_name
                )

              playSong(
                song,
                recommendations.results,
                index
              )
            }}
          />
        }
      </div>

      <CreatePlaylistModal
        open={openCreate}
        onClose={() =>
          setOpenCreate(false)
        }
        onCreate={(name)=>{
          createMutation.mutate(name)
          setOpenCreate(false)
        }}
      />
    </div>
  )
}

export default Playlist