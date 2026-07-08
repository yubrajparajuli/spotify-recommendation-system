class SongNotFoundException(Exception):
    """Raised when a song is not found in the dataset"""
    def __init__(self, song_name: str):
        self.song_name = song_name
        super().__init__(f'Song "{song_name}" not found in dataset')


class InvalidMoodException(Exception):
    """Raised when an invalid mood is provided"""
    def __init__(self, mood: str, valid_moods: list):
        self.mood = mood
        self.valid_moods = valid_moods
        super().__init__(f'Invalid mood "{mood}". Valid moods: {valid_moods}')


class InvalidGenreException(Exception):
    """Raised when an invalid genre is provided"""
    def __init__(self, genre: str):
        self.genre = genre
        super().__init__(f'Invalid genre "{genre}" not found in dataset')


class InvalidPlaylistException(Exception):
    """Raised when playlist has no valid songs"""
    def __init__(self):
        super().__init__('No valid songs found in playlist')


class ModelNotLoadedException(Exception):
    """Raised when a model file is not found"""
    def __init__(self, model_name: str):
        self.model_name = model_name
        super().__init__(f'Model "{model_name}" not loaded. Run training first.')


class InvalidArtistException(Exception):
    """Raised when artist is not found in dataset"""
    def __init__(self, artist: str):
        self.artist = artist
        super().__init__(f'Artist "{artist}" not found in dataset')