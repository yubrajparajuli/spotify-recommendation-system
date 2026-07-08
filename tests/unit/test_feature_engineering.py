import pandas as pd
import numpy as np
import pytest
from src.data.feature_engineering import (
    convert_duration_to_minutes, create_mood_categories, encode_mood,
    create_tempo_categories, create_popularity_tiers,
    create_combined_features, create_artist_count, create_genre_count,
    create_tfidf_input
)


@pytest.fixture
def sample_df():
    return pd.DataFrame({
        'duration_ms': [180000, 300000],
        'valence': [0.8, 0.2],
        'energy': [0.9, 0.1],
        'tempo': [80, 150],
        'popularity': [20, 90],
        'danceability': [0.6, 0.4],
        'instrumentalness': [0.0, 0.5],
        'acousticness': [0.1, 0.9],
        'artists': ['Artist A;Artist B', 'Artist C'],
        'track_genre': ['pop, dance', 'rock'],
    })


def test_convert_duration_to_minutes(sample_df):
    result = convert_duration_to_minutes(sample_df.copy())
    assert 'duration_min' in result.columns
    assert 'duration_ms' not in result.columns
    assert result['duration_min'].iloc[0] == 3.0


def test_create_mood_categories_happy(sample_df):
    result = create_mood_categories(sample_df.copy(), threshold=0.5)
    assert result['mood'].iloc[0] == 'happy'


def test_create_mood_categories_sad(sample_df):
    result = create_mood_categories(sample_df.copy(), threshold=0.5)
    assert result['mood'].iloc[1] == 'sad'


def test_create_mood_categories_v2(sample_df):
    result = create_mood_categories(sample_df.copy(), threshold=0.4)
    assert 'mood_v2' in result.columns


def test_encode_mood(sample_df):
    df = create_mood_categories(sample_df.copy(), threshold=0.5)
    result = encode_mood(df)
    assert 'mood_encoded' in result.columns
    assert result['mood_encoded'].iloc[0] == 0  # happy


def test_create_tempo_categories(sample_df):
    result = create_tempo_categories(sample_df.copy())
    assert result['tempo_category'].iloc[0] == 'slow'
    assert result['tempo_category'].iloc[1] == 'fast'
    assert result['tempo_encoded'].iloc[0] == 0
    assert result['tempo_encoded'].iloc[1] == 2


def test_create_popularity_tiers(sample_df):
    result = create_popularity_tiers(sample_df.copy())
    assert result['popularity_tier'].iloc[0] == 'emerging'
    assert result['popularity_tier'].iloc[1] == 'charttoppers'


def test_create_combined_features(sample_df):
    result = create_combined_features(sample_df.copy())
    assert 'dance_energy_score' in result.columns
    assert 'positive_energy' in result.columns
    assert 'vocal_score' in result.columns
    assert 'energy_acousticness_ratio' in result.columns
    assert result['vocal_score'].iloc[0] == 1.0


def test_create_artist_count(sample_df):
    result = create_artist_count(sample_df.copy())
    assert result['artist_count'].iloc[0] == 2
    assert result['artist_count'].iloc[1] == 1


def test_create_genre_count(sample_df):
    result = create_genre_count(sample_df.copy())
    assert result['genre_count'].iloc[0] == 2
    assert result['genre_count'].iloc[1] == 1


def test_create_tfidf_input(sample_df):
    df = create_mood_categories(sample_df.copy(), threshold=0.5)
    df = create_tempo_categories(df)
    df = create_popularity_tiers(df)
    result = create_tfidf_input(df)
    assert 'tfidf_input' in result.columns
    assert 'pop' in result['tfidf_input'].iloc[0]
    assert 'dance' in result['tfidf_input'].iloc[0]