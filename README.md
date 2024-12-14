# URL Shortener API with Authentication

A secure and feature-rich URL shortening service built with **Node.js**, **Express.js**, **MongoDB**, and **JWT authentication**. The API allows users to shorten URLs, manage their profile, and upload a profile image.  

## Features

- **User Authentication**: Register, login, and logout with JWT-based authentication.
- **URL Management**: Create, retrieve, update, and delete shortened URLs.
- **Profile Management**: Update profile details and upload profile images.
- **Secure Access**: Routes are protected using authentication middleware.
- **Folder Management**: User-specific folders for profile images are created dynamically.

---

## Table of Contents

1. [Project Structure](#project-structure)  
2. [Technologies Used](#technologies-used)  
3. [Getting Started](#getting-started)  
4. [Environment Variables](#environment-variables)  
5. [API Endpoints](#api-endpoints)  
6. [Error Handling](#error-handling)  
7. [Postman Collection](#postman-collection)  

---

## Project Structure

```
authService/
  ├── auth.controllers.js       # Handles authentication-related logic
  ├── auth.routes.js            # Defines routes for authentication
  ├── auth.services.js          # Contains business logic for authentication
config/
  ├── db.config.js              # MongoDB connection setup
  ├── multer.config.js          # Multer configuration for file uploads
middlewares/
  ├── appErrorHandler.js        # Global error handler middleware
  ├── authenticate.js           # JWT-based authentication middleware
  ├── logger.js                 # Logs incoming requests
  ├── routeNotFound.js          # Handles undefined routes
postman/
  ├── UrlShortner API.json      # Postman collection for testing the API
shared/
  ├── apiError.js               # Custom API error class
  ├── httpStatusCodes.js        # HTTP status codes utility
uploads/
  ├── profile_images/           # Stores user profile images
urlsService/
  ├── urls.controllers.js       # Handles URL-related logic
  ├── urls.routes.js            # Defines routes for URL operations
  ├── urls.services.js          # Contains business logic for URL operations
utils/
  ├── checkPassword.js          # Validates user passwords
  ├── generateToken.js          # Generates JWT tokens
  ├── hashPassword.js           # Hashes user passwords
  ├── invalidateToken.js        # Invalidates JWT tokens
server.js                        # Entry point for the application
.env                              # Configuration for environment variables
.gitignore                        # Files to be ignored by Git
package.json                      # Dependencies and scripts
```

---

## Technologies Used

- **Node.js**  
- **Express.js**  
- **MongoDB**  
- **JWT Authentication**  
- **Multer for file uploads**  

---

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. The API will run on `http://localhost:5000` by default.

---

## Environment Variables

Create a `.env` file in the root directory and define the following:

```plaintext
PORT = SEVER_PORT
DB_HOST = DB_HOST
DB_PORT = DB_PORT
DB_USER = DB_USERNAME
DB_PWD = DB_USER_PASSWORD
DB_NAME = DB_NAME
JWT_SECRET = JWT_SECRET
```

---

## API Endpoints

### **Authentication Service**

| Method | Endpoint               | Description                | Access   |
|--------|-------------------------|----------------------------|----------|
| POST   | `/api/v1/auth/register` | Register a new user        | Public   |
| POST   | `/api/v1/auth/login`    | Login user                 | Public   |
| GET    | `/api/v1/auth/profile`  | Get user profile           | Private  |
| PUT    | `/api/v1/auth/profile`  | Update user profile        | Private  |
| DELETE | `/api/v1/auth/profile`  | Delete user profile        | Private  |
| POST   | `/api/v1/auth/upload`   | Upload profile image       | Private  |
| POST   | `/api/v1/auth/logout`   | Logout user                | Private  |

---

### **URL Service**

| Method | Endpoint               | Description                | Access   |
|--------|-------------------------|----------------------------|----------|
| POST   | `/api/v1/urls`          | Create a new URL           | Private  |
| GET    | `/api/v1/urls`          | Get all URLs               | Private  |
| GET    | `/api/v1/urls/:id`      | Get URL by ID              | Private  |
| PUT    | `/api/v1/urls/:id`      | Update URL by ID           | Private  |
| DELETE | `/api/v1/urls/:id`      | Delete URL by ID           | Private  |
| GET    | `/api/v1/urls/r/:slug`  | Redirect to original URL   | Public   |

---

## Error Handling

The API uses a centralized error-handling middleware to catch and format errors. Common errors include:

- **401 Unauthorized**: Accessing a protected route without a valid token.
- **404 Not Found**: Trying to access non-existent resources.
- **500 Internal Server Error**: Server-side issues.

---

## Postman Collection

A Postman collection for testing the API is included in the `postman/` directory. Import `UrlShortner API.json` into Postman to test all routes.

---

## How It Works

1. **Authentication**:
   - Register and login to receive a JWT token.
   - Use the token to access protected routes.
   - Upload a profile image using the `/auth/upload` route.

2. **URL Shortening**:
   - Authenticated users can create short URLs.
   - Access your created URLs or update/delete them as needed.

3. **Profile Management**:
   - Users can update their profile details.
   - A unique folder is created for each user for storing their profile image.
