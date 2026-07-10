# Spotify Recommendation System

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

> A full-stack music recommendation system that combines multiple recommendation algorithms to provide song, playlist, mood, and genre-based recommendations through a FastAPI backend and React frontend.

**Live Demo**

- Frontend: https://spotify-recommendation-system-1-ypdp.onrender.com
- Backend API: https://spotify-recommendation-system-erj3.onrender.com

---

## Overview

Spotify Recommendation System is an end-to-end machine learning project that demonstrates how different recommendation techniques can be combined into a single production-style application.

Unlike projects that implement only one recommender, this system integrates **four recommendation engines**, each designed for a different use case:

- **Cosine Similarity** – Find songs similar to a selected track
- **K-Nearest Neighbors (KNN)** – Generate playlist recommendations
- **Weighted Similarity** – Recommend songs based on mood
- **TF-IDF Content-Based Filtering** – Discover songs from genre descriptions

The application includes:

- Full data preprocessing and feature engineering pipeline
- Exploratory Data Analysis (EDA)
- Feature scaling and model experimentation
- Model evaluation and comparison
- REST API built with FastAPI
- React frontend for an interactive user experience
- Dockerized deployment

---

## Features

### Recommendation Systems

- Similar Song Recommendation
- Mood-Based Recommendation
- Genre-Based Recommendation
- Playlist Generation
- Artist Search
- Song Search

### User Features

- User authentication
- Playlist creation
- Playlist management
- Song preview support (via Deezer API when available)
- Responsive web interface

### Machine Learning Pipeline

- Data preprocessing
- Feature engineering
- Audio feature scaling
- Model training
- Model evaluation
- Performance comparison

---

## Project Structure

```text
spotify-recommendation-system/
│
├── api/                    # FastAPI application and API routes
├── config/                 # Configuration files
├── data/
│   ├── raw/                # Raw dataset (.gitkeep in repository)
│   └── processed/          # Processed datasets (.gitkeep in repository)
│
├── frontend/               # React + Vite frontend
├── models/                 # Trained recommendation models
├── notebooks/              # EDA, feature engineering and model experiments
├── reports/                # Evaluation reports, figures and tables
├── src/
│   ├── auth/               # Authentication
│   ├── data/               # Data preprocessing & feature engineering
│   ├── evaluation/         # Evaluation metrics
│   ├── models/             # Recommendation algorithms
│   ├── playlist/           # Playlist management
│   ├── services/           # External service integrations
│   └── utils/              # Utilities and helpers
│
├── tests/                  # Unit and integration tests
│
├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── Makefile
├── pyproject.toml
├── uv.lock
└── README.md
```

---

## Dataset

This project uses the **Spotify Tracks Dataset** from Kaggle.

Dataset:
https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset

The dataset contains Spotify track metadata and audio features that were used for:

- Data preprocessing
- Feature engineering
- Exploratory Data Analysis
- Recommendation model development
- Model evaluation

---

## External API

This project uses the **Deezer API** to enrich recommendation results with:

- Album cover images
- Album information
- Song preview URLs
- Deezer track links

To improve performance and reduce repeated API requests, responses are cached locally.

---

## Tech Stack

### Backend

- Python 3.11
- FastAPI
- SQLAlchemy
- JWT Authentication
- Pydantic
- Uvicorn

### Machine Learning

- NumPy
- Pandas
- Scikit-learn
- SciPy
- TF-IDF Vectorizer
- K-Nearest Neighbors (KNN)
- Cosine Similarity

### Frontend

- React 19
- Vite
- React Router
- TanStack React Query

### Data Visualization & Analysis

- Matplotlib
- Seaborn
- Jupyter Notebook

### Deployment & DevOps

- Docker
- Nginx
- Render

Docker Compose configurations are included for local and production-style container orchestration.

### Development Tools

- Git
- uv
- Oxlint

---

## Recommendation Models

The system combines four recommendation algorithms, where each model is optimized for a different recommendation task instead of relying on a single generic recommender.

| Model                          | Purpose                     |
| ------------------------------ | --------------------------- |
| Cosine Similarity              | Similar song recommendation |
| K-Nearest Neighbors (KNN)      | Playlist recommendation     |
| Weighted Similarity            | Mood-based recommendation   |
| TF-IDF Content-Based Filtering | Genre recommendation        |

This hybrid approach allows the application to provide recommendations based on different user intents, including discovering songs similar to a favorite track, generating playlists, exploring music by mood, and finding songs from genre descriptions.

---

## Machine Learning Pipeline

The project follows a complete end-to-end machine learning workflow:

