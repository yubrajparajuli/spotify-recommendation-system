import pandas as pd
from src.utils.logger import get_logger

logger = get_logger(__name__)


def recommend_by_popularity(df: pd.DataFrame, genre: str = None, n: int = 10) -> pd.DataFrame:
    """Simple popularity based recommendation, optionally filtered by genre"""
    if genre:
        df_filtered = df[df['track_genre'].str.contains(genre, case=False)]
    else:
        df_filtered = df

    df_filtered = df_filtered.drop_duplicates(subset=['track_name'])

    results = df_filtered.nlargest(n, 'popularity')[
        ['track_name', 'artists', 'track_genre', 'popularity']
    ].copy()
    results = results.reset_index(drop=True)
    results.index += 1

    logger.info(f'Popularity: {len(results)} recommendations (genre={genre})')
    return results