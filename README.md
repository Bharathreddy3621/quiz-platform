# Quiz Platform

A modern full-stack quiz application for creating exams, managing questions, tracking attempts, and reviewing results.

Built with a Bootstrap-powered React frontend and an Express/MongoDB backend.

## Overview

This project provides a clean exam experience for both students and admins:

- Students can log in, take timed exams, and review their results.
- Admins can create exams, manage questions, and review all submissions.
- The UI is responsive and styled with Bootstrap for a polished dashboard feel.

## Features

- Secure user registration and login
- Admin exam management
- Question add/edit/delete flow
- Timed exam-taking experience
- Automatic result submission
- User and admin reports
- Responsive Bootstrap UI

## Tech Stack

- Frontend: React, Bootstrap, Redux
- Backend: Node.js, Express
- Database: MongoDB
- Auth: JWT

## Project Structure

```text
client/   React frontend
server/   Express backend
```

## Requirements

- Node.js 18+
- MongoDB

## Environment Variables

Create `server/.env` using the example file:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Local Setup

### 1. Start the server

```bash
cd server
npm install
npm start
```

### 2. Start the client

```bash
cd client
npm install
npm start
```

The client runs on `http://localhost:3000` and the server runs on `http://localhost:5000`.

## Production Build

```bash
cd client
npm run build
```

## Screens at a Glance

- Login and registration pages
- Admin dashboard for exams and reports
- Question editor modal
- Student exam flow with timer and review

## GitHub Repository Details

If you want to set the repository metadata in GitHub settings, use:

- Description: `A modern full-stack quiz application for creating exams, managing questions, tracking attempts, and reviewing results.`
- Topics: `react`, `bootstrap`, `nodejs`, `express`, `mongodb`, `redux`, `jwt`, `quiz-app`, `exam-management`, `full-stack`

## Notes

- Do not commit `server/.env`
- The root `.gitignore` already excludes local installs, builds, and logs
