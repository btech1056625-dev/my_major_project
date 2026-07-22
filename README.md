# YouTube × Twitter — Backend API

> A polished and professional **Node.js + Express** backend designed for hybrid media, social, and content experiences.

---

## 📌 Overview

A modern REST API for seamless video, tweet, comment, like, playlist, and subscription workflows. The repository also contains `Sentiment.ipynb`, an end-to-end notebook that trains and evaluates binary sentiment classifiers on tweets.

This backend is built for frontend-agnostic integration and follows a clean MVC-style architecture with robust middleware, centralized error handling, and media upload support.

---

## 🧠 Sentiment Analysis

[`Sentiment.ipynb`](./Sentiment.ipynb) implements a binary Twitter sentiment-analysis pipeline. It uses the Sentiment140 training CSV (`training.1600000.processed.noemoticon.csv`), where label `0` is negative and label `4` is mapped to positive.

The notebook covers:

- archive extraction, inspection, text cleaning, label encoding, and stratified sampling (up to 100,000 tweets);
- exploratory analysis including class balance, text-length distributions, bigrams, and word clouds;
- TF-IDF features with Logistic Regression, Multinomial Naive Bayes, Linear SVC, and Random Forest baselines;
- a TensorFlow Bidirectional LSTM classifier using 20,000 vocabulary terms and sequences of length 50;
- classification reports, a confusion matrix, training curves, and manual prediction checks;
- export of `tfidf_vectorizer.pkl`, `tokenizer.pkl`, `bilstm_sentiment_model.keras`, and `logistic_regression_model.pkl`, plus a small `SentimentDeployment` prediction wrapper.

### Run the notebook

The notebook is set up for Google Colab. Upload the Sentiment140 archive and update `zip_path` in the data-loading cell if its name or location differs from `/content/archive (5).zip`. The archive must contain `training.1600000.processed.noemoticon.csv`.

For a local Jupyter environment, install the notebook dependencies and set `zip_path` to your local archive path:

```bash
pip install pandas numpy matplotlib seaborn wordcloud scikit-learn tensorflow joblib jupyter
jupyter notebook Sentiment.ipynb
```

Model artifacts are created in the directory from which the notebook runs; they are not committed to this repository.

---

## ✨ Backend Highlights

- **Video publishing:** upload, edit, delete, publish/unpublish
- **Social microblogging:** create, update, delete tweets
- **Engagement:** like videos, comments, tweets
- **Comments:** full comment lifecycle for videos
- **Playlists:** build, manage, and maintain playlists
- **Subscriptions:** follow channels and view subscriptions
- **Dashboard:** channel analytics and video performance
- **Health check:** lightweight readiness endpoint

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v24 |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose v9 |
| Authentication | JWT + bcrypt |
| Uploads | Multer + Cloudinary |
| Configuration | dotenv / dotenv-flow |
| Testing | Jest + Newman |
| Formatting | Prettier |
| ML analysis | pandas, scikit-learn, TensorFlow, Jupyter |

---

## 🔐 Authentication

The API uses JWT bearer tokens to protect sensitive endpoints.

Authentication is handled in `src/middlewares/auth.middleware.js`.

- reads `Authorization: Bearer <token>`
- validates the token with `ACCESS_TOKEN_SECRET`
- attaches `req.user` for secured controllers
- rejects invalid or expired tokens with `401 Unauthorized`

---

## 🚀 Quick Start

### 1. Clone repository
```bash
git clone <repository-url>
cd MY_MAJOR_PROJECT
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Create `.env` and add:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
CORS_ORIGIN=http://localhost:3000
ACCESS_TOKEN_SECRET=<access-token-secret>
JWT_SECRET=<jwt-secret>
JWT_EXPIRY=1d
REFRESH_TOKEN_SECRET=<refresh-token-secret>
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
```

> Tip: URL-encode special characters in your MongoDB password.

### 4. Start the app
```bash
npm run dev
```

The application should now be available at `http://localhost:8000`.

---

## 📂 Project Structure

```
MY_MAJOR_PROJECT/
├── src/
│   ├── index.js
│   ├── app.js
│   ├── constants.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── db/
│   └── utils/
├── tests/
│   ├── postman_collection.json
│   ├── postman_environment.json
│   ├── *.test.md
│   └── helpers/
├── public/temp/
├── Sentiment.ipynb
├── .env
├── .gitignore
├── jest.config.js
├── package.json
└── README.md
```

---

## 🔌 API Reference

