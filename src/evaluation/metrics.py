import pandas as pd
from src.utils.logger import get_logger

logger = get_logger(__name__)


def genre_consistency(recommendations: pd.DataFrame, query_genre: str) -> float:
    """% of recommendations matching query genre"""
    if recommendations is None or len(recommendations) == 0:
        return 0.0
    matches = recommendations['track_genre'].str.contains(query_genre, case=False).sum()
    return round(matches / len(recommendations), 4)


def avg_popularity(recommendations: pd.DataFrame) -> float:
    """Average popularity of recommendations"""
    if recommendations is None or len(recommendations) == 0:
        return 0.0
    return round(recommendations['popularity'].mean(), 2)


def diversity_score(recommendations: pd.DataFrame) -> float:
    """Unique genres per recommendation"""
    if recommendations is None or len(recommendations) == 0:
        return 0.0
    all_genres = []
    for genre_str in recommendations['track_genre']:
        all_genres.extend(genre_str.split(', '))
    unique_genres = len(set(all_genres))
    return round(unique_genres / len(recommendations), 4)


def duplicate_rate(recommendations: pd.DataFrame) -> float:
    """% of duplicate track names"""
    if recommendations is None or len(recommendations) == 0:
        return 0.0
    total = len(recommendations)
    unique = recommendations['track_name'].nunique()
    return round((total - unique) / total, 4)


def novelty_score(recommendations: pd.DataFrame) -> float:
    """1 - avg_popularity/100, higher means more novel/less mainstream"""
    if recommendations is None or len(recommendations) == 0:
        return 0.0
    avg_pop = recommendations['popularity'].mean()
    return round(1 - avg_pop / 100, 4)


def evaluate_recommendations(recommendations: pd.DataFrame, query_genre: str = None) -> dict:
    """Run all metrics on a set of recommendations"""
    results = {
        'avg_popularity': avg_popularity(recommendations),
        'diversity_score': diversity_score(recommendations),
        'duplicate_rate': duplicate_rate(recommendations),
        'novelty_score': novelty_score(recommendations),
    }
    if query_genre:
        results['genre_consistency'] = genre_consistency(recommendations, query_genre)
    return results