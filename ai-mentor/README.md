# AI Mentor

AI Mentor- An intelligent career guidance platform designed to empower students and professionals in their professional journey. This application provides personalized mentorship, placement preparation, and AI-driven tools to enhance career prospects.

## Key Features

-   **Mock Interview**: Practice interviews with an AI mentor to sharpen your communication and technical skills.
-   **Placement Prep**: Get curated resources and guidance for your upcoming placement season.
-   **Resume Analyzer**: Upload your resume and receive AI-powered feedback for improvements.
-   **Job Vacancy**: Explore career opportunities relevant to your profile.
-   **Career Roadmap**: Visualize your professional path with personalized milestones.
-   **Chat Mentor**: Interact with a dedicated AI career counselor for real-time advice.

## Tech Stack

-   **Frontend**: React 19, TypeScript, Tailwind CSS
-   **Routing**: React Router DOM 7
-   **Icons**: Lucide React
-   **AI Engine**: Google Gemini (via @google/genai)
-   **Animations**: Motion (Framer Motion)
-   **Markdown Rendering**: React Markdown

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   A Google Gemini API Key

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd ai-mentor
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    Create a `.env` file in the root directory and add your Gemini API Key:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

## Project Structure

-   `src/components`: Reusable UI components.
-   `src/pages`: Application views and route handlers.
-   `src/services`: API services and AI integration logic.
-   `src/types.ts`: TypeScript interfaces and types.

## License

MIT
