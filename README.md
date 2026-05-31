# Major Project — YouTube & Twitter Clone (Backend)

A production-grade **Node.js / Express** REST API that merges the core features of YouTube (video sharing, playlists, subscriptions) and Twitter (tweets, likes, comments) into one unified platform.

---

## 🎯 Project Overview

This backend-only application exposes a versioned REST API (`/api/v1`) covering user authentication, video management, social interactions, and analytics. It is designed to be consumed by any frontend (React, Next.js, mobile, etc.) and follows clean MVC conventions throughout.

---

## ✨ Features

| Domain | Highlights |
|---|---|
| **User System** | Registration with avatar & cover image, JWT login, profile pages, liked-video history |
| **Video Management** | Upload & publish videos, CRUD operations, toggle publish status, paginated listing |
| **Tweets** | Create, read, update, delete tweets |
| **Comments** | Comment on videos; edit & delete your own comments |
| **Likes** | Toggle likes on videos, comments, and tweets; fetch all liked videos |
| **Playlists** | Create playlists, add/remove videos, full CRUD |
| **Subscriptions** | Subscribe/unsubscribe to channels; list subscribers & subscribed channels |
| **Dashboard** | Channel-level stats and video analytics |
| **Health Check** | Simple liveness probe endpoint |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v24 |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose v9 (with `mongoose-aggregate-paginate-v2`) |
| Authentication | JSON Web Tokens (`jsonwebtoken`) + `bcrypt` |
| File Uploads | Multer → Cloudinary |
| Security | CORS, `cookie-parser` |
| Environment | `dotenv` / `dotenv-flow` |
| Dev Server | Nodemon |
| Code Style | Prettier |
| Testing | Jest, `mongodb-memory-server`, Newman (Postman) |

---

## 📋 Prerequisites

- **Node.js** ≥ 18 (project uses v24)
- **npm** ≥ 9
- A **MongoDB** instance (local or MongoDB Atlas)
- A **Cloudinary** account (for media uploads)

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd MY_MAJOR_PROJECT
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:
```env
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
CORS_ORIGIN=http://localhost:3000

JWT_SECRET=<your-jwt-secret>
JWT_EXPIRY=1d
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

> ⚠️ **Note**: If your MongoDB password contains special characters (e.g. `@`), URL-encode them — `@` becomes `%40`.

### 4. Start the development server
```bash
npm run dev
```
The API will be available at `http://localhost:8000`.

---

## 📁 Project Structure

```
MY_MAJOR_PROJECT/
├── src/
│   ├── index.js                         # Entry point — DB connect → start server
│   ├── app.js                           # Express app, middleware, route mounting
│   ├── constants.js                     # Shared constants (DB_NAME, etc.)
│   │
│   ├── controllers/                     # Business logic (one file per domain)
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   ├── tweet.controller.js
│   │   ├── comment.controller.js
│   │   ├── like.controller.js
│   │   ├── playlist.contoller.js
│   │   ├── subscription.controller.js
│   │   ├── dashboard.contrller.js
│   │   └── healthcheck.controller.js
│   │
│   ├── models/                          # Mongoose schemas
│   │   ├── User.model.js
│   │   ├── Video.model.js
│   │   ├── Tweet.model.js
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── playlist.model.js
│   │   └── subscription.model.js
│   │
│   ├── routes/                          # Express routers (one file per domain)
│   │   ├── user.routes.js
│   │   ├── video.routes.js
│   │   ├── tweet.routes.js
│   │   ├── comment.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   ├── subscription.routes.js
│   │   ├── dashboard.routes.js
│   │   └── health.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js           # JWT verification
│   │   └── multer.middleware.js         # Multipart file upload
│   │
│   ├── db/
│   │   └── db_connect.js               # MongoDB connection
│   │
│   └── utils/
│       ├── asynchandler.js             # Wraps async controllers
│       ├── apierror.js                 # Custom ApiError class
│       ├── Apiresponse.js              # Standardised ApiResponse class
│       └── cloudinary.js              # Cloudinary upload helper
│
├── tests/
│   ├── postman_collection.json         # Postman / Newman test suite
│   ├── postman_environment.json
│   ├── *.test.md                       # Per-feature test documentation
│   └── helpers/
│
├── public/temp/                        # Temporary local file storage (gitignored)
├── .env                                # Local environment variables (gitignored)
├── .gitignore
├── jest.config.js
├── package.json
└── README.md
```

---

## 🔌 API Reference

Base URL: `http://localhost:8000/api/v1`

### 🔐 Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register with avatar & cover image |
| `POST` | `/login` | ❌ | Login; returns JWT |
| `GET` | `/:userId/profile` | ❌ | Get public user profile |
| `GET` | `/:userId/liked-videos` | ❌ | Get videos liked by a user |
| `GET` | `/:userId/liked-playlist` | ❌ | Get playlists liked by a user |