**Base URL:** `http://localhost:8000/api/v1`

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/users/register` | None | Create a user account |
| POST | `/users/login` | None | Login and receive tokens |
| POST | `/users/logout` | Required | Invalidate current session |
| GET | `/users/:userId/profile` | None | Fetch user profile |
| GET | `/users/:userId/liked-videos` | None | List liked videos |
| GET | `/users/:userId/liked-playlist` | None | List liked playlists |

### Videos

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/videos` | None | List published videos |
| POST | `/videos` | Required | Upload a new video |
| GET | `/videos/:videoId` | Optional | Fetch video details |
| PUT | `/videos/:videoId` | Required | Update a video |
| DELETE | `/videos/:videoId` | Required | Remove a video |
| PATCH | `/videos/:videoId/publish` | Required | Toggle publish state |

### Tweets

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/tweets` | Required | Create a tweet |
| GET | `/tweets/user/:userId` | None | Get tweets for a user |
| PUT | `/tweets/:tweetId` | Required | Edit a tweet |
| DELETE | `/tweets/:tweetId` | Required | Delete a tweet |

### Comments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/comments/video/:videoId` | None | List video comments |
| POST | `/comments/video/:videoId` | Required | Add comment |
| PUT | `/comments/:commentId` | Required | Update comment |
| DELETE | `/comments/:commentId` | Required | Delete comment |

### Likes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/likes/video/:videoId/toggle` | Required | Toggle video like |
| POST | `/likes/comment/:commentId/toggle` | Required | Toggle comment like |
| POST | `/likes/tweet/:tweetId/toggle` | Required | Toggle tweet like |
| GET | `/likes/videos` | Required | Get liked videos |

### Playlists

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/playlists` | Required | Create playlist |
| GET | `/playlists/user/:userId` | None | List user playlists |
| GET | `/playlists/:playlistId` | None | Get playlist details |
| PUT | `/playlists/:playlistId` | Required | Update playlist |
| DELETE | `/playlists/:playlistId` | Required | Delete playlist |
| POST | `/playlists/:playlistId/video/:videoId` | Required | Add video to playlist |
| DELETE | `/playlists/:playlistId/video/:videoId` | Required | Remove video from playlist |

### Subscriptions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/subscriptions/:channelId/toggle` | Required | Subscribe/unsubscribe |
| GET | `/subscriptions/:channelId/subscribers` | None | Channel subscribers |
| GET | `/subscriptions/subscriber/:subscriberId/channels` | None | User subscriptions |

### Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard/:channelId/stats` | None | Channel metrics |
| GET | `/dashboard/:channelId/videos` | None | Channel videos |

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | None | Liveness probe |

---

## 📝 Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | ✅ | Server port |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `CORS_ORIGIN` | ✅ | Allowed frontend origin |
| `ACCESS_TOKEN_SECRET` | ✅ | JWT access secret |
| `JWT_SECRET` | ✅ | JWT secret |
| `JWT_EXPIRY` | ✅ | Access token expiry |
| `REFRESH_TOKEN_SECRET` | ✅ | Refresh token secret |
| `REFRESH_TOKEN_EXPIRY` | ✅ | Refresh token expiry |
| `CLOUDINARY_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |

---

## ⚙️ Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start development server |
| `start` | `npm start` | Start production server |
| `prettier` | `npm run prettier` | Format code |
| `postman:test` | `npm run postman:test` | Run Newman tests |

---

## 📤 File Uploads

File uploads are handled through Multer and Cloudinary with immediate temp-file cleanup.

---

## 🐛 Error Handling

Errors are normalized across the application using middleware and custom error classes.

- `asyncHandler` for async controller error flow
- `ApiError` for structured HTTP errors
- `Apiresponse` for consistent success responses

---

## 🔒 Security

- JWT authentication
- `bcrypt` hashed passwords
- CORS restricted origin
- Secure token handling via cookies and headers
- Secrets stored in `.env`

---

## 🧪 Testing

Run integration tests using:

```bash
npm run postman:test
```

The `tests/` directory contains documented scenarios for coverage and behavior.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Implement changes.
4. Run `npm run prettier`.
5. Open a PR to `main`.

Refer to [PROJECT_RULES.md](./PROJECT_RULES.md) and [GSD-STYLE.md](./GSD-STYLE.md).

---

## 👤 Author

**Bhavya Varshney** — [bhavyavarshney749@gmail.com](mailto:bhavyavarshney749@gmail.com)

---

## 🤝 Contributors

- **Sahaj Pharkya** — Sentiment analysis notebook, model training, evaluation, and deployment workflow

---

<div align="center">

**Last Updated:** July 22, 2026 · **Status:** Backend Core Complete ✅ · Sentiment Analysis Added ✅ · Auth Hardening 🚧

</div>
