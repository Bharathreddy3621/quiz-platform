# Quiz Application

A full-stack quiz platform with a Bootstrap UI on the client and an Express/MongoDB API on the server.

## Project Layout

- `client/` React app
- `server/` Express app

## Requirements

- Node.js 18+
- MongoDB

## Local Setup

### Server

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Install and run:

```bash
cd server
npm install
npm start
```

### Client

```bash
cd client
npm install
npm start
```

The client runs on `http://localhost:3000` and the server runs on `http://localhost:5000`.

## Publish to GitHub

After creating a new repository in your GitHub account, run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Notes

- Do not commit `server/.env`.
- The root `.gitignore` already excludes local installs, builds, and logs.
