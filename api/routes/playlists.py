from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.routes.auth import get_current_user
from src.auth.database import get_db
from src.auth.models import User
from src.playlist.models import Playlist, PlaylistSong
from src.playlist.schemas import PlaylistCreate, PlaylistResponse, SongCreate

router = APIRouter(
    prefix="/playlists",
    tags=["playlists"]
)


@router.post("", response_model=PlaylistResponse, status_code=status.HTTP_201_CREATED)
def create_playlist(
    data: PlaylistCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    playlist = Playlist(
        name=data.name,
        user_id=user.id
    )
    db.add(playlist)
    db.commit()
    db.refresh(playlist)
    return playlist


@router.get("", response_model=list[PlaylistResponse])
def get_playlists(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return db.query(Playlist).filter(Playlist.user_id == user.id).all()


@router.post("/{playlist_id}/songs", response_model=PlaylistResponse)
def add_song(
    playlist_id: int,
    song: SongCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id,
        Playlist.user_id == user.id
    ).first()

    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )

    # Check for duplicate song in the playlist
    existing_song = db.query(PlaylistSong).filter(
        PlaylistSong.playlist_id == playlist.id,
        PlaylistSong.track_name == song.track_name
    ).first()

    if existing_song:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Song already exists in playlist"
        )

    # Add new song using modern Pydantic v2 model_dump()
    new_song = PlaylistSong(
        playlist_id=playlist.id,
        **song.model_dump()
    )
    db.add(new_song)
    db.commit()
    db.refresh(playlist)
    return playlist


@router.delete("/{playlist_id}", status_code=status.HTTP_200_OK)
def delete_playlist(
    playlist_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id,
        Playlist.user_id == user.id
    ).first()

    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )

    db.delete(playlist)
    db.commit()
    return {"message": "Playlist deleted"}


@router.delete("/{playlist_id}/songs/{song_id}", status_code=status.HTTP_200_OK)
def delete_song(
    playlist_id: int,
    song_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id,
        Playlist.user_id == user.id
    ).first()

    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )

    song = db.query(PlaylistSong).filter(
        PlaylistSong.id == song_id,
        PlaylistSong.playlist_id == playlist_id
    ).first()

    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )

    db.delete(song)
    db.commit()
    return {"message": "Song removed"}