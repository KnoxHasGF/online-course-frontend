# Online Course Service — Frontend

## Project Overview
React frontend for the Online Course Service.

## Technologies
- React
- Vite
- React Router
- Fetch API

## Requirements
- Node.js and npm
- A running backend API

## Environment Variables
Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

For the deployed frontend, configure `VITE_API_URL` in Vercel to point to the deployed backend URL.

## Run Locally
1. Clone this repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the `.env` file.
4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL shown by Vite, normally `http://localhost:5173`.

## Main Features
### Student
- Sign in and view available courses
- View course details
- Enroll in eligible courses
- View enrolled courses

### Teacher
- Sign in and manage own courses
- Create, update, and delete courses
- View enrolled students

## Deployment
Frontend: https://online-course-frontend-three.vercel.app/#/login

## Test Accounts
Use the test credentials provided in the project documentation.
