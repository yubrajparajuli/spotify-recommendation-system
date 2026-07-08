import pandas as pd
from src.utils.exceptions import (
    SongNotFoundException,
    InvalidMoodException,
    InvalidGenreException,
    InvalidPlaylistException,
    InvalidArtistException
)
from src.utils.config import VALID_MOODS

def validate_song_exists(song_name: str, df: pd.DataFrame, artist: str = None) -> int:
    """Validate song exists and return its index"""
    matches = df[df['track_name'].str.lower() == song_name.lower()]
    
    if artist:
        matches = matches[matches['artists'].str.lower().str.contains(artist.lower())]
    
    if matches.empty:
        raise SongNotFoundException(song_name)
    
    return matches['popularity'].idxmax()

def validate_mood(mood: str) -> str:
    """Validate mood is one of the valid moods"""
    mood = mood.lower()
    if mood not in VALID_MOODS:
        raise InvalidMoodException(mood, VALID_MOODS)
    return mood

def validate_genre(genre: str, df: pd.DataFrame) -> str:
    """Validate genre exists in dataset"""
    mask = df['track_genre'].str.contains(genre, case=False)
    if not mask.any():
        raise InvalidGenreException(genre)
    return genre.lower()

def validate_playlist(songs: list, df: pd.DataFrame) -> list:
    """Validate playlist has at least one valid song, return indices"""
    indices = []
    for song in songs:
        matches = df[df['track_name'].str.lower() == song.lower()]
        if not matches.empty:
            indices.append(matches['popularity'].idxmax())
    
    if not indices:
        raise InvalidPlaylistException()
    
    return indices

def validate_artist(artist: str, df: pd.DataFrame) -> str:
    """Validate artist exists in dataset"""
    mask = df['artists'].str.lower().str.contains(artist.lower())
    if not mask.any():
        raise InvalidArtistException(artist)
    return artist