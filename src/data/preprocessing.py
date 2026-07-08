import pandas as pd
import numpy as np
from src.utils.logger import get_logger

logger = get_logger(__name__)

def drop_unnecessary_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Drop Unnamed index column"""
    if 'Unnamed: 0' in df.columns:
        df.drop(columns=['Unnamed: 0'], inplace=True)
        logger.info('Dropped Unnamed column')
    return df

def drop_null_rows(df: pd.DataFrame) -> pd.DataFrame:
    """Drop rows with null values"""
    before = len(df)
    df.dropna(inplace=True)
    logger.info(f'Dropped {before - len(df)} null rows')
    return df

def drop_invalid_time_signature(df: pd.DataFrame) -> pd.DataFrame:
    """Drop rows with invalid time signature (0 or 1)"""
    before = len(df)
    df = df[df['time_signature'] >= 3]
    logger.info(f'Dropped {before - len(df)} invalid time signature rows')
    return df

def drop_invalid_tempo(df: pd.DataFrame) -> pd.DataFrame:
    """Drop rows with tempo = 0"""
    before = len(df)
    df = df[df['tempo'] != 0]
    logger.info(f'Dropped {before - len(df)} invalid tempo rows')
    return df

def drop_invalid_duration(df: pd.DataFrame) -> pd.DataFrame:
    """Drop rows with duration = 0"""
    before = len(df)
    df = df[df['duration_ms'] != 0]
    logger.info(f'Dropped {before - len(df)} invalid duration rows')
    return df

def drop_duration_outliers(df: pd.DataFrame) -> pd.DataFrame:
    """Drop songs shorter than 30s or longer than 10min"""
    before = len(df)
    df = df[(df['duration_ms'] >= 30000) & (df['duration_ms'] <= 600000)]
    logger.info(f'Dropped {before - len(df)} duration outlier rows')
    return df

def drop_tempo_outliers(df: pd.DataFrame) -> pd.DataFrame:
    """Drop songs with tempo outside 40-250 BPM"""
    before = len(df)
    df = df[(df['tempo'] >= 40) & (df['tempo'] <= 250)]
    logger.info(f'Dropped {before - len(df)} tempo outlier rows')
    return df

def drop_true_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Drop true duplicates (same track_id + same genre)"""
    before = len(df)
    df.drop_duplicates(subset=['track_id', 'track_genre'], keep='first', inplace=True)
    logger.info(f'Dropped {before - len(df)} true duplicate rows')
    return df

def merge_genres(df: pd.DataFrame) -> pd.DataFrame:
    """Merge genres for multi-genre songs"""
    genre_merged = df.groupby('track_id')['track_genre'].apply(
        lambda x: ', '.join(sorted(x.unique()))
    ).reset_index()
    genre_merged.columns = ['track_id', 'track_genre']
    df = df.drop(columns=['track_genre']).drop_duplicates(
        subset=['track_id']
    ).merge(genre_merged, on='track_id')
    logger.info(f'Merged genres, shape: {df.shape}')
    return df

def encode_explicit(df: pd.DataFrame) -> pd.DataFrame:
    """Encode explicit column to 0/1"""
    df['explicit'] = df['explicit'].astype(int)
    logger.info('Encoded explicit column')
    return df

def strip_whitespace(df: pd.DataFrame) -> pd.DataFrame:
    """Strip whitespace from text columns"""
    text_cols = ['track_name', 'artists', 'album_name', 'track_genre']
    for col in text_cols:
        if col in df.columns:
            df[col] = df[col].str.strip()
    logger.info('Stripped whitespace from text columns')
    return df

def normalize_quotes(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize curly quotes to straight quotes"""
    replacements = {
        '\u2018': "'", '\u2019': "'",
        '\u201c': '"', '\u201d': '"',
    }
    text_cols = ['track_name', 'artists', 'album_name']
    for col in text_cols:
        if col in df.columns:
            for old, new in replacements.items():
                df[col] = df[col].str.replace(old, new, regex=False)
    logger.info('Normalized quotes')
    return df

def drop_weak_features(df: pd.DataFrame) -> pd.DataFrame:
    """Drop weak features identified in EDA"""
    cols_to_drop = ['key', 'time_signature', 'loudness']
    cols_to_drop = [c for c in cols_to_drop if c in df.columns]
    df.drop(columns=cols_to_drop, inplace=True)
    logger.info(f'Dropped weak features: {cols_to_drop}')
    return df

def run_cleaning_pipeline(df: pd.DataFrame) -> pd.DataFrame:
    """Run full cleaning pipeline"""
    logger.info('Starting cleaning pipeline')
    df = drop_unnecessary_columns(df)
    df = drop_null_rows(df)
    df = drop_invalid_time_signature(df)
    df = drop_invalid_tempo(df)
    df = drop_invalid_duration(df)
    df = drop_duration_outliers(df)
    df = drop_tempo_outliers(df)
    df = drop_true_duplicates(df)
    df = merge_genres(df)
    df = encode_explicit(df)
    df = strip_whitespace(df)
    df = normalize_quotes(df)
    logger.info(f'Cleaning pipeline complete. Final shape: {df.shape}')
    return df