# PathFinder-Career-recommendation-system.github.io
PathFinder: AI-Based Career &amp; Skill Recommendation System

🚀 Overview

PathFinder is an AI-powered web application designed to bridge the gap between students' current skills and industry requirements. Unlike traditional job portals, PathFinder offers a holistic approach by combining Hard Skills Analysis (via Resume Parsing) and Soft Skills Assessment (via an Aptitude Quiz) to provide a personalized career roadmap.

✨ Key Features

📄 AI Resume Parsing: Automatically extracts technical skills from PDF resumes using NLP (SpaCy & PDFPlumber).

🧠 Aptitude Quiz: A logic-based quiz to assess work-style preferences (e.g., Creative vs. Analytical).

🎯 Smart Recommendations: Suggests the best-fit job roles (e.g., "Frontend Engineer", "Data Scientist") based on both skills and interest.

📊 Skill Gap Analysis: Identifies exactly which skills a user is missing for their target role.

🗺️ Learning Roadmap: Generates a step-by-step learning path with curated resources.

🔒 Secure Authentication: Robust user management with Email Verification via Firebase.

🛠️ Tech Stack

Frontend: Next.js (React Framework), Tailwind CSS

Backend: Python Flask

AI/NLP: SpaCy, PDFPlumber

Authentication: Firebase Auth

📸 Screenshots

Login Page

User Dashboard





Resume Analysis

Final Career Report





(Add your actual screenshots to a screenshots folder and update the paths above)

⚙️ Installation & Setup

Prerequisites

Node.js & npm

Python 3.8+

A Firebase Project (for API keys)

1. Clone the Repository

cd PathFinder

2. Frontend Setup

cd ai-career-system
npm install
# Create a lib/firebase.ts file with your Firebase config
npm run dev


3. Backend Setup

cd backend-career-api
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py


🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

📄 License

This project is open-source and available under the MIT License.

Developed by [Your Name]
