# DevPulse

A backend platform for software teams to report bugs, suggest features.

**Live URL:** 

---

## Features

- User registration and login with JWT authentication
- Role-based access control (contributor / maintainer)
- Create, read, update, and delete issues
- Secure password hashing with bcrypt

---

## Tech Stack

| Technology | Usage |
|---|---|
| Node.js
| TypeScript
| Express.js
| PostgreSQL
| bcryptjs
| jsonwebtoken

---

## Project Structure

```
src/
├── config/        
├── modules/
│   ├── auth/      
│   └── issues/     
├── middleware/    
└── utils/  
```

---

### 1. Clone the repository

```bash
git clone https://github.com/SakibHasan7439/devpulse-backend.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
PORT=5000
DB_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```