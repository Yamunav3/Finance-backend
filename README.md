# Finance Dashboard Backend (MERN)

A role-based backend system for managing financial records and generating analytical insights.
Built using Node.js, Express, and MongoDB with secure authentication and structured APIs.

---

## Features

### Authentication

- User registration and login using JWT
- Secure password hashing with bcrypt

### Role-Based Access Control (RBAC)

- Admin -> Full access (users + records + dashboard)
- Analyst -> View records + dashboard insights
- Viewer -> View dashboard only

---

### Financial Records Management

- Create, update, delete financial records (Admin)
- View records (Admin, Analyst)
- Fields:
  - Amount
  - Type (income / expense)
  - Category
  - Date
  - Notes

---

### Dashboard Summary

Provides aggregated insights:

- Total Income
- Total Expenses
- Net Balance
- Category-wise totals
- Recent activity
- Monthly trends

---

### Search, Filter & Pagination

- Search:
  - Records -> category, notes
  - Users -> name, email, role
- Filters:
  - role, isActive (users)
  - type, category, date (records)
- Pagination support:
  - page, limit

---

### User Management (Admin Only)

- Create users (analyst/viewer)
- Update user role/status
- Bulk user creation
- Search users

---

### Additional Features

- Input validation using Zod
- Centralized error handling
- Soft delete support
- Clean project structure

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- bcrypt (Password hashing)
- Zod (Validation)

---

## Project Structure

```text
src/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── validators/
 ├── utils/
 ├── app.js
 └── server.js
```

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone <your-repo-link>
cd finance-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create `.env` file:

```env
PORT=8080
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

### 4. Run Server

```bash
node server.js
```

---

## Base URL

```text
http://localhost:8080/api/v1
```

---

## Authentication APIs

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| POST   | /auth/register | Register user    |
| POST   | /auth/login    | Login user       |
| GET    | /auth/me       | Get current user |

---

## User APIs (Admin Only)

| Method | Endpoint    | Description                            |
| ------ | ----------- | -------------------------------------- |
| POST   | /users      | Create user                            |
| POST   | /users/bulk | Bulk create users                      |
| GET    | /users      | Get users (search, filter, pagination) |
| GET    | /users/:id  | Get user by ID                         |
| PATCH  | /users/:id  | Update user                            |

### Example

```text
GET /users?search=analyst&isActive=true&page=1&limit=5
```

---

## Record APIs

| Method | Endpoint     | Access         |
| ------ | ------------ | -------------- |
| POST   | /records     | Admin          |
| GET    | /records     | Admin, Analyst |
| GET    | /records/:id | Admin, Analyst |
| PATCH  | /records/:id | Admin          |
| DELETE | /records/:id | Admin          |

### Example

```text
GET /records?search=salary&type=income
```

---

## Dashboard API

| Method | Endpoint           | Access                 |
| ------ | ------------------ | ---------------------- |
| GET    | /dashboard/summary | Admin, Analyst, Viewer |

---

## Role Permissions Summary

| Feature        | Admin | Analyst | Viewer |
| -------------- | ----- | ------- | ------ |
| Manage Users   | Yes   | No      | No     |
| Create Records | Yes   | No      | No     |
| View Records   | Yes   | Yes     | No     |
| Dashboard      | Yes   | Yes     | Yes    |

---

## Sample API Responses

### Login Response

```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "role": "admin"
  }
}
```

---

### Dashboard Response

```json
{
  "summary": {
    "totalIncome": 10000,
    "totalExpenses": 4000,
    "netBalance": 6000
  }
}
```

---

## Future Enhancements

- Rate limiting
- API documentation (Swagger)
- Unit testing
- Export reports (CSV)

---

## Author

Yamuna V.
B.Tech IT Student | Web Development Intern

---

## Conclusion

This project demonstrates:

- Backend architecture design
- Role-based security
- Data aggregation and analytics
- Real-world API development

---
