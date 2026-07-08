import { useDeletePlaylist } from "../hooks/usePlaylists"

function PlaylistSidebar({
    playlists,
    activePlaylist,
    setActivePlaylist,
    onCreate,
    onRequireLogin
}) {
    const deleteMutation = useDeletePlaylist()

    const handleDelete = (e, playlistId) => {
        e.stopPropagation()

        const confirmDelete = window.confirm(
            "Delete this playlist permanently?"
        )

        if (!confirmDelete)
            return

        deleteMutation.mutate(playlistId)

        if (activePlaylist?.id === playlistId) {
            setActivePlaylist(null)
        }
    }

    return (
        <div className="w-80 bg-spotify-elevated rounded-2xl p-6 h-fit">
            <h1 className="text-white text-2xl font-bold mb-6">
                Playlist
            </h1>

            <button
                onClick={() => {
                    const token = localStorage.getItem("token")
                    if (!token) {
                        onRequireLogin()
                        return
                    }
                    onCreate()
                }}
                className="w-full py-3 rounded-full bg-spotify-green text-black font-bold mb-6 hover:bg-spotify-green-hover transition"
            >
                + Create New Playlist
            </button>

            <div className="space-y-3">
                {playlists.map((playlist) => (
                    <div
                        key={playlist.id}
                        onClick={() => setActivePlaylist(playlist)}
                        className={`w-full p-4 rounded-xl transition cursor-pointer ${
                            activePlaylist?.id === playlist.id
                                ? "bg-white text-black"
                                : "bg-spotify-hover text-white hover:bg-zinc-700"
                        }`}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="font-semibold">
                                    {playlist.name}
                                </p>
                                <p className="text-xs opacity-70 mt-1">
                                    {playlist.songs.length} songs
                                </p>
                            </div>

                            <button
                                onClick={(e) => handleDelete(e, playlist.id)}
                                className="text-sm font-semibold text-zinc-400 hover:text-red-500 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {playlists.length === 0 && (
                    <p className="text-spotify-text-secondary text-sm">
                        No playlists yet
                    </p>
                )}
            </div>
        </div>
    )
}

export default PlaylistSidebar