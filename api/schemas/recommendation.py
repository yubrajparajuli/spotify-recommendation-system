from pydantic import BaseModel, Field
from typing import Optional, List


class SongResult(BaseModel):
    track_name: str
    artists: str
    track_genre: str
    popularity: int
    score: Optional[float] = None
    cover_url: Optional[str] = None
    album: Optional[str] = None
    preview_url: Optional[str] = None
    deezer_url: Optional[str] = None
    spotify_url: Optional[str] = None


class RecommendationResponse(BaseModel):
    query: str
    count: int
    results: List[SongResult]


class SimilarSongRequest(BaseModel):
    song_name: str = Field(
        ...,
        json_schema_extra={"example": "Shape of You"}
    )
    artist: Optional[str] = Field(
        None,
        json_schema_extra={"example": "Ed Sheeran"}
    )
    n: int = Field(10, ge=1, le=50)


class PlaylistRequest(BaseModel):
    songs: List[str] = Field(
        ...,
        min_length=1,
        json_schema_extra={"example": ["Shape of You", "Blinding Lights"]}
    )
    n: int = Field(10, ge=1, le=50)


class MoodRequest(BaseModel):
    mood: str = Field(
        ...,
        json_schema_extra={"example": "happy"}
    )
    n: int = Field(10, ge=1, le=50)


class GenreRequest(BaseModel):
    genre: str = Field(
        ...,
        json_schema_extra={"example": "rock"}
    )
    n: int = Field(10, ge=1, le=50)


class PopularityRequest(BaseModel):
    genre: Optional[str] = Field(
        None,
        json_schema_extra={"example": "pop"}
    )
    n: int = Field(10, ge=1, le=50)


class ArtistRequest(BaseModel):
    artist: str = Field(
        ...,
        json_schema_extra={"example": "Ed Sheeran"}
    )
    n: int = Field(10, ge=1, le=50)


class SearchRequest(BaseModel):
    query: str = Field(
        ...,
        json_schema_extra={"example": "shap"}
    )
    n: int = Field(10, ge=1, le=20)


class SearchResult(BaseModel):
    track_name: str
    artists: str
    track_genre: str
    popularity: int
    cover_url: Optional[str] = None
    album: Optional[str] = None
    preview_url: Optional[str] = None
    deezer_url: Optional[str] = None
    spotify_url: Optional[str] = None


class SearchResponse(BaseModel):
    query: str
    count: int
    results: List[SearchResult]