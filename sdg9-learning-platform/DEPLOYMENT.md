# Deployment Guide: SDG 9 Learning Platform

This guide will walk you through deploying your MERN stack application with the Python AI service.

## Prerequisites
- [GitHub Account](https://github.com) (Push your code to a repository)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
- [Render Account](https://render.com)
- [Vercel Account](https://vercel.com)

---

## Step 1: Database (MongoDB Atlas)

1.  **Create a Cluster**: Log in to MongoDB Atlas and create a new **FREE (M0)** cluster.
2.  **Create User**: Go to "Database Access" and create a database user (e.g., `admin`) with a password. **Save this password.**
3.  **Network Access**: Go to "Network Access" and add IP Address `0.0.0.0/0` (Allow access from anywhere) so Render can connect.
4.  **Get Connection String**:
    *   Click **Connect** > **Drivers** > **Node.js**.
    *   Copy the string. It looks like: `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    *   Replace `<password>` with your actual password.

---

## Step 2: Backend (Render)

Since we have both Node.js and Python, we will deploy using **Docker**.

1.  **Push Code to GitHub**: Ensure your latest code (including the `Dockerfile` I just made) is on GitHub.
2.  **Create Web Service**:
    *   Go to Render Dashboard and click **New +** > **Web Service**.
    *   Connect your GitHub repository.
3.  **Configuration**:
    *   **Runtime**: Select **Docker**.
    *   **Region**: Choose one close to you (e.g., Singapore/India if available, or Frankfurt).
    *   **Branch**: `main` (or your working branch).
4.  **Environment Variables**:
    Scroll down to "Environment Variables" and add:
    *   `MONGO_URI`: (Paste your Atlas connection string from Step 1)
    *   `JWT_SECRET`: (Enter a strong random text, e.g., `mysecretkey123`)
    *   `PORT`: `5000`
    *   **(Optional)** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` if you have them.
5.  **Deploy**: Click **Create Web Service**. Render will build the Docker image (this takes a few minutes) and start the server.
6.  **Copy URL**: Once live, copy your backend URL (e.g., `https://sdg9-platform.onrender.com`).

---

## Step 3: Frontend (Vercel)

1.  **Import Project**:
    *   Go to Vercel Dashboard > **Add New...** > **Project**.
    *   Select your GitHub repository.
2.  **Configure Project**:
    *   **Framework Preset**: Vite (should be auto-detected).
    *   **Root Directory**: Click "Edit" and select `client`. **(Important!)**
3.  **Environment Variables**:
    *   Click "Environment Variables".
    *   Key: `VITE_API_URL`
    *   Value: Your Render Backend URL (e.g., `https://sdg9-platform.onrender.com` - **no trailing slash**)
4.  **Deploy**: Click **Deploy**.

---

## Troubleshooting

-   **Backend Crashes?** Check Render Logs. If it says "MongoNetworkError", check your Atlas "Network Access" IP whitelist (`0.0.0.0/0`).
-   **Frontend API Errors?** Open Browser Console (F12). If you see "CORS" errors or 404s, check if `VITE_API_URL` was set correctly in Vercel (re-deploy if you changed it).
-   **AI Not Working?** Check Render Logs to see if the Python script is failing. The Dockerfile installs dependencies, so it should work.

**That's it! Your app is live.**
