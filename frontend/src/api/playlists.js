import { get, post, del } from "./client"

export function getPlaylists() {
    return get("/playlists")
}

export function createPlaylist(name) {
    return post("/playlists", {
        name
    })
}

export function addSongToPlaylist(
    playlistId,
    song
) {
    return post(
        `/playlists/${playlistId}/songs`,
        {
            track_name: song.track_name,
            artists: song.artists,
            album: song.album || null,
            cover_url: song.cover_url || null,
            preview_url: song.preview_url || null,
            deezer_url: song.deezer_url || null,
            spotify_url: song.spotify_url || null
        }
    )
}

export function deleteSongFromPlaylist(
    playlistId,
    songId
) {
    return del(
        `/playlists/${playlistId}/songs/${songId}`
    )
}

export function deletePlaylist(
    playlistId
) {
    return del(
        `/playlists/${playlistId}`
    )
}