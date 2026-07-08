import { post } from './client'

export function getSimilarSongs({ songName, artist, n = 10 }) {
  return post('/recommend/similar-song', { song_name: songName, artist, n })
}

export function getPlaylistRecommendations({ songs, n = 10 }) {
  return post('/recommend/playlist', { songs, n })
}

export function getMoodRecommendations({ mood, n = 10 }) {
  return post('/recommend/mood', { mood, n })
}

export function getGenreRecommendations({ genre, n = 10 }) {
  return post('/recommend/genre', { genre, n })
}

export function getPopularityRecommendations({ genre, n = 10 }) {
  return post('/recommend/popularity', { genre, n })
}

export function getArtistRecommendations({ artist, n = 10 }) {
  return post('/recommend/artist', { artist, n })
}

export function searchSongs({ query, n = 10 }) {
  return post('/recommend/search-songs', { query, n })
}

export function searchArtists({ query, n = 10 }) {
  return post('/recommend/search-artists', { query, n })
}