from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from src.auth.database import Base


class Playlist(Base):
    __tablename__ = "playlists"


    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    name = Column(
        String,
        nullable=False,
        default="My Playlist"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


    songs = relationship(
        "PlaylistSong",
        back_populates="playlist",
        cascade="all, delete"
    )



class PlaylistSong(Base):
    __tablename__ = "playlist_songs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    playlist_id = Column(
        Integer,
        ForeignKey("playlists.id"),
        nullable=False
    )

    track_name = Column(
        String,
        nullable=False
    )

    artists = Column(
        String,
        nullable=False
    )

    album = Column(
        String,
        nullable=True
    )

    cover_url = Column(
        String,
        nullable=True
    )

    preview_url = Column(
        String,
        nullable=True
    )

    deezer_url = Column(
        String,
        nullable=True
    )

    spotify_url = Column(
        String,
        nullable=True
    )


    playlist = relationship(
        "Playlist",
        back_populates="songs"
    )