import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from src.utils.logger import get_logger
from src.utils.config import MOOD_WEIGHTS, MOOD_TARGETS
from src.utils.helpers import (
    find_song, get_song_genres, filter_by_common_genre, deduplicate_by_name
)
from src.data.validators import validate_song_exists, validate_mood, validate_playlist

logger = get_logger(__name__)


def recommend_similar_song(song_name: str, df: pd.DataFrame, features: list,
                            scaled_df: pd.DataFrame, artist: str = None, n: int = 10) -> pd.DataFrame:
    """Cosine similarity based similar song recommendation"""
    idx = validate_song_exists(song_name, df, artist)
    song_genre = df.loc[idx, 'track_genre']

    filtered_df = filter_by_common_genre(get_song_genres(idx, df), df)
    filtered_scaled = scaled_df.loc[filtered_df.index]

    song_features = scaled_df[features].iloc[idx].values.reshape(1, -1)
    similarity = cosine_similarity(song_features, filtered_scaled[features].values)[0]

    similar_indices = similarity.argsort()[::-1][1:n + 1]
    actual_indices = filtered_df.index[similar_indices]

    results = df.loc[actual_indices][['track_name', 'artists', 'track_genre', 'popularity']].copy()
    results['similarity_score'] = similarity[similar_indices].round(4)
    results = results.reset_index(drop=True)
    results.index += 1

    logger.info(f'Cosine: {len(results)} recommendations for "{song_name}"')
    return results


def recommend_playlist(playlist_songs: list, df: pd.DataFrame, features: list,
                       scaled_df: pd.DataFrame, n: int = 10) -> pd.DataFrame:
    """KNN based playlist recommendation"""
    playlist_indices = validate_playlist(playlist_songs, df)

    popularities = df.loc[playlist_indices, 'popularity'].values
    weights = popularities / popularities.sum()
    playlist_features = np.average(
        scaled_df[features].iloc[playlist_indices].values,
        axis=0, weights=weights
    ).reshape(1, -1)

    all_genres = set()
    for idx in playlist_indices:
        all_genres.update(get_song_genres(idx, df))

    filtered_df = filter_by_common_genre(all_genres, df)
    filtered_scaled = scaled_df.loc[filtered_df.index]

    k = min(50, len(filtered_scaled))
    knn = NearestNeighbors(n_neighbors=k, metric='cosine')
    knn.fit(filtered_scaled[features].values)
    distances, indices = knn.kneighbors(playlist_features)
    actual_indices = filtered_df.index[indices[0]]

    seen_names = set()
    recommended = []
    for idx, dist in zip(actual_indices, distances[0]):
        if idx not in playlist_indices:
            name = df.loc[idx, 'track_name'].lower()
            if name not in seen_names:
                seen_names.add(name)
                recommended.append((idx, dist))
        if len(recommended) >= n:
            break

    rec_indices = [r[0] for r in recommended]
    rec_distances = [r[1] for r in recommended]

    results = df.loc[rec_indices][['track_name', 'artists', 'track_genre', 'popularity']].copy()
    results['distance'] = rec_distances
    results = results.reset_index(drop=True)
    results.index += 1

    logger.info(f'KNN: {len(results)} recommendations for playlist of {len(playlist_songs)} songs')
    return results


def recommend_by_mood(mood: str, df: pd.DataFrame, scaled_df: pd.DataFrame,
                      features: list, n: int = 10) -> pd.DataFrame:
    """Weighted similarity based mood recommendation"""
    mood = validate_mood(mood)
    target = MOOD_TARGETS[mood]

    filtered_df = df[df['mood'] == mood].copy()
    filtered_scaled = scaled_df.loc[filtered_df.index]

    weight_vector = np.array([MOOD_WEIGHTS.get(f, 1.0) for f in features])
    weighted_matrix = filtered_scaled[features].values * weight_vector

    target_vector = np.zeros((1, len(features)))
    for i, f in enumerate(features):
        if f in target:
            target_vector[0, i] = target[f] * weight_vector[i]

    similarity = cosine_similarity(target_vector, weighted_matrix)[0]
    filtered_df['similarity'] = similarity
    filtered_df['popularity_norm'] = filtered_df['popularity'] / 100
    filtered_df['combined_score'] = 0.5 * filtered_df['similarity'] + 0.5 * filtered_df['popularity_norm']

    results = filtered_df.nlargest(n, 'combined_score')[
        ['track_name', 'artists', 'track_genre', 'popularity', 'combined_score']
    ].copy()
    results = results.reset_index(drop=True)
    results.index += 1

    logger.info(f'Weighted: {len(results)} recommendations for mood "{mood}"')
    return results


def recommend_by_genre(genre: str, df: pd.DataFrame, tfidf_matrix, tfidf_vectorizer, n: int = 10) -> pd.DataFrame:
    """TF-IDF based genre recommendation"""
    query = genre.lower().replace(',', ' ')
    query_vector = tfidf_vectorizer.transform([query])
    similarity = cosine_similarity(query_vector, tfidf_matrix)[0]

    df_temp = df.copy()
    df_temp['similarity'] = similarity
    df_temp['combined_score'] = 0.6 * similarity + 0.4 * df_temp['popularity'] / 100

    genre_mask = df_temp['track_genre'].str.contains(genre.lower(), case=False)
    df_filtered = deduplicate_by_name(df_temp[genre_mask])

    results = df_filtered.nlargest(n, 'combined_score')[
        ['track_name', 'artists', 'track_genre', 'popularity', 'combined_score']
    ].copy()
    results = results.reset_index(drop=True)
    results.index += 1

    logger.info(f'TF-IDF: {len(results)} recommendations for genre "{genre}"')
    return results