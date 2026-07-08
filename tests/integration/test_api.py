from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_similar_song_success():
    response = client.post("/recommend/similar-song", json={
        "song_name": "Shape of You", "artist": "Ed Sheeran", "n": 5
    })
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 5
    assert len(data["results"]) == 5


def test_similar_song_not_found():
    response = client.post("/recommend/similar-song", json={
        "song_name": "Nonexistent Song XYZ", "n": 5
    })
    assert response.status_code == 404


def test_playlist_success():
    response = client.post("/recommend/playlist", json={
        "songs": ["Shape of You", "Blinding Lights"], "n": 5
    })
    assert response.status_code == 200
    assert response.json()["count"] == 5


def test_playlist_empty():
    response = client.post("/recommend/playlist", json={
        "songs": ["XYZ Nonexistent 1", "XYZ Nonexistent 2"], "n": 5
    })
    assert response.status_code == 404


def test_mood_success():
    response = client.post("/recommend/mood", json={"mood": "happy", "n": 5})
    assert response.status_code == 200
    assert response.json()["count"] == 5


def test_mood_invalid():
    response = client.post("/recommend/mood", json={"mood": "excited", "n": 5})
    assert response.status_code == 400


def test_genre_success():
    response = client.post("/recommend/genre", json={"genre": "rock", "n": 5})
    assert response.status_code == 200
    assert response.json()["count"] == 5


def test_popularity_success():
    response = client.post("/recommend/popularity", json={"genre": "pop", "n": 5})
    assert response.status_code == 200
    assert response.json()["count"] == 5


def test_popularity_no_genre():
    response = client.post("/recommend/popularity", json={"n": 5})
    assert response.status_code == 200


def test_artist_success():
    response = client.post("/recommend/artist", json={"artist": "Ed Sheeran", "n": 5})
    assert response.status_code == 200
    assert response.json()["count"] == 5


def test_artist_not_found():
    response = client.post("/recommend/artist", json={"artist": "Nonexistent Artist XYZ", "n": 5})
    assert response.status_code == 404