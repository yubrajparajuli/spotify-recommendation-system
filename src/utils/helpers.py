import pandas as pd
import numpy as np
from typing import Optional
from src.utils.logger import get_logger

logger = get_logger(__name__)

def find_song(song_name: str, df: pd.DataFrame, artist: Optional[str] = None) -> Optional[int]:
    """Find most popular version of a song in dataset"""
    matches = df[df['track_name'].str.lower() == song_name.lower()]
    
    if artist:
        matches = matches[matches['artists'].str.lower().str.contains(artist.lower())]
    
    if matches.empty:
        logger.warning(f'Song "{song_name}" not found')
        return None
    
    return matches['popularity'].idxmax()


def get_song_genres(idx: int, df: pd.DataFrame) -> set:
    """Get set of genres for a song"""
    return set(df.loc[idx, 'track_genre'].split(', '))


def filter_by_genre(genre: str, df: pd.DataFrame) -> pd.DataFrame:
    """Filter dataframe by genre"""
    return df[df['track_genre'].str.contains(genre, case=False)]


def filter_by_common_genre(genres: set, df: pd.DataFrame) -> pd.DataFrame:
    """Filter dataframe by any matching genre"""
    def has_common_genre(genre_str):
        return bool(set(genre_str.split(', ')) & genres)
    return df[df['track_genre'].apply(has_common_genre)]


def deduplicate_by_name(results: pd.DataFrame) -> pd.DataFrame:
    """Remove duplicate track names"""
    return results.drop_duplicates(subset=['track_name'])


def normalize_popularity(df: pd.DataFrame) -> pd.Series:
    """Normalize popularity to 0-1 range"""
    return df['popularity'] / 100


def combined_score(similarity: np.ndarray, popularity: np.ndarray,
                   sim_weight: float = 0.6, pop_weight: float = 0.4) -> np.ndarray:
    """Combine similarity and popularity scores"""
    return sim_weight * similarity + pop_weight * (popularity / 100)