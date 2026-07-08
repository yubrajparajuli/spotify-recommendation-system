import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from src.utils.logger import get_logger
from src.data.validators import validate_artist

logger = get_logger(__name__)


def recommend_by_artist(artist: str, df: pd.DataFrame, n: int = 10) -> pd.DataFrame:
    """Recommend top songs by a specific artist"""
    validate_artist(artist, df)

    mask = df['artists'].str.lower().str.contains(artist.lower())
    df_filtered = df[mask].drop_duplicates(subset=['track_name'])

    results = df_filtered.nlargest(n, 'popularity')[
        ['track_name', 'artists', 'track_genre', 'popularity']
    ].copy()
    results = results.reset_index(drop=True)
    results.index += 1

    logger.info(f'Artist: {len(results)} songs found for "{artist}"')
    return results


def recommend_similar_artists(artist: str, df: pd.DataFrame, features: list,
                               scaled_df: pd.DataFrame, n: int = 10) -> pd.DataFrame:
    """Find songs from artists similar to given artist based on average audio profile"""
    validate_artist(artist, df)

    mask = df['artists'].str.lower().str.contains(artist.lower())
    artist_indices = df[mask].index

    artist_profile = scaled_df.loc[artist_indices, features].mean().values.reshape(1, -1)

    other_mask = ~mask
    other_df = df[other_mask]
    other_scaled = scaled_df.loc[other_df.index]

    similarity = cosine_similarity(artist_profile, other_scaled[features].values)[0]
    other_df = other_df.copy()
    other_df['similarity'] = similarity

    results = other_df.drop_duplicates(subset=['artists']).nlargest(n, 'similarity')[
        ['track_name', 'artists', 'track_genre', 'popularity', 'similarity']
    ].copy()
    results = results.reset_index(drop=True)
    results.index += 1

    logger.info(f'Similar artists: {len(results)} found for "{artist}"')
    return results