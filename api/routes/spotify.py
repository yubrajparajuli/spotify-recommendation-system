from fastapi import APIRouter, Query

from src.services.spotify_service import search_track

router = APIRouter(
    prefix="/spotify",
    tags=["Spotify"]
)


@router.get("/cover")
def get_cover(
    track: str = Query(..., description="Track name"),
    artist: str | None = Query(None, description="Artist name"),
):
    result = search_track(track, artist)

    if not result:
        return {
            "cover_url": None,
            "album": None,
            "spotify_url": None,
        }

    return result