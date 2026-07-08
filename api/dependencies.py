from fastapi import Request
from src.models.recommender import Recommender


def get_recommender(request: Request) -> Recommender:
    return request.app.state.recommender