# 🎓 School Management System

A full-stack School Management System built to help manage student registration, student records, administrators, and contact messages.

## 📌 Features

### 👨‍🎓 Student Features

- Register new students
- Automatically generate a Student ID
- Store student information in MongoDB
- Search for registered students
- View student details

### 👨‍💼 Admin Features

- Register new administrators
- Admin login authentication
- Secure passwords using bcrypt
- JWT authentication
- View all registered students
- Edit student information
- Delete student records
- Logout functionality

### 📩 Contact Features

- Send contact messages
- Store messages in MongoDB
- Admin can view messages
- Admin can reply to messages
- Admin can delete messages

### 🖥️ Pages

- Home Page
- About Page
- Student Registration Page
- Contact Page
- Admin Login Page
- Admin Registration Page
- Admin Dashboard
- Student Management Page
- Messages Page

## 🛠️ Technologies Used

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JSON Web Token (JWT)
- bcryptjs

## 📂 Project Structure

```text
School-Management-System/
│
├── index.html
├── about.html
├── contact.html
├── registration.html
├── admin.html
├── admin-register.html
├── dashboard.html
├── students.html
├── messages.html
│
├── style.css
├── script.js
├── admin.js
├── admin-register.js
├── students.js
├── messages.js
│
├── server.js
├── package.json
├── package-lock.json
│
├── student-icon.png
├── school-bg.jpg
│
├── .gitignore
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone your-repository-link
```

### 2. Open the project folder

```bash
cd School-Management-System
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a `.env` file

Add the following variables:

```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 5. Start the server

```bash
node server.js
```

The server should start on:

```text
http://localhost:3000
```

## 🔐 Security

The project uses:

- Hashed passwords with bcryptjs
- JWT authentication for admin access
- Protected admin routes
- Environment variables for sensitive information

## 🚀 Future Improvements

- Student profile pictures
- Student attendance system
- Student result management
- Password reset functionality
- Email notifications
- Improved admin dashboard
- Role-based access control

## 👨‍💻 Author

**Lekan Busari**

## 📄 License

This project is created for educational purposes.