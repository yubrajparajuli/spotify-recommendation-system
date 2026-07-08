import pandas as pd
import numpy as np
import scipy.sparse as sp
from src.utils.logger import get_logger
from src.utils.config import AUDIO_FEATURES, FULL_FEATURES
from src.data.data_loader import (
    load_featured_dataset, load_full_standard, load_audio_standard,
    load_tfidf_model
)
from src.models.content_based import (
    recommend_similar_song, recommend_playlist,
    recommend_by_mood, recommend_by_genre
)
from src.models.popularity import recommend_by_popularity
from src.models.artist import recommend_by_artist, recommend_similar_artists
from src.models.search import search_songs

logger = get_logger(__name__)


class Recommender:
    """Main recommender that routes requests to the appropriate model"""

    def __init__(self):
        logger.info('Initializing Recommender')
        self.df = load_featured_dataset()
        self.df_full_standard = load_full_standard()
        self.df_audio_standard = load_audio_standard()
        self.tfidf_matrix, self.tfidf_vectorizer = load_tfidf_model()
        logger.info('Recommender initialized successfully')

    def similar_song(self, song_name: str, artist: str = None, n: int = 10) -> pd.DataFrame:
        return recommend_similar_song(
            song_name, self.df, FULL_FEATURES, self.df_full_standard, artist, n
        )

    def playlist(self, songs: list, n: int = 10) -> pd.DataFrame:
        return recommend_playlist(
            songs, self.df, FULL_FEATURES, self.df_full_standard, n
        )

    def mood(self, mood: str, n: int = 10) -> pd.DataFrame:
        return recommend_by_mood(
            mood, self.df, self.df_audio_standard, AUDIO_FEATURES, n
        )

    def genre(self, genre: str, n: int = 10) -> pd.DataFrame:
        return recommend_by_genre(
            genre, self.df, self.tfidf_matrix, self.tfidf_vectorizer, n
        )

    def popularity(self, genre: str = None, n: int = 10) -> pd.DataFrame:
        return recommend_by_popularity(self.df, genre, n)

    def artist(self, artist: str, n: int = 10) -> pd.DataFrame:
        return recommend_by_artist(artist, self.df, n)

    def similar_artists(self, artist: str, n: int = 10) -> pd.DataFrame:
        return recommend_similar_artists(
            artist, self.df, FULL_FEATURES, self.df_full_standard, n
        )

    def search(self, query: str, n: int = 10) -> pd.DataFrame:
        return search_songs(query, self.df, n)