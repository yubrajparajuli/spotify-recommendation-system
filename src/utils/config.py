import json
import yaml
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def load_feature_sets():
    path = os.path.join(BASE_DIR, 'config', 'feature_sets.json')
    with open(path, 'r') as f:
        return json.load(f)

def load_config():
    path = os.path.join(BASE_DIR, 'config', 'config.yaml')
    with open(path, 'r') as f:
        return yaml.safe_load(f)

def get_data_path(filename: str) -> str:
    return os.path.join(BASE_DIR, 'data', 'processed', filename)

def get_model_path(filename: str) -> str:
    return os.path.join(BASE_DIR, 'models', 'content_based', filename)

def get_reports_path(filename: str) -> str:
    return os.path.join(BASE_DIR, 'reports', 'tables', filename)

# feature sets
FEATURE_SETS = load_feature_sets()
AUDIO_FEATURES = FEATURE_SETS['audio_features']
FULL_FEATURES = FEATURE_SETS['full_features']

# model weights
MOOD_WEIGHTS = {
    'valence': 3.0,
    'energy': 3.0,
    'danceability': 2.0,
    'mode': 1.0,
    'speechiness': 0.5,
    'acousticness': 1.0,
    'instrumentalness': 0.5,
    'liveness': 0.5,
    'tempo': 1.0,
    'duration_min': 0.5,
    'explicit': 0.5
}

# mood targets
MOOD_TARGETS = {
    'happy': {'valence': 1.0, 'energy': 1.0},
    'angry': {'valence': 0.0, 'energy': 1.0},
    'sad':   {'valence': 0.0, 'energy': 0.0},
    'calm':  {'valence': 1.0, 'energy': 0.0},
}

# valid moods
VALID_MOODS = list(MOOD_TARGETS.keys())