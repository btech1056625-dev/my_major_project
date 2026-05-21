# Major Project - YouTube & Twitter Clone Integration

A comprehensive full-stack application integrating features from YouTube and Twitter, built with modern web technologies and best practices.

## 🎯 Project Overview

This project is a unified platform that combines the core functionalities of YouTube (video sharing, playlists, subscriptions) and Twitter (tweets, likes, comments, user interactions) into a single, integrated application. Users can share videos, create content, interact with other users through tweets and comments, and build personalized playlists.

## ✨ Features

### Video Management
- Upload and share videos
- Create and manage video playlists
- Video metadata and descriptions
- Video analytics and engagement metrics

### Social Interactions
- Tweet creation and sharing
- Like system for videos and tweets
- Comment functionality on videos and tweets
- User subscriptions and following system

### User System
- User authentication and authorization
- User profiles and preferences
- Subscription management
- Activity tracking

### File Management
- Secure file uploads using Multer
- Cloud storage integration with Cloudinary
- File validation and processing

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **File Upload**: Multer
- **Development**: Nodemon
- **Environment Management**: dotenv

### Frontend (To be integrated)
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
├── app.js                    # Express app configuration
├── index.js                  # Application entry point
├── constants.js              # Application constants
│
├── controllers/              # Request handlers
│   └── user.controller.js
│
├── models/                   # Database schemas
│   ├── User.model.js
│   ├── Video.model.js
│   ├── Tweet.model.js
│   ├── Comment.model.js
│   ├── Like.model.js
│   ├── Playlist.model.js
│   └── Subscription.model.js
│
├── routes/                   # API route definitions
│   └── user.routes.js
│
├── middlewares/              # Custom middleware
│   └── multer.middleware.js  # File upload configuration
│
├── db/                       # Database configuration
│   └── db_connect.js
│
└── utils/                    # Utility functions
    ├── asynchandler.js       # Async error handling wrapper
    ├── apierror.js           # API error class
    ├── Apiresponse.js        # API response formatter
    └── cloudinary.js         # Cloudinary integration
```

## 🔌 API Endpoints

### Authentication & User Management
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- (Additional endpoints in development)

### Video Management
- (Endpoints in development)

### Social Features
- (Endpoints in development)

## 🔧 Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with automatic reload using Nodemon.

### Additional Scripts
(Configure additional scripts as needed in package.json)

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

## 📚 Documentation

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

For support, email support@majorproject.com or open an issue on the repository.

## 👥 Authors

- **Developer**: Your Name
- **Project**: Major Project - YouTube & Twitter Clone Integration

## 🙏 Acknowledgments

- Express.js community
- MongoDB documentation
- Cloudinary for media management
- All contributors and testers

---

**Last Updated**: May 2026  
**Version**: 1.0.0  
**Status**: In Development 🚧
