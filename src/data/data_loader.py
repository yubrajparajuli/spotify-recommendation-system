import pandas as pd
import numpy as np
import pickle
import json
import scipy.sparse as sp
import os
from src.utils.logger import get_logger
from src.utils.config import get_data_path, get_model_path
from src.utils.exceptions import ModelNotLoadedException

logger = get_logger(__name__)

def load_featured_dataset() -> pd.DataFrame:
    """Load featured unscaled dataset"""
    path = get_data_path('featured_dataset.csv')
    logger.info(f'Loading featured dataset from {path}')
    return pd.read_csv(path)

def load_full_standard() -> pd.DataFrame:
    """Load full features standardized dataset"""
    path = get_data_path('featured_full_standard.csv')
    logger.info(f'Loading full standard dataset from {path}')
    return pd.read_csv(path)

def load_audio_standard() -> pd.DataFrame:
    """Load audio features standardized dataset"""
    path = get_data_path('featured_audio_standard.csv')
    logger.info(f'Loading audio standard dataset from {path}')
    return pd.read_csv(path)

def load_cosine_model() -> np.ndarray:
    """Load cosine similarity feature matrix"""
    path = get_model_path('cosine_feature_matrix.npy')
    if not os.path.exists(path):
        raise ModelNotLoadedException('cosine')
    logger.info('Loading cosine feature matrix')
    return np.load(path)

def load_knn_model() -> np.ndarray:
    """Load KNN feature matrix"""
    path = get_model_path('knn_feature_matrix.npy')
    if not os.path.exists(path):
        raise ModelNotLoadedException('knn')
    logger.info('Loading KNN feature matrix')
    return np.load(path)

def load_weighted_model() -> np.ndarray:
    """Load weighted similarity feature matrix"""
    path = get_model_path('weighted_feature_matrix.npy')
    if not os.path.exists(path):
        raise ModelNotLoadedException('weighted')
    logger.info('Loading weighted feature matrix')
    return np.load(path)

def load_tfidf_model():
    """Load TF-IDF matrix and vectorizer"""
    matrix_path = get_model_path('tfidf_matrix.npz')
    vectorizer_path = get_model_path('tfidf_vectorizer.pkl')

    if not os.path.exists(matrix_path) or not os.path.exists(vectorizer_path):
        raise ModelNotLoadedException('tfidf')

    logger.info('Loading TF-IDF model')
    matrix = sp.load_npz(matrix_path)
    with open(vectorizer_path, 'rb') as f:
        vectorizer = pickle.load(f)

    return matrix, vectorizer

def load_model_config(model_name: str) -> dict:
    """Load model configuration"""
    path = get_model_path(f'{model_name}_config.json')
    if not os.path.exists(path):
        raise ModelNotLoadedException(f'{model_name}_config')
    with open(path, 'r') as f:
        return json.load(f)

def load_all_data():
    """Load all datasets and models at once"""
    logger.info('Loading all data and models')
    return {
        'df': load_featured_dataset(),
        'df_full_standard': load_full_standard(),
        'df_audio_standard': load_audio_standard(),
        'cosine_matrix': load_cosine_model(),
        'knn_matrix': load_knn_model(),
        'weighted_matrix': load_weighted_model(),
        'tfidf_matrix': load_tfidf_model()[0],
        'tfidf_vectorizer': load_tfidf_model()[1],
    }