1. Data Collection
2. Data Cleaning & Preprocessing
3. Exploratory Data Analysis (EDA)
4. Feature Engineering
5. Feature Scaling
6. Model Development
7. Model Evaluation
8. Model Comparison
9. FastAPI Integration
10. React Frontend Integration
11. Docker Deployment

---

## Recommendation Workflow

```text
Spotify Dataset
        │
        ▼
Data Cleaning & Validation
        │
        ▼
Feature Engineering
        │
        ▼
Feature Scaling
        │
        ▼
Recommendation Models
 ├── Cosine Similarity
 ├── KNN
 ├── Weighted Similarity
 └── TF-IDF
        │
        ▼
FastAPI Backend
        │
        ▼
React Frontend
        │
        ▼
User Recommendations
```

---

## Data Science Pipeline

The recommendation system was developed through a complete machine learning workflow, beginning with raw Spotify track data and ending with production-ready recommendation models.

### 1. Data Collection

The project uses the **Spotify Tracks Dataset** from Kaggle, containing Spotify track metadata and audio features across multiple genres.

The dataset serves as the foundation for all preprocessing, feature engineering, model development, and evaluation tasks.

### 2. Data Preprocessing

The raw dataset underwent several preprocessing steps before model development, including:

- Data validation and cleaning
- Duplicate removal
- Missing value handling
- Genre normalization
- Audio feature preprocessing
- Feature selection
- Dataset transformation

The preprocessing pipeline generates cleaned datasets that are later used by all recommendation models.

### 3. Exploratory Data Analysis (EDA)

Exploratory analysis was performed to better understand the characteristics of the dataset before feature engineering.

The analysis includes:

- Audio feature distributions
- Popularity analysis
- Genre distribution
- Artist analysis
- Correlation analysis
- Mood analysis
- Explicit content analysis
- Tempo analysis
- Feature relationship analysis

