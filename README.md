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


## Test User Accounts

Use the following accounts to test the deployed Online Course Service.

### Student Accounts

| User | Email | Password | Role |
|---|---|---|---|
| Student 1 | `student1@example.com` | `Student123!` | Student |
| Student 2 | `student2@example.com` | `Student123!` | Student |
| Student 3 | `student3@example.com` | `Student123!` | Student |

### Teacher Accounts

| User | Email | Password | Role |
|---|---|---|---|
| Teacher 1 | `teacher1@example.com` | `Teacher123!` | Teacher |
| Teacher 2 | `teacher2@example.com` | `Teacher123!` | Teacher |
| Teacher 3 | `teacher3@example.com` | `Teacher123!` | Teacher |

### How to Test

1. Open the application: https://online-course-frontend-three.vercel.app/#/login
2. Sign in using one of the accounts above.
3. Test the features available to that role.

**Student testing**
- View available courses.
- Filter courses by course or teacher name, if implemented.
- View course details.
- Enroll in an open course with available seats.
- View enrolled courses.

**Teacher testing**
- Create a course.
- View and update courses created by that teacher.
- View enrolled students.
- Test course deletion according to the enrollment rules.

**Note:** These are the intended test credentials configured for this project. Verify that each account can successfully log in to the deployed application before submission.
