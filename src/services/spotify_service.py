import requests
import json
import os

from functools import lru_cache

DEEZER_SEARCH_URL = "https://api.deezer.com/search"

CACHE_FILE = os.path.join(
    os.path.dirname(__file__),
    "deezer_cache.json"
)

BAD_WORDS = [
    "karaoke",
    "instrumental",
    "cover",
    "tribute",
    "remix",
    "live",
    "acoustic",
    "slowed",
    "sped up",
    "speed up",
    "orchestra",
    "piano",
    "edit",
    "demo",
]


# CACHE HANDLING

def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(
                CACHE_FILE,
                "r",
                encoding="utf-8"
            ) as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_cache(cache):
    try:
        with open(
            CACHE_FILE,
            "w",
            encoding="utf-8"
        ) as f:
            json.dump(
                cache,
                f,
                indent=4,
                ensure_ascii=False
            )
    except Exception:
        pass


deezer_cache = load_cache()


# TEXT HELPERS

def normalize(text):
    if not text:
        return ""
    return (
        text.lower()
        .replace("’", "'")
        .replace("-", " ")
        .strip()
    )


def has_bad_keyword(text):
    text = normalize(text)
    return any(
        word in text
        for word in BAD_WORDS
    )


# TRACK SELECTION

def select_best_track(
    tracks,
    track_name,
    artist=None
):
    target_title = normalize(track_name)
    target_artist = normalize(artist)

    best_track = None
    best_score = -999

    for track in tracks:
        title = normalize(
            track.get("title", "")
        )
        track_artist = normalize(
            track
            .get("artist", {})
            .get("name", "")
        )
        album_title = normalize(
            track
            .get("album", {})
            .get("title", "")
        )

        score = 0

        # title matching
        if title == target_title:
            score += 300
        elif target_title in title:
            score += 150

        # artist matching
        if target_artist:
            if track_artist == target_artist:
                score += 300
            elif target_artist in track_artist:
                score += 150

        # remove bad versions
        if has_bad_keyword(title):
            score -= 500

        if has_bad_keyword(album_title):
            score -= 300

        # popularity boost
        score += (
            track.get("rank", 0)
            / 1000000
        )

        if score > best_score:
            best_score = score
            best_track = track

    return best_track


# MAIN SEARCH FUNCTION

@lru_cache(maxsize=5000)
def search_track(
    track_name,
    artist=None
):
    cache_key = (
        f"{normalize(track_name)}::"
        f"{normalize(artist)}"
    )

    # persistent cache
    if cache_key in deezer_cache:
        return deezer_cache[cache_key]

    if artist:
        query = (
            f'artist:"{artist.strip()}" '
            f'track:"{track_name.strip()}"'
        )
    else:
        query = track_name.strip()

    try:
        response = requests.get(
            DEEZER_SEARCH_URL,
            params={
                "q": query,
                "limit": 50
            },
            timeout=10
        )

        if response.status_code != 200:
            return None

        tracks = response.json().get(
            "data",
            []
        )

        if not tracks:
            return None

        track = select_best_track(
            tracks,
            track_name,
            artist
        )

        if not track:
            return None

        album = track.get(
            "album",
            {}
        )

        result = {
            "cover_url": (
                album.get("cover_big")
                or album.get("cover_medium")
                or album.get("cover")
            ),
            "album": album.get("title"),
            "preview_url": track.get("preview"),
            "deezer_url": track.get("link"),
            "spotify_url": None
        }

        # save cache
        deezer_cache[cache_key] = result
        save_cache(deezer_cache)

        return result

    except Exception:
        return None