The generated visualizations and reports are available in the **reports/** directory.

### 4. Feature Engineering

Additional features were engineered from the original Spotify metadata to improve recommendation quality.

The feature engineering pipeline includes:

- Mood extraction
- Tempo categorization
- Popularity categorization
- Audio feature combinations
- Artist-based features
- Genre-based features
- TF-IDF input generation

Multiple feature sets were created to support different recommendation algorithms.

### 5. Model Development

Instead of relying on a single recommendation algorithm, four specialized recommendation models were developed and evaluated.

| Model                     | Primary Use Case            |
| ------------------------- | --------------------------- |
| Cosine Similarity         | Similar Song Recommendation |
| K-Nearest Neighbors (KNN) | Playlist Recommendation     |
| Weighted Similarity       | Mood Recommendation         |
| TF-IDF                    | Genre Recommendation        |

Each model was independently optimized for its specific recommendation task before integration into the application.

---

## Model Evaluation

The recommendation models were evaluated using quantitative metrics to compare recommendation quality, diversity, popularity, coverage, and response time.

Each algorithm was assessed based on the recommendation task it was designed to solve rather than forcing a single model to perform every task.

### Evaluation Metrics

| Metric                 | Description                                                                     |
| ---------------------- | ------------------------------------------------------------------------------- |
| **Genre Consistency**  | Measures how well recommendations stay within the intended genre.               |
| **Average Popularity** | Average Spotify popularity score (0–100) of recommended songs.                  |
| **Diversity Score**    | Measures the variety of recommendations returned by the model.                  |
| **Novelty Score**      | Indicates how likely recommendations are to include less mainstream tracks.     |
| **Coverage**           | Percentage of the dataset available to the recommendation pool after filtering. |
| **Response Time**      | Average inference time for generating recommendations.                          |

### Model Comparison

| Model               | Genre Consistency | Avg. Popularity | Diversity |   Novelty |  Coverage | Response Time |
| ------------------- | ----------------: | --------------: | --------: | --------: | --------: | ------------: |
| Cosine Similarity   |              0.86 |           71.60 |      0.42 | **0.284** |      4.1% |      0.0511 s |
| K-Nearest Neighbors |              0.40 |           74.53 |     0.367 |     0.255 |     15.0% |      0.0510 s |
| Weighted Similarity |               N/A |       **83.40** |  **1.35** |     0.166 | **25.0%** |      0.0350 s |
| TF-IDF              |          **1.00** |           73.74 |      0.26 |     0.263 |      4.1% |  **0.0314 s** |

### Best Model for Each Use Case

| Use Case                    | Selected Model            | Reason                                                                       |
| :-------------------------- | :------------------------ | :--------------------------------------------------------------------------- |
| Similar Song Recommendation | Cosine Similarity         | Highest novelty while maintaining strong genre consistency.                  |
| Playlist Recommendation     | K-Nearest Neighbors (KNN) | Produces playlist-oriented recommendations from multiple input songs.        |
| Mood Recommendation         | Weighted Similarity       | Achieved the highest popularity score and greatest recommendation diversity. |
| Genre Recommendation        | TF-IDF                    | Perfect genre consistency with the fastest response time.                    |

### Key Findings

- Genre filtering significantly improves recommendation relevance across all models.
- Weighted Similarity provides the widest recommendation coverage (25% of the dataset).
- TF-IDF achieved perfect genre consistency while also being the fastest model.
- Cosine Similarity produced the highest novelty score for similar-song recommendations.
- All recommendation models generated responses in under **0.06 seconds**, making them suitable for real-time API inference.
- Duplicate recommendations were eliminated through post-processing before results were returned.

The complete evaluation process, comparison experiments, figures, and supporting tables are available in the `reports/` directory.

---

## Backend

The backend is built with **FastAPI** and provides RESTful APIs for recommendation generation, authentication, playlist management, and song search.

It acts as the bridge between the trained recommendation models and the frontend application by loading precomputed model artifacts and serving recommendations in real time.

### Backend Features

- RESTful API built with FastAPI
- JWT-based user authentication
- User registration and login
- Recommendation endpoints for multiple use cases
- Playlist management
- Song and artist search
- Request validation using Pydantic
- SQLite database for user management
- Deezer API integration for album artwork and song previews

### API Modules

| Module          | Responsibility                                                           |
| --------------- | ------------------------------------------------------------------------ |
| `api/`          | FastAPI application entry point and route definitions                    |
| `src/auth/`     | User authentication, JWT handling, password hashing, and database models |
| `src/models/`   | Recommendation algorithms and orchestration                              |
| `src/data/`     | Data loading, preprocessing, and feature engineering                     |
| `src/playlist/` | Playlist-related models and schemas                                      |
| `src/services/` | External service integration (Deezer API)                                |
| `src/utils/`    | Configuration, logging, exceptions, and helper utilities                 |

### Authentication

The application implements JWT-based authentication for protected routes.

Authentication includes:

- User registration
- Secure password hashing
- User login
- JWT access tokens
- Protected API endpoints
- User profile retrieval

### Recommendation API

The backend exposes dedicated endpoints for different recommendation tasks:

- Similar Song Recommendation
- Playlist Recommendation
- Mood Recommendation
- Genre Recommendation
- Popularity Recommendation
- Artist Recommendation
- Song Search
- Artist Search

Each endpoint uses the recommendation model best suited for its specific task, allowing the application to provide specialized recommendations rather than relying on a single generic algorithm.

---

## Frontend

The frontend is built with **React** and **Vite**, providing a modern single-page application that mimics the Spotify listening experience while interacting with the FastAPI backend.

The interface allows users to discover music through multiple recommendation methods, manage playlists, and explore songs using an intuitive and responsive design.

### Frontend Features

- Spotify-inspired user interface
- User authentication
- Similar song recommendations
- Mood-based recommendations
- Genre-based recommendations
- Playlist recommendation system
- Artist search
- Song search with autocomplete
- Personalized onboarding
- Interactive music player interface
- Responsive layout for different screen sizes

### Application Pages

| Page       | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| Home       | Displays personalized recommendation sections and popular songs |
| Search     | Search songs and discover similar tracks                        |
| Genre      | Browse recommendations by music genre                           |
| Mood       | Explore songs based on mood categories                          |
| Playlist   | Build playlists and generate recommendations                    |
| Artist     | Search artists and explore their songs                          |
| Login      | User authentication                                             |
| Signup     | User registration                                               |
| Onboarding | Collect user preferences for personalization                    |

### Core Components

The frontend is organized into reusable React components to improve maintainability and scalability.

Major components include:

- Sidebar navigation
- Top navigation bar
- Song cards
- Playlist cards
- Playlist sidebar
- Song autocomplete
- Artist autocomplete
- Login and signup modals
- Playlist creation modal
- Now Playing bar
- Vinyl player animation
- Protected route wrapper

### State Management

The application uses modern React features for state management:

- React Context API
- React Hooks
- TanStack React Query for API requests and caching

This approach keeps UI state synchronized with backend data while minimizing unnecessary API requests.

### User Workflow

A typical user journey consists of:

1. Create an account or log in.
2. Complete the onboarding process by selecting preferred genres and moods.
3. Explore recommendations from the Home page.
4. Search for songs or artists.
5. Generate recommendations using different recommendation models.
6. Create playlists and receive playlist-based recommendations.
7. Preview songs with album artwork and available audio previews.

---

## Installation

### Prerequisites

Before running the project, ensure the following software is installed:

- Python 3.11+
- Node.js 20+
- Git
- Docker (optional)
- Docker Compose (optional)
- uv (Python package manager)

### Clone the Repository

```bash
git clone https://github.com/yubrajparajuli/spotify-recommendation-system.git

cd spotify-recommendation-system
```

### Backend Setup

Install Python dependencies:

```bash
uv sync
```

Activate the environment:

**Linux / macOS**

```bash
source .venv/bin/activate
```

**Windows**

```bash
.venv\Scripts\activate
```

### Frontend Setup

```bash
cd frontend

npm install

cd ..
```

---

## Environment Variables

Create a `.env` file in the project root.

Create a frontend environment file at `frontend/.env.production`

The repository already includes `.env.example` files as templates.

---

## Running the Application

### Start the Backend

```bash
uv run uvicorn api.main:app --reload
```

The backend will be available at:

```
http://localhost:8000
```

### Start the Frontend

```bash
cd frontend

npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

### Running with Docker

Development:

```bash
docker compose up --build
```

Production:

```bash
docker compose -f docker-compose.prod.yml up --build
```

### Using Make (Optional)

A `Makefile` is included to simplify common Docker commands during local development.

```bash
# Build Docker images
make build

# Start the application
make up

# Start in detached mode
make up-d

# View backend logs
make logs

# Restart containers
make restart

# Stop and remove containers
make down

# Stop containers and remove volumes
make clean
```

---

## Testing

The project includes both **unit tests** and **integration tests** to verify data preprocessing, recommendation models, helper utilities, and API functionality.

### Test Structure

```text
tests/
├── unit/
│   ├── test_feature_engineering.py
│   ├── test_helpers.py
│   ├── test_metrics.py
│   ├── test_models.py
│   └── test_preprocessing.py
│
├── integration/
│   ├── test_api.py
│   └── test_recommendations.py
│
└── conftest.py
```

### Run Tests

Run all tests:

```bash
pytest
```

Generate a coverage report:

```bash
pytest --cov=src --cov-report=html
```

Coverage reports are generated in the `reports/coverage/` directory.

---

## Deployment

The application is containerized using **Docker** and deployed on **Render**.

### Live Demo

**Frontend**

https://spotify-recommendation-system-1-ypdp.onrender.com

**Backend API**

https://spotify-recommendation-system-erj3.onrender.com

### Deployment Stack

- Docker
- Docker Compose
- Nginx (Frontend)
- Render

The frontend and backend are deployed as separate services. The frontend communicates with the backend through REST APIs exposed by the FastAPI application.

---

## Known Limitations

Although the system successfully demonstrates multiple recommendation techniques in a production-style web application, several limitations remain:

- User recommendations are content-based and do not leverage collaborative filtering.
- Recommendation quality depends on the available Spotify metadata and engineered features.
- Mood recommendation currently supports a limited set of predefined mood categories.
- The application relies on the Deezer API for album artwork and audio previews when available.
- Deployment on the Render free tier is constrained by available memory, which can affect certain resource-intensive operations.

---

## Future Improvements

The following enhancements are planned for future releases:

### Machine Learning

- Implement collaborative filtering models
- Experiment with matrix factorization techniques
- Train hybrid recommendation models
- Improve recommendation diversity
- Optimize model storage and loading
- Expand recommendation coverage

### Backend

- Redis caching
- Background task processing
- API rate limiting
- Improved monitoring and logging
- Database migration to PostgreSQL

### Frontend

- Dark/Light theme support
- Advanced filtering and sorting
- Improved recommendation explanations
- Enhanced playlist management
- Better mobile experience

### Deployment Architecture

- Frontend deployed as a Render Web Service
- Backend deployed as a separate Render Web Service
- Frontend served through Nginx
- Backend exposed through FastAPI
- Docker used for containerization

---

## Acknowledgements

This project was developed using the Spotify Tracks Dataset from Kaggle and built with the support of numerous open-source libraries and tools.

I would also like to express my sincere gratitude to **Angat Sitaula**, my mentor through the **SocreteAI Program**, for his guidance, feedback, and encouragement throughout my learning journey.

Special thanks to the open-source community and the developers behind:

- FastAPI
- React
- Vite
- Scikit-learn
- Pandas
- NumPy
- Docker
- Deezer API

---

## License

This project is released under the **MIT License**.

See the `LICENSE` file for details.

---

## Author

**Yubraj Parajuli**

Computer Engineering Graduate • AI & Data Science Enthusiast

- GitHub: https://github.com/yubrajparajuli
- LinkedIn: https://www.linkedin.com/in/yubraj-parajuli/

If you found this project helpful, consider giving it a ⭐ on GitHub.
