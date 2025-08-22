**Secure User Authentication and Image Management**  
This is a backend application built with Node.js and Express.js that provides a secure RESTful API for user authentication and image management. It features robust user registration, login, and profile management. 

**Technologies Used**  
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT, bcrypt
Cloud Storage: Cloudinary
Getting Started  

**Prerequisites**  
* Node.js installed  
* A MongoDB instance (local or remote)  
* A Cloudinary account  

**#Navigate project dir**  
cd USER_AUTHENTICATION_AUTHORIZATION

**#Install dependancies**  
```npm install```

**#Create a .env file in the root directory**  
```PORT=3000
MONGODB_URI=<Your MongoDB connection string> 
JWT_SECRET_KEY=<A strong, random secret key>
CLOUDINARY_CLOUD_NAME=<Your Cloudinary cloud name>
CLOUDINARY_API_KEY=<Your Cloudinary API key>
CLOUDINARY_API_SECRET=<Your Cloudinary API secret>
```

**#Start the Server**  
```npm start  ```

The API is now running at `http://localhost:3000`







