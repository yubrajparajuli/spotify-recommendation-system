from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SongCreate(BaseModel):
    track_name: str
    artists: str

    album: Optional[str] = None
    cover_url: Optional[str] = None

    preview_url: Optional[str] = None
    deezer_url: Optional[str] = None
    spotify_url: Optional[str] = None


class SongResponse(BaseModel):
    id: int

    track_name: str
    artists: str

    album: Optional[str] = None
    cover_url: Optional[str] = None

    preview_url: Optional[str] = None
    deezer_url: Optional[str] = None
    spotify_url: Optional[str] = None

    class Config:
        from_attributes = True


class PlaylistCreate(BaseModel):
    name: str


class PlaylistResponse(BaseModel):
    id: int

    name: str

    created_at: datetime

    songs: List[SongResponse] = []

    class Config:
        from_attributes = True