# AI Tutor – Final Project for Amana Bootcamp

**AI Tutor** is my final project for **Amana Bootcamp**. It is a web-based learning platform designed to help students study efficiently by combining lessons, quizzes, and progress tracking in one place. Users can upload lessons or paste text, generate quizzes, take them, and monitor their improvement over time.


## Features

- **User Authentication:** Register and log in to access a personalized dashboard.
- **Lesson Upload:** Upload a lesson file or paste the lesson text as an alternative.
- **Quiz Generation:** Select difficulty level and number of questions to generate quizzes automatically.
- **Quiz Interaction:** Move between questions, answer them, and submit for instant feedback.
- **Lesson Page:** View all quiz attempts with scores and timestamps, and reattempt quizzes.
- **Dashboard:** Displays recent lessons and basic statistics to track progress.
- **All Lessons Page:** Lists all lessons created by the user for easy review.

## Tech Stack

- **Frontend:** Next.js, React  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)  
- **Deployment:** Vercel  

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mai-Lahlouh/ai-tutor
2. Install dependencies:
   ```bash
   npm install
3. Set environment variables in .env (e.g., MongoDB URI, JWT secret).
4. Run the development server:
   ```bash
   npm run dev
6. Open http://localhost:3000 in your browser.


## Usage

1. Register or log in to the application.

2. From the dashboard:

    - Upload a lesson file or paste the lesson text.
  
    - Select difficulty level and number of questions.
  
    - Generate a quiz.

3. Take the quiz and submit for instant feedback.

4. Navigate to the lesson page to view all attempts, scores, and timestamps.

5. Reattempt quizzes as needed.

6. Explore the “All Lessons” page to review all uploaded lessons.

## Future Enhancements

- Fix File Upload Issue: Currently, running the Python script for converting uploaded files to text causes deployment issues on Vercel.

- Additional analytics and visualizations for student progress.

- Support for multiple file types and larger lessons.
  
## Contact
For any inquiries or feedback, please reach out to me at [Email](mailto:nlahlouh09@gmail.com).
  
## Author
Mai Lahlouh - 5th Dec, 2025
