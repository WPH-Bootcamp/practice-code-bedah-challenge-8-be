# Todo API

A simple Express.js API for managing todos with user authentication using in-memory database.

## Features

- User registration and login
- JWT-based authentication
- Create, list todos with various filters and pagination
- In-memory data storage with initial sample data
- Auto-restart with nodemon in development
- API documentation with Swagger UI

## Installation

1. Clone or download the project
2. Run `npm install` to install dependencies
3. Run `npm run dev` for development (with nodemon) or `npm start` for production

## API Documentation

Access the interactive API documentation at: `http://localhost:3001/api-docs`

## Initial Data

The API comes pre-loaded with sample data:
- **10 sample users** with various names and emails
- **30+ sample todos** distributed across different dates, priorities, and completion statuses

### Sample Users
- john@example.com (password: password123)
- jane@example.com (password: password123)
- bob@example.com (password: password123)
- alice@example.com (password: password123)
- charlie@example.com (password: password123)
- And 5 more users...

## API Endpoints

### Authentication

#### Register
- **POST** `/auth/register`
- Body: `{ "name": "string", "email": "string", "password": "string", "confirmPassword": "string" }`

#### Login
- **POST** `/auth/login`
- Body: `{ "email": "string", "password": "string" }`

### Todos (All require Authorization header: `Bearer <token>`)

#### Create Todo
- **POST** `/todos`
- Body: `{ "task": "string", "priority": "low|medium|high", "date": "YYYY-MM-DD" }`

#### Get Today's Todos
- **GET** `/todos/today?page=1&limit=10&task=search&priority=low`
- Query params: `page`, `limit`, `task` (filter), `priority` (filter)

#### Get Upcoming Todos
- **GET** `/todos/upcoming?page=1&limit=10&task=search&priority=low&date=2025-10-31`
- Query params: `page`, `limit`, `task`, `priority`, `date`

#### Get Completed Todos
- **GET** `/todos/completed?page=1&limit=10&task=search&priority=low`
- Query params: `page`, `limit`, `task`, `priority`

## Usage Example

You can use the pre-loaded sample users or register new ones:

1. Login with sample user:
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

2. Or register a new user:
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","confirmPassword":"password123"}'
```

3. Create a todo (use token from login):
```bash
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"task":"Finish project","priority":"high","date":"2025-10-31"}'
```

4. Get today's todos:
```bash
curl -X GET "http://localhost:3001/todos/today?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

5. Get upcoming todos:
```bash
curl -X GET "http://localhost:3001/todos/upcoming?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

6. Get completed todos:
```bash
curl -X GET "http://localhost:3001/todos/completed?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Notes

- Data is stored in memory and will be lost when server restarts
- JWT tokens expire in 24 hours
- Passwords are hashed using bcrypt
- All dates should be in YYYY-MM-DD format# practice-code-bedah-challenge-8-be
