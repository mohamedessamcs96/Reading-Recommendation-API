Here's a complete and well-structured `README.md` file tailored for your **Reading Recommendation API** using **NestJS**, **Prisma**, **PostgreSQL**, and **JWT Authentication**:

---

````markdown
#  Reading Recommendation API

A backend API built with **NestJS** that allows users to log their reading intervals and get personalized book recommendations based on their reading habits.

---

##  Features

-  Log reading intervals (start page - end page) per book.
-  Role-based authentication (`user`, `admin`) via JWT.
-  Protected endpoints for authorized users.
-  Automatically recommend top 5 books with the most pages read.

---

##  Tech Stack

- **Backend Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker & Docker Compose

---

##  Local Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/reading-recommendation-api.git
cd reading-recommendation-api
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env` file in the root with:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/reading_db
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Migrate your database

```bash
npx prisma migrate dev --name init
```

### 5️⃣ Run development server

```bash
npm run start:dev
```

---

##  Run with Docker

```bash
docker-compose up --build
```

This will spin up:

* NestJS app on `localhost:3000`
* PostgreSQL on `localhost:5432`

---

##  Authentication

###  Register

`POST /auth/register`

```json
{
  "email":"email@gmail.com",
  "username": "user1",
  "password": "password",
  "role": "user"
}
```

###  Login

`POST /auth/login`

```json
{
  "username": "user1",
  "password": "password"
}
```

*Response:*

```json
{
  "access_token": "<your JWT token>"
}
```



---
##  Books API

 All endpoints require the JWT `access_token` in the `Authorization` header as:

```
Authorization: Bearer <token>
```

###  Create Books

`POST /books`

```json
{
  "name": "book name",
  "numOfPages": 464
}

```

---

##  Intervals API

 All endpoints require the JWT `access_token` in the `Authorization` header as:

```
Authorization: Bearer <token>
```

###  Create Reading Interval

`POST /intervals`

```json
{
  "bookId": 1,
  "startPage": 10,
  "endPage": 30
}
```




###  Get Recommended Books

`GET /recommendations`

Returns the **top 5 books** based on unique pages read.

---

##  Project Structure

```
src/
│
├── auth/               → Auth logic (JWT, Guards, Strategies)
├── users/              → User module
├── intervals/          → Interval module
├── prisma/             → Prisma client service
├── recommendations/    → Recommendation logic
```



---

##  Author

Made with ❤️ by Mohamed Essam

---