### 🎬 Videos — `/api/v1/videos`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ❌ | List all (paginated) videos |
| `POST` | `/` | ✅ | Upload & publish a video |
| `GET` | `/:videoId` | ❌ | Get video by ID |
| `PUT` | `/:videoId` | ✅ | Update video metadata |
| `DELETE` | `/:videoId` | ✅ | Delete a video |
| `PATCH` | `/:videoId/publish` | ✅ | Toggle publish status |

### 🐦 Tweets — `/api/v1/tweets`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | ✅ | Create a tweet |
| `GET` | `/user/:userId` | ❌ | Get all tweets by a user |
| `PUT` | `/:tweetId` | ✅ | Update a tweet |
| `DELETE` | `/:tweetId` | ✅ | Delete a tweet |

### 💬 Comments — `/api/v1/comments`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/video/:videoId` | ❌ | Get comments for a video |
| `POST` | `/video/:videoId` | ✅ | Add a comment to a video |
| `PUT` | `/:commentId` | ✅ | Edit a comment |
| `DELETE` | `/:commentId` | ✅ | Delete a comment |

### ❤️ Likes — `/api/v1/likes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/video/:videoId/toggle` | ✅ | Toggle like on a video |
| `POST` | `/comment/:commentId/toggle` | ✅ | Toggle like on a comment |
| `POST` | `/tweet/:tweetId/toggle` | ✅ | Toggle like on a tweet |
| `GET` | `/videos` | ✅ | Get all videos liked by me |

### 📋 Playlists — `/api/v1/playlists`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | ✅ | Create a playlist |
| `GET` | `/user/:userId` | ❌ | Get all playlists for a user |
| `GET` | `/:playlistId` | ❌ | Get playlist by ID |
| `PUT` | `/:playlistId` | ✅ | Update playlist details |
| `DELETE` | `/:playlistId` | ✅ | Delete a playlist |
| `POST` | `/:playlistId/video/:videoId` | ✅ | Add video to playlist |
| `DELETE` | `/:playlistId/video/:videoId` | ✅ | Remove video from playlist |

### 🔔 Subscriptions — `/api/v1/subscriptions`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/:channelId/toggle` | ✅ | Subscribe / Unsubscribe to a channel |
| `GET` | `/:channelId/subscribers` | ❌ | List subscribers of a channel |
| `GET` | `/subscriber/:subscriberId/channels` | ❌ | List channels a user subscribes to |

### 📊 Dashboard — `/api/v1/dashboard`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/:channelId/stats` | ❌ | Channel statistics (views, subs, likes) |
| `GET` | `/:channelId/videos` | ❌ | All videos for a channel |

### 🩺 Health — `/api/v1`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | ❌ | Liveness probe |

---

## 📝 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `PORT` | ✅ | Server port (default `8000`) |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `CORS_ORIGIN` | ✅ | Allowed frontend origin |
| `JWT_SECRET` | ✅ | Secret for signing access tokens |
| `JWT_EXPIRY` | ✅ | Access token TTL (e.g. `1d`) |
| `REFRESH_TOKEN_SECRET` | ✅ | Secret for signing refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | ✅ | Refresh token TTL (e.g. `10d`) |
| `CLOUDINARY_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |

---

## 🔧 Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start dev server with Nodemon + dotenv auto-injection |
| `start` | `npm start` | Start production server |
| `prettier` | `npm run prettier` | Format all source files with Prettier |
| `postman:test` | `npm run postman:test` | Run Postman collection via Newman |

---

## 🔐 Security

- **JWT Authentication** — stateless access tokens for protected routes
- **bcrypt** password hashing
- **CORS** — configurable allowed origin
- **Cookie Parser** — for secure cookie-based token delivery
- **Environment Variables** — all secrets kept out of source control via `.env`

---

## 📤 File Uploads

1. **Multer** receives `multipart/form-data` and stores files temporarily under `./public/temp/`
2. Files are streamed to **Cloudinary** and the returned URL is persisted in MongoDB
3. The local temp file is deleted after successful upload

---

## 🐛 Error Handling

- `asyncHandler` — wraps every async controller so unhandled rejections propagate to Express
- `ApiError` — custom error class with HTTP status codes and descriptive messages
- `ApiResponse` — uniform success response envelope `{ statusCode, data, message, success }`

---

## 🧪 Testing

```bash
# Run Newman (Postman) integration tests
npm run postman:test
```

Test documentation lives in `tests/*.test.md` covering users, videos, tweets, comments, likes, playlists, subscriptions, dashboard, error handling, performance, and integration scenarios.

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m 'feat: add your feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a Pull Request

Please run `npm run prettier` before committing and follow the conventions in [PROJECT_RULES.md](./PROJECT_RULES.md).

---

## 📚 Further Reading

- [PROJECT_RULES.md](./PROJECT_RULES.md) — Project-specific conventions and rules
- [GSD-STYLE.md](./GSD-STYLE.md) — Code style guidelines
- [tests/README.md](./tests/README.md) — Test setup and runner instructions

---

## 👤 Author

**Bhavya Varshney** — bhavyavarshney749@gmail.com

---

**Last Updated**: May 31, 2026 | **Version**: 1.0.0 | **Status**: Backend Complete ✅
