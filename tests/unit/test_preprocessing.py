import pandas as pd
import numpy as np
import pytest
from src.data.preprocessing import (
    drop_unnecessary_columns, drop_null_rows,
    drop_invalid_time_signature, drop_invalid_tempo,
    drop_invalid_duration, drop_duration_outliers,
    drop_tempo_outliers, drop_true_duplicates,
    merge_genres, encode_explicit, strip_whitespace,
    normalize_quotes, drop_weak_features
)


@pytest.fixture
def raw_df():
    return pd.DataFrame({
        'Unnamed: 0': [0, 1, 2, 3],
        'track_id': ['id1', 'id1', 'id2', 'id3'],
        'artists': [' Artist A ', 'Artist B', 'Artist C', None],
        'album_name': ['Album A', 'Album B', 'Album C', 'Album D'],
        'track_name': ["Can\u2019t Stop", 'Song B', 'Song C', 'Song D'],
        'popularity': [50, 80, 90, 30],
        'duration_ms': [200000, 0, 700000, 20000],
        'explicit': [True, False, True, False],
        'danceability': [0.5, 0.6, 0.7, 0.8],
        'energy': [0.5, 0.6, 0.7, 0.8],
        'key': [1, 2, 3, 4],
        'loudness': [-5.0, -6.0, -7.0, -8.0],
        'mode': [1, 0, 1, 0],
        'speechiness': [0.1, 0.1, 0.1, 0.1],
        'acousticness': [0.1, 0.1, 0.1, 0.1],
        'instrumentalness': [0.0, 0.0, 0.0, 0.0],
        'liveness': [0.1, 0.1, 0.1, 0.1],
        'valence': [0.5, 0.5, 0.5, 0.5],
        'tempo': [120, 0, 260, 100],
        'time_signature': [4, 1, 4, 4],
        'track_genre': ['pop', 'pop', 'rock', 'jazz'],
    })


def test_drop_unnecessary_columns(raw_df):
    result = drop_unnecessary_columns(raw_df.copy())
    assert 'Unnamed: 0' not in result.columns


def test_drop_null_rows(raw_df):
    result = drop_null_rows(raw_df.copy())
    assert result.isnull().sum().sum() == 0
    assert len(result) == 3


def test_drop_invalid_time_signature(raw_df):
    result = drop_invalid_time_signature(raw_df.copy())
    assert (result['time_signature'] >= 3).all()


def test_drop_invalid_tempo(raw_df):
    result = drop_invalid_tempo(raw_df.copy())
    assert (result['tempo'] != 0).all()


def test_drop_invalid_duration(raw_df):
    result = drop_invalid_duration(raw_df.copy())
    assert (result['duration_ms'] != 0).all()


def test_drop_duration_outliers(raw_df):
    result = drop_duration_outliers(raw_df.copy())
    assert (result['duration_ms'] >= 30000).all()
    assert (result['duration_ms'] <= 600000).all()


def test_drop_tempo_outliers(raw_df):
    result = drop_tempo_outliers(raw_df.copy())
    assert (result['tempo'] >= 40).all()
    assert (result['tempo'] <= 250).all()


def test_drop_true_duplicates():
    df = pd.DataFrame({
        'track_id': ['id1', 'id1', 'id2'],
        'track_genre': ['pop', 'pop', 'rock']
    })
    result = drop_true_duplicates(df)
    assert len(result) == 2


def test_merge_genres():
    df = pd.DataFrame({
        'track_id': ['id1', 'id1', 'id2'],
        'track_name': ['Song A', 'Song A', 'Song B'],
        'track_genre': ['pop', 'rock', 'jazz']
    })
    result = merge_genres(df)
    assert len(result) == 2
    merged_row = result[result['track_id'] == 'id1']
    assert merged_row['track_genre'].iloc[0] == 'pop, rock'


def test_encode_explicit(raw_df):
    result = encode_explicit(raw_df.copy())
    assert result['explicit'].dtype == int
    assert set(result['explicit'].unique()).issubset({0, 1})


def test_strip_whitespace(raw_df):
    df = raw_df.dropna(subset=['artists']).copy()
    result = strip_whitespace(df)
    assert result['artists'].iloc[0] == 'Artist A'


def test_normalize_quotes(raw_df):
    result = normalize_quotes(raw_df.copy())
    assert "\u2019" not in result['track_name'].iloc[0]
    assert "'" in result['track_name'].iloc[0]


def test_drop_weak_features(raw_df):
    result = drop_weak_features(raw_df.copy())
    assert 'key' not in result.columns
    assert 'time_signature' not in result.columns
    assert 'loudness' not in result.columns