import pandas as pd
import numpy as np
import pytest
from src.utils.helpers import (
    find_song, get_song_genres, filter_by_genre,
    filter_by_common_genre, deduplicate_by_name,
    normalize_popularity, combined_score
)


@pytest.fixture
def sample_df():
    return pd.DataFrame({
        'track_name': ['Song A', 'Song B', 'Song A', 'Song C'],
        'artists': ['Artist X', 'Artist Y', 'Artist Z', 'Artist X'],
        'track_genre': ['pop, dance', 'rock', 'pop', 'jazz, pop'],
        'popularity': [50, 80, 90, 30]
    })


def test_find_song_found(sample_df):
    idx = find_song('Song A', sample_df)
    assert idx == 2  # most popular version (90)


def test_find_song_with_artist(sample_df):
    idx = find_song('Song A', sample_df, artist='Artist X')
    assert idx == 0


def test_find_song_not_found(sample_df):
    idx = find_song('Nonexistent', sample_df)
    assert idx is None


def test_get_song_genres(sample_df):
    genres = get_song_genres(0, sample_df)
    assert genres == {'pop', 'dance'}


def test_filter_by_genre(sample_df):
    result = filter_by_genre('pop', sample_df)
    assert len(result) == 3


def test_filter_by_common_genre(sample_df):
    result = filter_by_common_genre({'pop'}, sample_df)
    assert len(result) == 3


def test_deduplicate_by_name(sample_df):
    result = deduplicate_by_name(sample_df)
    assert len(result) == 3
    assert result['track_name'].nunique() == 3


def test_normalize_popularity(sample_df):
    result = normalize_popularity(sample_df)
    assert result.iloc[0] == 0.5
    assert result.iloc[1] == 0.8


def test_combined_score():
    similarity = np.array([0.8, 0.5])
    popularity = np.array([100, 50])
    result = combined_score(similarity, popularity, sim_weight=0.6, pop_weight=0.4)
    expected = np.array([0.6 * 0.8 + 0.4 * 1.0, 0.6 * 0.5 + 0.4 * 0.5])
    np.testing.assert_array_almost_equal(result, expected)