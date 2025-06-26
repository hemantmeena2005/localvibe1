# LocalVibe

A social events platform built with Next.js, Express.js, and MongoDB.

## Project Structure

- `client/` - Next.js frontend application
- `server/` - Express.js backend API

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd localvibe
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001

## Deployment

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and create an account
3. Import your repository
4. Set the root directory to `client`
5. Add environment variable:
   - `API_URL`: Your backend URL (e.g., `https://your-app.railway.app`)

#### Backend (Railway)
1. Go to [Railway](https://railway.app) and create an account
2. Import your repository
3. Set the root directory to `server`
4. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`
   - `PORT`: Railway will set this automatically

### Option 2: Render

#### Frontend
1. Go to [Render](https://render.com)
2. Create a new Static Site
3. Connect your GitHub repo
4. Set build command: `cd client && npm install && npm run build`
5. Set publish directory: `client/.next`

#### Backend
1. Create a new Web Service
2. Connect your GitHub repo
3. Set root directory to `server`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables as above

### Option 3: Heroku

#### Frontend
1. Go to [Heroku](https://heroku.com)
2. Create a new app
3. Connect your GitHub repo
4. Set buildpacks for Node.js
5. Set environment variables

#### Backend
1. Create a new app
2. Connect your GitHub repo
3. Add MongoDB add-on
4. Set environment variables

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/localvibe
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
PORT=5001
```

### Frontend
```
API_URL=http://localhost:5001
```

## Features

- User authentication and registration
- Create and manage events (vibes)
- Real-time chat for events
- Interactive map integration
- User profiles and RSVPs

## Tech Stack

- **Frontend**: Next.js, React, Mantine UI
- **Backend**: Express.js, Socket.io
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Real-time**: Socket.io
- **Maps**: Leaflet 