[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/LJGLCjRU)

# EnglishPath Backend Documentation

## Project Description

EnglishPath is a web platform designed to help users learn English in a fun, interactive, and efficient way. The backend provides RESTful APIs for managing courses, lessons, assignments, quizzes, users, and authentication.

## ERD (dbdiagram.io)

- ![Entity Relation Diagram](/photo/erd.png)
  [ERD LINK](https://dbdiagram.io/d/696a1e7fd6e030a0243eb9d5)

---

## List of Features

- User Authentication (Register/Login, Role-based access: Admin, Student)
- Personal Dashboard (Track progress, assignments, and courses)
- Course Management (Create, update, delete courses and lessons)
- Lesson & Assignment Management (Upload lessons, quizzes, and assignments)
- Admin Panel (Monitor users, courses, and progress)
- Notifications and reminders for tasks
- Gamification (Points, badges, and progress tracking)

---

## Tech Stack Used

- **Backend Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **File Uploads:** Multer
- **Validation:** class-validator & class-transformer
- **Deployment:** Railway

---

## Installation and Usage Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/englishpath-backend.git
cd englishpath-backend
```

### 2. Install Depedencies

```bash
npm install
```

### 3. Setup env variables

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/englishpath
JWT_SECRET=your_jwt_secret

```

### 4. Run Prisma Migration

```bash
npx prisma migrate dev
```

### 5. Start the server

```bash
npm run start:dev
```

## Deployment & Endpoind Docs (Wrapper) Links

1. [Deployment](crack-be-rizaldi87-production.up.railway.app)
2. [Wrapper js](crack-be-rizaldi87-production.up.railway.app/docs)
