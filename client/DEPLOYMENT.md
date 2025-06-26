# LocalVibe Deployment Guide

This guide will walk you through deploying your LocalVibe application to production.

## Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **MongoDB Database**: Set up a MongoDB database (MongoDB Atlas recommended)
3. **Environment Variables**: Prepare your production environment variables

## Option 1: Vercel + Railway (Recommended - Free Tier Available)

### Step 1: Deploy Backend to Railway

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your LocalVibe repository

3. **Configure Project**
   - Set the root directory to `server`
   - Railway will automatically detect it's a Node.js project

4. **Add Environment Variables**
   - Go to the "Variables" tab
   - Add the following variables:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/localvibe
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   NODE_ENV=production
   ```

5. **Deploy**
   - Railway will automatically deploy when you push changes
   - Note your deployment URL (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Set the root directory to `client`

3. **Configure Environment Variables**
   - Add the following environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-app.railway.app
   NEXT_PUBLIC_SOCKET_URL=https://your-app.railway.app
   ```

4. **Deploy**
   - Vercel will automatically build and deploy your Next.js app
   - Your app will be available at `https://your-app.vercel.app`

### Step 3: Update CORS Settings

1. **Update Backend CORS**
   - In your `server/index.js`, update the CORS origins:
   ```javascript
   app.use(cors({ 
     origin: process.env.NODE_ENV === 'production' 
       ? ['https://your-app.vercel.app']
       : 'http://localhost:3000', 
     credentials: true 
   }));
   ```

2. **Redeploy Backend**
   - Push the changes to GitHub
   - Railway will automatically redeploy

## Option 2: Render (Alternative - Free Tier Available)

### Backend Deployment on Render

1. **Sign up for Render**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set root directory to `server`

3. **Configure Service**
   - **Name**: `localvibe-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add Environment Variables**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/localvibe
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   NODE_ENV=production
   ```

### Frontend Deployment on Render

1. **Create Static Site**
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Set root directory to `client`

2. **Configure Build**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `client/.next`

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
   ```

## Option 3: Heroku (Paid Option)

### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-localvibe-backend
   ```

3. **Add MongoDB Add-on**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-super-secure-jwt-secret-key-here
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git subtree push --prefix server heroku main
   ```

### Frontend Deployment

1. **Create Heroku App**
   ```bash
   heroku create your-localvibe-frontend
   ```

2. **Set Buildpacks**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com
   heroku config:set NEXT_PUBLIC_SOCKET_URL=https://your-backend.herokuapp.com
   ```

4. **Deploy**
   ```bash
   git subtree push --prefix client heroku main
   ```

## MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up for a free account

2. **Create Cluster**
   - Choose the free tier (M0)
   - Select your preferred cloud provider and region

3. **Configure Database Access**
   - Create a database user with read/write permissions
   - Note the username and password

4. **Configure Network Access**
   - Add `0.0.0.0/0` to allow connections from anywhere
   - Or add specific IP addresses for better security

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

## Environment Variables Reference

### Backend (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/localvibe
JWT_SECRET=your-super-secure-jwt-secret-key-here
NODE_ENV=production
PORT=5001
```

### Frontend
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.com
```

## Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Test creating and managing vibes
- [ ] Test real-time chat functionality
- [ ] Test RSVP functionality
- [ ] Verify all API endpoints work
- [ ] Check mobile responsiveness
- [ ] Test map integration
- [ ] Verify environment variables are set correctly

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your backend CORS settings include your frontend domain
   - Check that environment variables are set correctly

2. **Database Connection Issues**
   - Verify your MongoDB connection string
   - Check that your IP is whitelisted in MongoDB Atlas

3. **Build Failures**
   - Check that all dependencies are in package.json
   - Verify Node.js version compatibility

4. **Environment Variables Not Working**
   - Ensure frontend variables start with `NEXT_PUBLIC_`
   - Redeploy after changing environment variables

### Getting Help

- Check the deployment platform's logs for error messages
- Verify all environment variables are set correctly
- Test locally with production environment variables
- Check the browser console for frontend errors 