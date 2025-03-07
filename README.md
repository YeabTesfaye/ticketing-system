# 🎫 Ticket Management System - Demo Project

This is a **Ticket Management System** demo project, designed to manage users, tickets, and more. It includes a **frontend (React)** and **backend (Node.js, Express, MongoDB)**.

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YeabTesfaye/ticketing-system.git
cd ticketing-system
```

### 2️⃣ Install Dependencies

#### Root (for both frontend & backend):

```bash
npm install
```

#### Backend:

```bash
cd backend
npm install
```

#### Frontend:

```bash
cd frontend
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory with the following configurations:

#### Backend `.env` Example:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/database_name
```

### Frontend `.env` Example:

```env
VITE_APP_BACKEND_URL=http://localhost:5000
```

- **PORT**: The port for the backend server (default: 5000).
- **JWT_SECRET**: A secret key for signing JWTs.
- **MONGO_URI**: Your MongoDB connection string. You can use MongoDB Atlas or a local database.

### 4️⃣ Seed Example User Data

Run the following command to populate the database with sample users:

```bash
node backend/src/utils/seed.js
```

### 5️⃣ Start the Development Server

To run both frontend and backend simultaneously, use:

```bash
npm run dev
```

- The **backend** will run on `http://localhost:5000`.
- The **frontend** will run on `http://localhost:3000`.

### 6️⃣ Admin Login

To explore the admin features, log in with the provided admin credentials after seeding the database.

## 🎉 Thank You for Trying This Project!

Feel free to contribute or report issues. Happy coding! 🚀
