
````markdown
# Reading Recommendation API

A backend API built with **NestJS** that allows users to log their reading intervals and get personalized book recommendations based on their reading habits.

---




## Features
---
* Role-based authentication using JWT, with two roles: `user` and `admin`.
* Only authenticated users can submit reading intervals.
* Only admin users can create and modify books.
* Each user can submit multiple intervals for the same book.
* Calculate the top 5 recommended books based on the number of unique pages read by all users.
* Protected endpoints using role-based access control.
* Logging and exception handling implemented to improve error reporting and debugging.
* Unit testing included to ensure the correctness of key functionalities.
* API implemented using NestJS and Prisma with PostgreSQL as the database.
* Project supports clean Git history and is structured for maintainability.
* Docker-ready setup for containerized deployment.
* Includes a `.md` file with setup and run instructions.
* Log user reading intervals for specific books (start page to end page).


---

Let me know if you’d like to break this into sections (e.g., core features vs. bonus), or customize it for your README.


---

## Tech Stack

- **Backend Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker & Docker Compose

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/reading-recommendation-api.git
cd reading-recommendation-api
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root with:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/reading_db
JWT_SECRET=your_jwt_secret
```

### 4. Migrate your database

```bash
npx prisma migrate dev --name init
```

### 5. Run development server

```bash
npm run start:dev
```

---

## Run with Docker

```bash
docker-compose up --build
```

This will spin up:

* NestJS app on `localhost:3000`
* PostgreSQL on `localhost:5432`

---

## Authentication

### Register `POST /auth/register`

```json
{
  "email": "email@gmail.com",
  "username": "user1",
  "password": "password",
  "role": "user"
}
```

### Login `POST /auth/login`

```json
{
  "username": "user1",
  "password": "password"
}
```

Response:

```json
{
  "access_token": "<your JWT token>"
}
```

---

## Books API

All endpoints require the JWT `access_token` in the `Authorization` header as:

```
Authorization: Bearer <token>
```

### Create Books `POST /books`

```json
{
  "name": "book name",
  "numOfPages": 464
}
```

---

## Intervals API

All endpoints require the JWT `access_token` in the `Authorization` header as:

```
Authorization: Bearer <token>
```

### Create Reading Interval `POST /intervals`

```json
{
  "bookId": 1,
  "startPage": 10,
  "endPage": 30
}
```

### Get Recommended Books `GET /recommendations`

Returns the top 5 books based on unique pages read.

---

## Project Structure

```
src/
├── auth/               → Auth logic (JWT, Guards, Strategies)
├── users/              → User module
├── intervals/          → Interval module
├── prisma/             → Prisma client service
├── recommendations/    → Recommendation logic
```

---

## Author

Made by Mohamed Essam

```

Let me know if you want me to add or adjust anything else!
```
