import pandas as pd
import pytest
from src.evaluation.metrics import (
    genre_consistency, avg_popularity, diversity_score,
    duplicate_rate, novelty_score, evaluate_recommendations
)


@pytest.fixture
def sample_recs():
    return pd.DataFrame({
        'track_name': ['Song A', 'Song B', 'Song C', 'Song A'],
        'track_genre': ['pop, dance', 'pop', 'rock', 'pop, dance'],
        'popularity': [80, 60, 40, 80],
    })


def test_genre_consistency(sample_recs):
    result = genre_consistency(sample_recs, 'pop')
    assert result == 0.75  # 3 of 4 rows contain pop


def test_genre_consistency_empty():
    result = genre_consistency(None, 'pop')
    assert result == 0.0


def test_avg_popularity(sample_recs):
    result = avg_popularity(sample_recs)
    assert result == 65.0


def test_diversity_score(sample_recs):
    result = diversity_score(sample_recs)
    # unique genres: pop, dance, rock = 3, total rows = 4
    assert result == 0.75


def test_duplicate_rate(sample_recs):
    result = duplicate_rate(sample_recs)
    # 4 total, 3 unique track names -> 1 duplicate
    assert result == 0.25


def test_novelty_score(sample_recs):
    result = novelty_score(sample_recs)
    assert result == round(1 - 65.0 / 100, 4)


def test_evaluate_recommendations(sample_recs):
    result = evaluate_recommendations(sample_recs, query_genre='pop')
    assert 'avg_popularity' in result
    assert 'diversity_score' in result
    assert 'duplicate_rate' in result
    assert 'novelty_score' in result
    assert 'genre_consistency' in result


def test_evaluate_recommendations_no_genre(sample_recs):
    result = evaluate_recommendations(sample_recs)
    assert 'genre_consistency' not in result