import pandas as pd
import re
from src.utils.logger import get_logger

logger = get_logger(__name__)


def normalize_text(text):
    text = str(text).lower()

    # remove featured artist part
    text = re.sub(
        r'\(feat\..*?\)',
        '',
        text
    )

    # remove special characters
    text = re.sub(
        r'[^a-z0-9\s]',
        '',
        text
    )

    # remove extra spaces
    text = " ".join(
        text.split()
    )

    return text


def search_songs(
    query: str,
    df: pd.DataFrame,
    limit: int = 10
) -> pd.DataFrame:
    """
    Search track_name with:

    1. exact normalized match
    2. partial match fallback
    """

    if not query or len(query.strip()) < 2:
        return df.iloc[0:0]

    query_clean = normalize_text(query)

    # create normalized column
    temp = df.copy()

    temp["normalized_name"] = (
        temp["track_name"]
        .apply(normalize_text)
    )

    # exact match first
    exact = temp[
        temp["normalized_name"] == query_clean
    ]

    if not exact.empty:
        results = exact
    else:
        # partial search fallback
        results = temp[
            temp["normalized_name"]
            .str.contains(
                query_clean,
                case=False,
                na=False
            )
        ]

    results = (
        results
        .drop_duplicates(
            subset=[
                'track_name',
                'artists'
            ]
        )
        .nlargest(
            limit,
            'popularity'
        )
    )

    results = results[
        [
            'track_name',
            'artists',
            'track_genre',
            'popularity'
        ]
    ].copy()

    results = results.reset_index(
        drop=True
    )

    logger.info(
        f'Search: {len(results)} matches for query "{query}"'
    )

    return results