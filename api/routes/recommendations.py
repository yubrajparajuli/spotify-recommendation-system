from fastapi import APIRouter, Depends, HTTPException
from rapidfuzz import fuzz
from sqlalchemy.orm import Session

from api.dependencies import get_recommender
from api.schemas.recommendation import (
    ArtistRequest,
    GenreRequest,
    MoodRequest,
    PlaylistRequest,
    PopularityRequest,
    RecommendationResponse,
    SearchRequest,
    SearchResponse,
    SearchResult,
    SimilarSongRequest,
    SongResult,
)
from src.models.recommender import Recommender
from src.services.spotify_service import search_track
from src.utils.exceptions import (
    InvalidArtistException,
    InvalidGenreException,
    InvalidMoodException,
    InvalidPlaylistException,
    SongNotFoundException,
)

router = APIRouter(
    prefix="/recommend",
    tags=["recommendations"]
)


def _enrich_song(row):
    artist = (
        row["artists"].split(";")[0]
        if row["artists"]
        else None
    )

    music = search_track(
        row["track_name"],
        artist
    )

    return SongResult(
        track_name=row["track_name"],
        artists=row["artists"],
        track_genre=row["track_genre"],
        popularity=int(row["popularity"]),
        cover_url=(
            music["cover_url"]
            if music else None
        ),
        album=(
            music["album"]
            if music else None
        ),
        preview_url=(
            music["preview_url"]
            if music else None
        ),
        deezer_url=(
            music["deezer_url"]
            if music else None
        ),
        spotify_url=(
            music["spotify_url"]
            if music else None
        )
    )


def _to_response(
    query: str,
    df,
    score_col: str = None
):
    results = []

    for _, row in df.iterrows():
        song = _enrich_song(row)

        if score_col and score_col in row:
            song.score = float(row[score_col])

        results.append(song)

    return RecommendationResponse(
        query=query,
        count=len(results),
        results=results
    )


@router.post(
    "/similar-song",
    response_model=RecommendationResponse
)
def similar_song(
    request: SimilarSongRequest,
    rec: Recommender = Depends(get_recommender)
):
    try:
        df = rec.similar_song(
            request.song_name,
            request.artist,
            request.n
        )

        return _to_response(
            request.song_name,
            df,
            "similarity_score"
        )

    except SongNotFoundException as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.post(
    "/playlist",
    response_model=RecommendationResponse
)
def playlist(
    request: PlaylistRequest,
    rec: Recommender = Depends(get_recommender)
):
    try:
        df = rec.playlist(
            request.songs,
            request.n
        )

        return _to_response(
            ", ".join(request.songs),
            df,
            "distance"
        )

    except InvalidPlaylistException as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.post(
    "/mood",
    response_model=RecommendationResponse
)
def mood(
    request: MoodRequest,
    rec: Recommender = Depends(get_recommender)
):
    try:
        df = rec.mood(
            request.mood,
            request.n
        )

        return _to_response(
            request.mood,
            df,
            "combined_score"
        )

    except InvalidMoodException as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post(
    "/genre",
    response_model=RecommendationResponse
)
def genre(
    request: GenreRequest,
    rec: Recommender = Depends(get_recommender)
):
    try:
        df = rec.genre(
            request.genre,
            request.n
        )

        return _to_response(
            request.genre,
            df,
            "combined_score"
        )

    except InvalidGenreException as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.post(
    "/popularity",
    response_model=RecommendationResponse
)
def popularity(
    request: PopularityRequest,
    rec: Recommender = Depends(get_recommender)
):
    df = rec.popularity(
        request.genre,
        request.n
    )

    query = (
        request.genre
        if request.genre
        else "overall"
    )

    return _to_response(
        query,
        df
    )


@router.post(
    "/artist",
    response_model=RecommendationResponse
)
def artist(
    request: ArtistRequest,
    rec: Recommender = Depends(get_recommender)
):
    try:
        df = rec.artist(
            request.artist,
            request.n
        )

        return _to_response(
            request.artist,
            df
        )

    except InvalidArtistException as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.post(
    "/search-songs",
    response_model=SearchResponse
)
def search_songs_endpoint(
    request: SearchRequest,
    rec: Recommender = Depends(get_recommender)
):
    df = rec.search(
        request.query,
        request.n
    )

    results = []

    for _, row in df.iterrows():
        artist = (
            row["artists"].split(";")[0]
            if row["artists"]
            else None
        )

        music = search_track(
            row["track_name"],
            artist
        )

        results.append(
            SearchResult(
                track_name=row["track_name"],
                artists=row["artists"],
                track_genre=row["track_genre"],
                popularity=int(row["popularity"]),
                cover_url=(
                    music["cover_url"]
                    if music else None
                ),
                album=(
                    music["album"]
                    if music else None
                ),
                preview_url=(
                    music["preview_url"]
                    if music else None
                ),
                deezer_url=(
                    music["deezer_url"]
                    if music else None
                ),
                spotify_url=(
                    music["spotify_url"]
                    if music else None
                )
            )
        )

    return SearchResponse(
        query=request.query,
        count=len(results),
        results=results
    )


@router.post("/search-artists")
def search_artists(
    request: SearchRequest,
    rec: Recommender = Depends(get_recommender)
):
    query = request.query.strip().lower()

    if not query:
        return {
            "query": request.query,
            "results": []
        }

    artist_scores = {}

    for _, row in rec.df.iterrows():
        popularity = int(row["popularity"])

        for artist in str(row["artists"]).split(";"):
            artist = artist.strip()

            if not artist:
                continue

            name = artist.lower()
            words = name.split()

            is_prefix = name.startswith(query)
            is_word_prefix = any(
                word.startswith(query)
                for word in words
            )

            if len(query) <= 3:
                if not (is_prefix or is_word_prefix):
                    continue

                score = 150 if is_prefix else 130
            else:
                fuzzy = fuzz.partial_ratio(query, name)

                if is_prefix:
                    score = 150
                elif is_word_prefix:
                    score = 130
                elif fuzzy >= 88:
                    score = fuzzy * 0.9
                else:
                    continue

            if len(words[0]) <= 3 and not is_prefix:
                continue

            final_score = score + (popularity * 0.2)

            if (
                artist not in artist_scores
                or final_score > artist_scores[artist]
            ):
                artist_scores[artist] = final_score

    ranked = sorted(
        artist_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    return {
        "query": request.query,
        "results": [
            {"artist": artist}
            for artist, _ in ranked[:10]
        ]
    }