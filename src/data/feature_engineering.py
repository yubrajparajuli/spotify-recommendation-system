import pandas as pd
import numpy as np
from src.utils.logger import get_logger

logger = get_logger(__name__)

def convert_duration_to_minutes(df: pd.DataFrame) -> pd.DataFrame:
    """Convert duration_ms to duration_min"""
    df['duration_min'] = (df['duration_ms'] / 60000).round(2)
    df.drop(columns=['duration_ms'], inplace=True)
    logger.info('Converted duration to minutes')
    return df

def create_mood_categories(df: pd.DataFrame, threshold: float = 0.5) -> pd.DataFrame:
    """Create mood category based on valence and energy"""
    def get_mood(row):
        if row['valence'] >= threshold and row['energy'] >= threshold:
            return 'happy'
        elif row['valence'] < threshold and row['energy'] >= threshold:
            return 'angry'
        elif row['valence'] >= threshold and row['energy'] < threshold:
            return 'calm'
        else:
            return 'sad'

    col_name = 'mood' if threshold == 0.5 else 'mood_v2'
    df[col_name] = df.apply(get_mood, axis=1)
    logger.info(f'Created {col_name} with threshold {threshold}')
    return df

def encode_mood(df: pd.DataFrame) -> pd.DataFrame:
    """Encode mood categories to numbers"""
    mood_map = {'happy': 0, 'angry': 1, 'sad': 2, 'calm': 3}
    df['mood_encoded'] = df['mood'].map(mood_map)
    if 'mood_v2' in df.columns:
        df['mood_v2_encoded'] = df['mood_v2'].map(mood_map)
    logger.info('Encoded mood categories')
    return df

def create_tempo_categories(df: pd.DataFrame) -> pd.DataFrame:
    """Create tempo category"""
    def get_tempo_category(tempo):
        if tempo < 90:
            return 'slow'
        elif tempo <= 140:
            return 'medium'
        else:
            return 'fast'

    df['tempo_category'] = df['tempo'].apply(get_tempo_category)
    tempo_map = {'slow': 0, 'medium': 1, 'fast': 2}
    df['tempo_encoded'] = df['tempo_category'].map(tempo_map)
    logger.info('Created tempo categories')
    return df

def create_popularity_tiers(df: pd.DataFrame) -> pd.DataFrame:
    """Create popularity tier"""
    def get_popularity_tier(popularity):
        if popularity <= 25:
            return 'emerging'
        elif popularity <= 50:
            return 'upcoming'
        elif popularity <= 75:
            return 'mainstream'
        else:
            return 'charttoppers'

    df['popularity_tier'] = df['popularity'].apply(get_popularity_tier)
    popularity_map = {'emerging': 0, 'upcoming': 1, 'mainstream': 2, 'charttoppers': 3}
    df['popularity_tier_encoded'] = df['popularity_tier'].map(popularity_map)
    logger.info('Created popularity tiers')
    return df

def create_combined_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create combined engineered features"""
    df['dance_energy_score'] = df['danceability'] * df['energy']
    df['positive_energy'] = df['valence'] * df['energy']
    df['vocal_score'] = 1 - df['instrumentalness']
    df['energy_acousticness_ratio'] = np.log1p(df['energy']) - np.log1p(df['acousticness'])
    logger.info('Created combined features')
    return df

def create_artist_count(df: pd.DataFrame) -> pd.DataFrame:
    """Count number of artists per song"""
    df['artist_count'] = df['artists'].str.split(';').str.len()
    logger.info('Created artist count feature')
    return df

def create_genre_count(df: pd.DataFrame) -> pd.DataFrame:
    """Count number of genres per song"""
    df['genre_count'] = df['track_genre'].str.split(', ').str.len()
    logger.info('Created genre count feature')
    return df

def create_tfidf_input(df: pd.DataFrame) -> pd.DataFrame:
    """Create text input for TF-IDF model"""
    df['tfidf_input'] = (
        df['track_genre'].str.replace(', ', ' ') + ' ' +
        df['mood'] + ' ' +
        df['tempo_category'] + ' ' +
        df['popularity_tier']
    )
    logger.info('Created TF-IDF input text')
    return df

def run_feature_engineering_pipeline(df: pd.DataFrame) -> pd.DataFrame:
    """Run full feature engineering pipeline"""
    logger.info('Starting feature engineering pipeline')
    df = convert_duration_to_minutes(df)
    df = create_mood_categories(df, threshold=0.5)
    df = create_mood_categories(df, threshold=0.4)
    df = encode_mood(df)
    df = create_tempo_categories(df)
    df = create_popularity_tiers(df)
    df = create_combined_features(df)
    df = create_artist_count(df)
    df = create_genre_count(df)
    df = create_tfidf_input(df)
    logger.info(f'Feature engineering complete. Final shape: {df.shape}')
    return df