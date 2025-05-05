# Creator Dashboard

A full-stack dashboard application for managing content creators, built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**. The backend is deployed on **Google Cloud Run**, and the frontend is hosted on **Firebase Hosting**.

---

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Admin Panel**: Manage users, view analytics, and update user credits.
- **Content Integration**: Fetch and display top posts from Reddit and Twitter.
- **Responsive Design**: Built with **Tailwind CSS** for a seamless experience across devices.
- **CORS Support**: Configured to allow requests from both local development and production environments.

---

## Instructions to Run Locally

### Prerequisites

- **Node.js** (v16 or later)
- **npm** (v8 or later)
- **MongoDB** (local or cloud instance)
- **Firebase CLI** (for frontend deployment)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd dashboard/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory and add the following environment variables:
   ```env
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   PORT=8080
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:8080`.

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`.

---

## Deployment Steps

### Backend Deployment (Google Cloud Run)

1. Ensure the `Dockerfile` is in the `backend` directory.
2. Authenticate with Google Cloud:
   ```bash
   gcloud auth login
   ```
3. Set your Google Cloud project:
   ```bash
   gcloud config set project <PROJECT_ID>
   ```
4. Deploy the backend to Google Cloud Run:
   ```bash
   gcloud run deploy backend-service \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

   Note the deployed backend URL (e.g., `https://backend-service-xyz.a.run.app`).

---

### Frontend Deployment (Firebase Hosting)

1. Build the React app:
   ```bash
   npm run build
   ```

2. Initialize Firebase Hosting (if not already done):
   ```bash
   firebase init hosting
   ```

   - Set the public directory to `build`.
   - Configure as a single-page app (rewrite all routes to `index.html`).

3. Deploy to Firebase Hosting:
   ```bash
   firebase deploy
   ```

   The app will be live at `https://<PROJECT_ID>.web.app`.

---

## Troubleshooting

- **CORS Errors**: Ensure the backend allows requests from both `http://localhost:5173` and `https://<PROJECT_ID>.web.app`.
- **MongoDB Connection Issues**: Verify the `MONGO_URI` in the `.env` file.
- **Build Errors**: Ensure all dependencies are installed and the `Dockerfile` is correctly configured.

---

## License# Creator Dashboard

A full-stack dashboard application for managing content creators, built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**. The backend is deployed on **Google Cloud Run**, and the frontend is hosted on **Firebase Hosting**.

---

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Admin Panel**: Manage users, view analytics, and update user credits.
- **Content Integration**: Fetch and display top posts from Reddit and Twitter.
- **Responsive Design**: Built with **Tailwind CSS** for a seamless experience across devices.
- **CORS Support**: Configured to allow requests from both local development and production environments.

---

## Instructions to Run Locally

### Prerequisites

- **Node.js** (v16 or later)
- **npm** (v8 or later)
- **MongoDB** (local or cloud instance)
- **Firebase CLI** (for frontend deployment)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd dashboard/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory and add the following environment variables:
   ```env
   MONGO_URI=<your-mongodb-connection-string>
  _SECRET=<your-jwt-secret>
   PORT=8080
   ```

4. Start the backend server:
   ```bash
   node index.js
   ```

   The backend will run on `http://localhost:5173`.

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`.

---

## Deployment Steps

### Backend Deployment (Google Cloud Run)

1. Ensure the `Dockerfile` is in the `backend` directory.
2. Authenticate with Google Cloud:
   ```bash
   gcloud auth login
   ```
3. Set your Google Cloud project:
   ```bash
   gcloud config set project <PROJECT_ID>
   ```
4. Deploy the backend to Google Cloud Run:
   ```bash
   gcloud run deploy backend-service \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

   Note the deployed backend URL (e.g., `https://backend-service-xyz.a.run.app`).

---

### Frontend Deployment (Firebase Hosting)

1. Build the React app:
   ```bash
   npm run build
   ```

2. Initialize Firebase Hosting (if not already done):
   ```bash
   firebase init hosting
   ```

   - Set the public directory to `build`.
   - Configure as a single-page app (rewrite all routes to `index.html`).

3. Deploy to Firebase Hosting:
   ```bash
   firebase deploy
   ```

   The app will be live at `https://<PROJECT_ID>.web.app`.

---

## Troubleshooting

- **CORS Errors**: Ensure the backend allows requests from both `http://localhost:5173` and `https://<PROJECT_ID>.web.app`.
- **MongoDB Connection Issues**: Verify the `MONGO_URI` in the `.env` file.
- **Build Errors**: Ensure all dependencies are installed and the `Dockerfile` is correctly configured.

---
