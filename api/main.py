from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from src.models.recommender import Recommender

load_dotenv()

from src.auth.database import Base, engine

import src.auth.models
import src.playlist.models

from api.routes import playlists, recommendations
from api.routes.auth import router as auth_router
from api.routes.spotify import router as spotify_router

@asynccontextmanager
async def lifespan(app: FastAPI):

    app.state.recommender = Recommender()

    yield

app = FastAPI(
    title="Spotify Recommendation System API",
    version="1.0.0",
    lifespan=lifespan
)

# Create database tables
Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(recommendations.router)
app.include_router(auth_router)
app.include_router(spotify_router)
app.include_router(playlists.router)


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/")
def root():
    return {
        "message": "Spotify Recommendation API is running"
    }