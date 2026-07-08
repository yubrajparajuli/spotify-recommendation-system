import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  getPlaylists,
  createPlaylist,
  addSongToPlaylist,
  deletePlaylist,
  deleteSongFromPlaylist
} from '../api/playlists'

export function usePlaylists() {
  return useQuery({
    queryKey: ['playlists'],
    queryFn: getPlaylists
  })
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries([
        'playlists'
      ])
    }
  })
}

export function useAddSong() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:
      ({ playlistId, song }) =>
        addSongToPlaylist(
          playlistId,
          song
        ),

    onSuccess: () => {
      queryClient.invalidateQueries([
        'playlists'
      ])
    }
  })
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePlaylist,

    onSuccess: () => {
      queryClient.invalidateQueries([
        'playlists'
      ])
    }
  })
}

export function useDeleteSong() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:
      ({
        playlistId,
        songId
      }) =>
        deleteSongFromPlaylist(
          playlistId,
          songId
        ),

    onSuccess: () => {
      queryClient.invalidateQueries([
        'playlists'
      ])
    }
  })
}