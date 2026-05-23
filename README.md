# Major Project - YouTube & Twitter Clone Integration

A comprehensive full-stack application integrating features from YouTube and Twitter, built with modern web technologies and best practices.

## 🎯 Project Overview

This project is a unified platform that combines the core functionalities of YouTube (video sharing, playlists, subscriptions) and Twitter (tweets, likes, comments, user interactions) into a single, integrated application. Users can share videos, create content, interact with other users through tweets and comments, and build personalized playlists.

## ✨ Features

### Video Management ✅
- Upload and share videos
- Create and manage video playlists
- Video metadata and descriptions
- Video analytics and engagement metrics

### Social Interactions ✅
- Tweet creation and sharing
- Like system for videos and tweets
- Comment functionality on videos and tweets
- User subscriptions and following system

### User System ✅
- User authentication and authorization (Registration & Login)
- User profiles and preferences
- Subscription management
- Activity tracking

### File Management ✅
- Secure file uploads using Multer
- Cloud storage integration with Cloudinary
- File validation and processing
- Avatar and cover image upload support

## 🛠 Tech Stack

### Backend ✅ (Implemented)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **File Upload**: Multer
- **Development Tools**: Nodemon
- **Environment Management**: dotenv
- **Error Handling**: Custom error classes and async handlers

### Frontend 🔄 (To be integrated)
- Modern JavaScript/React (Coming soon)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- MongoDB (local or cloud instance)
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MY_MAJOR_PROJECT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=8000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret-key>
   CORS_ORIGIN=<your-frontend-url>
   CLOUDINARY_NAME=<your-cloudinary-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:8000`

## 📁 Project Structure

```
src/
├── app.js                           # Express app configuration
├── index.js                         # Application entry point
├── constants.js                     # Application constants
│
├── controllers/                     # Request handlers (Business Logic)
│   ├── user.controller.js           # User registration, login, profile management
│   ├── video.controller.js          # Video upload and management
│   ├── tweet.controller.js          # Tweet creation and management
│   ├── comment.controller.js        # Comment functionality
│   ├── like.controller.js           # Like system for videos and tweets
│   ├── playlist.controller.js       # Playlist creation and management
│   ├── subscription.controller.js   # User subscription management
│   ├── dashboard.controller.js      # Dashboard analytics
│   └── healthcheck.controller.js    # Health check endpoint
│
├── models/                          # Database schemas (Mongoose)
│   ├── User.model.js                # User schema with auth
│   ├── Video.model.js               # Video schema with metadata
│   ├── Tweet.model.js               # Tweet schema
│   ├── Comment.model.js             # Comment schema
│   ├── Like.model.js                # Like schema for videos/tweets
│   ├── Playlist.model.js            # Playlist schema
│   └── Subscription.model.js        # Subscription schema
│
├── routes/                          # API routes
│   └── user.routes.js               # User routes (register, login)
│
├── middlewares/                     # Custom middlewares
│   └── multer.middleware.js         # File upload middleware
│
├── db/                              # Database configuration
│   └── db_connect.js                # MongoDB connection
│
└── utils/                           # Utility functions
    ├── asynchandler.js              # Async error handling wrapper
    ├── Apiresponse.js               # Standardized API response format
    ├── apierror.js                  # Custom error handling
    └── cloudinary.js                # Cloudinary file upload integration
```

## ✅ Implementation Status

### Completed ✔️
- **Database Models**: All 7 models fully implemented (User, Video, Tweet, Comment, Like, Playlist, Subscription)
- **Controllers**: All 9 controllers with business logic implemented
- **Authentication**: User registration and login with JWT support
- **File Upload**: Multer middleware configured with Cloudinary integration
- **Error Handling**: Custom error classes and async handlers
- **API Response**: Standardized response formatting
- **User Routes**: Authentication routes (register, login)
- **Database Connection**: MongoDB connection setup

### In Progress / Planned 🔄
- Additional API routes for video, tweet, comment, like, playlist, and subscription endpoints
- Route protection middleware (authentication & authorization)
- Frontend integration (React/Next.js)
- Additional utility functions and helper methods
- API documentation (Swagger/OpenAPI)
- Test suite and test coverage

## 🔌 API Endpoints

### Authentication & User Management ✅
- `POST /api/v1/users/register` - User registration with avatar and cover image upload
- `POST /api/v1/users/login` - User login

### Video Management 📋
- (Endpoints framework ready in controllers)

### Social Features 📋
- Tweet management (framework ready)
- Comment system (framework ready)
- Like system (framework ready)
- Playlist management (framework ready)
- Subscription management (framework ready)

## 🔧 Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with automatic reload using Nodemon.

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:3000` |
| `CLOUDINARY_NAME` | Cloudinary account name | `your_cloudinary_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |

## 🎓 Code Standards

This project follows the guidelines specified in [GSD-STYLE.md](./GSD-STYLE.md) and [PROJECT_RULES.md](./PROJECT_RULES.md).

### Key Practices:
- Consistent code formatting and naming conventions
- Proper error handling with custom error classes
- Async/await for asynchronous operations
- RESTful API design principles
- Middleware-based request processing

## 🐛 Error Handling

The project uses a custom error handling system:

- **Async Handler**: Wraps controller methods to catch async errors
- **API Error Class**: Standardized error responses
- **API Response Class**: Consistent success response format

## 📤 File Upload

File uploads are handled securely using:
- **Multer**: Middleware for handling multipart/form-data
- **Cloudinary**: Cloud storage for uploaded media
- **Temporary Storage**: Local temp directory at `./public/temp`

## 🔐 Security Features

- JWT-based authentication
- CORS configuration for cross-origin requests
- Secure file upload handling
- Environment variable protection
- Cookie-based session management

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

Please ensure your code follows the project's style guide and includes appropriate tests.

## � Recent Updates

### Latest Changes (May 23, 2026)
- ✅ Completed all controller business logic implementation
- ✅ Refined models and controllers for better integration
- ✅ Implemented subscription and tweet model business logic
- ✅ Added video upload business logic
- ✅ Completed user registration business logic with bug fixes
- ✅ Fixed issues in controllers and models
- ✅ Configured user authentication routes with file upload support

### What's Next
- Complete API endpoint implementation for all features
- Add route authentication and authorization middleware
- Implement frontend integration with React/Next.js
- Add comprehensive API documentation
- Develop test suite

## �📚 Documentation

- [GSD-STYLE.md](./GSD-STYLE.md) - Code style guidelines
- [PROJECT_RULES.md](./PROJECT_RULES.md) - Project-specific rules and conventions

## 🐛 Known Issues & TODO

- [ ] Complete video upload and management endpoints
- [ ] Implement tweet creation and management
- [ ] Add comment system for videos and tweets
- [ ] Complete subscription and like functionality
- [ ] Add frontend integration
- [ ] Implement user authentication frontend
- [ ] Add comprehensive API documentation
- [ ] Write unit and integration tests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email bhavyavarshney749@gmail.com or open an issue on the repository.

## 👥 Authors

- **Developer**: Bhavya Varshney
- **Project**: Major Project - YouTube & Twitter Clone Integration

## 🙏 Acknowledgments

- Express.js community
- MongoDB documentation
- Cloudinary for media management
- All contributors and testers

---

**Last Updated**: May 23 , 2026  
**Version**: 1.0.0  
**Status**: In Development 🚧
