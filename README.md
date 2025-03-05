# Ticket Management System - Demo Project

This is a Ticket Management System demo project, where you can manage users, tickets, and more. It includes both a **frontend** and a **backend** application.

## Steps to Clone and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YeabTesfaye/ticketing-system
```

### 2. Install Dependencies

#### root:

```bash
npm install
```

#### Backend:

Navigate to the `backend` folder and install the dependencies:

```bash
cd backend
npm install
```

#### Frontend:

Navigate to the `frontend` folder and install the dependencies:

```bash
cd frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in both the `backend` and `frontend` directories using the example below:

#### Example `.env` for Backend:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/database_name
```

- **PORT**: Set the port for your backend server.
- **JWT_SECRET**: A secret key used to sign and verify JSON Web Tokens.
- **MONGO_URI**: A valid MongoDB URI. If you don’t have your own, you can use the provided example or set up your own MongoDB Atlas cluster.

#### Example `.env` for Frontend:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

- **REACT_APP_API_URL**: URL for the backend API.

### 4. Seed Example User Data

To seed the backend with some example user data, run the following command:

```bash
node backend/src/utils/seed.js
```

### 5. Start the Backend

Start the backend server by running:

```bash
cd backend
npm run dev
```

This will start the backend API on the specified port (usually `5000`).

### 6. Start the Frontend

Start the frontend by running:

```bash
cd frontend
npm start
```

The frontend will be available on `http://localhost:3000`.

### 7. Logging In as Admin

To see what you're capable of doing as an admin, log in with the provided admin credentials.

---

## Thank You!
