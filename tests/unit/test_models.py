import pandas as pd
import numpy as np
import pytest
from src.models.content_based import (
    recommend_similar_song, recommend_playlist,
    recommend_by_mood, recommend_by_genre
)
from src.models.popularity import recommend_by_popularity
from src.models.artist import recommend_by_artist, recommend_similar_artists
from src.utils.exceptions import (
    SongNotFoundException, InvalidMoodException,
    InvalidPlaylistException, InvalidArtistException
)
from sklearn.feature_extraction.text import TfidfVectorizer


FEATURES = ['danceability', 'energy', 'valence']


@pytest.fixture
def sample_df():
    np.random.seed(42)
    n = 30
    df = pd.DataFrame({
        'track_name': [f'Song {i}' for i in range(n)],
        'artists': [f'Artist {i % 5}' for i in range(n)],
        'track_genre': np.random.choice(['pop', 'rock', 'jazz'], n),
        'popularity': np.random.randint(10, 100, n),
        'danceability': np.random.rand(n),
        'energy': np.random.rand(n),
        'valence': np.random.rand(n),
        'mood': np.random.choice(['happy', 'sad', 'angry', 'calm'], n),
        'tfidf_input': ['pop happy fast mainstream'] * n,
    })
    df.loc[0, 'track_name'] = 'Shape of You'
    df.loc[0, 'artists'] = 'Ed Sheeran'
    df.loc[0, 'track_genre'] = 'pop'
    return df


@pytest.fixture
def scaled_df(sample_df):
    return sample_df[FEATURES].copy()


def test_recommend_similar_song(sample_df, scaled_df):
    result = recommend_similar_song('Shape of You', sample_df, FEATURES, scaled_df, n=5)
    assert result is not None
    assert len(result) <= 5
    assert 'similarity_score' in result.columns


def test_recommend_similar_song_not_found(sample_df, scaled_df):
    with pytest.raises(SongNotFoundException):
        recommend_similar_song('Nonexistent Song', sample_df, FEATURES, scaled_df)


def test_recommend_playlist(sample_df, scaled_df):
    playlist = ['Shape of You', 'Song 1', 'Song 2']
    result = recommend_playlist(playlist, sample_df, FEATURES, scaled_df, n=5)
    assert result is not None
    assert 'distance' in result.columns


def test_recommend_playlist_empty(sample_df, scaled_df):
    with pytest.raises(InvalidPlaylistException):
        recommend_playlist(['Nonexistent 1', 'Nonexistent 2'], sample_df, FEATURES, scaled_df)


def test_recommend_by_mood(sample_df, scaled_df):
    result = recommend_by_mood('happy', sample_df, scaled_df, FEATURES, n=5)
    assert result is not None
    assert 'combined_score' in result.columns


def test_recommend_by_mood_invalid(sample_df, scaled_df):
    with pytest.raises(InvalidMoodException):
        recommend_by_mood('excited', sample_df, scaled_df, FEATURES)


def test_recommend_by_genre(sample_df):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(sample_df['tfidf_input'])
    result = recommend_by_genre('pop', sample_df, tfidf_matrix, vectorizer, n=5)
    assert result is not None
    assert 'combined_score' in result.columns


def test_recommend_by_popularity(sample_df):
    result = recommend_by_popularity(sample_df, n=5)
    assert result is not None
    assert len(result) <= 5
    assert result['popularity'].is_monotonic_decreasing


def test_recommend_by_popularity_genre_filtered(sample_df):
    result = recommend_by_popularity(sample_df, genre='pop', n=5)
    assert result is not None
    assert result['track_genre'].str.contains('pop').all()


def test_recommend_by_artist(sample_df):
    result = recommend_by_artist('Ed Sheeran', sample_df, n=5)
    assert result is not None
    assert result['artists'].str.contains('Ed Sheeran').all()


def test_recommend_by_artist_not_found(sample_df):
    with pytest.raises(InvalidArtistException):
        recommend_by_artist('Nonexistent Artist', sample_df)


def test_recommend_similar_artists(sample_df, scaled_df):
    result = recommend_similar_artists('Ed Sheeran', sample_df, FEATURES, scaled_df, n=5)
    assert result is not None
    assert 'similarity' in result.columns