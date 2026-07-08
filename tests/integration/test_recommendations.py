from src.models.recommender import Recommender


def main():
    rec = Recommender()

    print("=== Similar Song ===")
    print(rec.similar_song("Shape of You", artist="Ed Sheeran", n=5))

    print("\n=== Playlist ===")
    print(rec.playlist(["Shape of You", "Blinding Lights", "Levitating"], n=5))

    print("\n=== Mood ===")
    print(rec.mood("happy", n=5))

    print("\n=== Genre ===")
    print(rec.genre("rock", n=5))

    print("\n=== Popularity ===")
    print(rec.popularity(genre="pop", n=5))

    print("\n=== Artist ===")
    print(rec.artist("Ed Sheeran", n=5))


if __name__ == "__main__":
    main()