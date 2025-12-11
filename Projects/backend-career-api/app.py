# app.py

from flask import Flask, jsonify, request
from flask_cors import CORS
import pdfplumber
import spacy
from spacy.matcher import Matcher

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# --- SPACY & MATCHER SETUP (Unchanged) ---
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model... (This might take a moment)")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

matcher = Matcher(nlp.vocab)
SKILL_LIST = [
    "python", "java", "c++", "javascript", "react", "react.js", "next.js",
    "tailwind css", "flask", "django", "mysql", "postgresql", "mongodb",
    "scikit-learn", "pandas", "numpy", "spacy", "nltk", "tensorflow", "keras",
    "aws", "docker", "git", "machine learning", "data analysis",
    "natural language processing", "nlp", "figma", "qa testing", "go", "swift", "kotlin", "ruby", "php", "sql",
    "adobe xd", "sketch", "jira", "selenium"
]
patterns = []
for skill in SKILL_LIST:
    patterns.append([{"LOWER": word} for word in skill.split()])
matcher.add("SKILL", patterns)
# --- END OF SETUP ---

# --- 1. NEW: CAREER & SKILL DATABASES ---

# Our "database" mapping careers to their required skills
CAREER_SKILLS_DB = {
    "Software Engineer": ["python", "git", "react", "mysql", "aws"],
    "Technical Project Manager": ["git", "react", "agile", "scrum"],
    "QA Engineer / Support Engineer": ["qa testing", "git", "javascript"],
    "UI/UX Designer": ["figma", "tailwind css", "javascript"],
    "Design Manager": ["figma", "agile", "project management"],
    "Data Scientist": ["python", "pandas", "scikit-learn", "tensorflow"],
    "Data Analyst": ["python", "pandas", "mysql", "tableau"],
    "General IT Consultant": ["aws", "python", "project management"],
    "Mobile Developer": ["swift", "kotlin", "react", "git"],
    "Backend Developer": ["go", "python", "sql", "docker", "aws"]
}

# Our "database" mapping skills to learning resources
SKILL_RESOURCES_DB = {
    "python": "https://www.coursera.org/learn/python-for-everybody",
    "git": "https://www.atlassian.com/git/tutorials/what-is-git",
    "react": "https://react.dev/learn",
    "mysql": "https://www.coursera.org/learn/sql-for-data-science",
    "aws": "https://aws.amazon.com/training/digital/",
    "agile": "https://www.atlassian.com/agile",
    "scrum": "https://www.scrum.org/resources/what-is-scrum",
    "qa testing": "https://www.guru99.com/software-testing-introduction-importance.html",
    "javascript": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    "figma": "https://www.figma.com/learn/",
    "tailwind css": "https://tailwindcss.com/docs/utility-first",
    "project management": "https://www.coursera.org/learn/project-management-basics",
    "pandas": "https://pandas.pydata.org/docs/user_guide/10min.html",
    "scikit-learn": "https://scikit-learn.org/stable/tutorial/basic/tutorial.html",
    "tensorflow": "https://www.tensorflow.org/tutorials",
    "tableau": "https://www.tableau.com/learn/training/2022-2",
    "sql": "https://www.w3schools.com/sql/",
    "jira": "https://www.atlassian.com/software/jira/guides"
}
# --- END OF NEW DATABASES ---


# --- RESUME UPLOAD ROUTE (Unchanged) ---
@app.route("/api/upload-resume", methods=['POST'])
def upload_resume():
    if 'resumeFile' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['resumeFile']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    if file:
        try:
            full_text = ""
            with pdfplumber.open(file) as pdf:
                for page in pdf.pages:
                    full_text += page.extract_text() + "\n"
            doc = nlp(full_text)
            matches = matcher(doc)
            found_skills = set()
            for match_id, start, end in matches:
                skill_text = doc[start:end].text
                found_skills.add(skill_text.lower())
            return jsonify({
                "message": "Skills extracted successfully!",
                "skills": list(found_skills)
            })
        except Exception as e:
            return jsonify({"error": f"Error processing PDF: {str(e)}"}), 500
    return jsonify({"error": "An unknown error occurred"}), 500


# --- TEST ROUTE (Unchanged) ---
@app.route("/api/test")
def test_route():
    return jsonify({
        "message": "Hello from the Python backend! 👋",
        "status": "success"
    })

# --- ROOT ROUTE (Unchanged) ---
@app.route("/")
def hello_world():
    return "Hello, this is the Python Backend!"


# --- 2. UPGRADED API ROUTE FOR QUIZ & GAP ANALYSIS ---
@app.route("/api/quiz-recommendation", methods=['POST'])
def handle_quiz_and_analysis():
    # --- 3. GET DATA FROM FRONTEND ---
    # We now expect 'answers' AND 'current_skills'
    data = request.json
    answers = data.get('answers', {})
    current_skills = data.get('current_skills', []) # Skills from the resume
    
    q1 = answers.get('q1')
    q2 = answers.get('q2')
    q4 = answers.get('q4')
    # --- 4. RECOMMENDATION LOGIC (Unchanged) ---
    recommendation = {
        "career": "General IT Consultant",
        "description": "You have a broad set of interests! A role as a consultant would let you try many different things."
    }
    if q1 == 'logic':
        if q2 == 'builder':
            recommendation = { "career": "Software Engineer", "description": "You enjoy solving logical problems and building things. This is a perfect fit for writing code!" }
        elif q2 == 'leader':
            recommendation = { "career": "Technical Project Manager", "description": "You like logic and organizing." }
        else:
            recommendation = { "career": "QA Engineer / Support Engineer", "description": "You like logic and finding problems." }
    elif q1 == 'creative':
        if q2 == 'builder':
            recommendation = { "career": "UI/UX Designer", "description": "You love design and building." }
        else:
            recommendation = { "career": "Design Manager", "description": "You have a creative mind and enjoy leading." }
    elif q1 == 'data':
        if q2 == 'builder':
            recommendation = { "career": "Data Scientist", "description": "You enjoy analyzing data and building models." }
        else:
            recommendation = { "career": "Data Analyst", "description": "You enjoy analyzing data and finding trends." }
            
    # --- 5. NEW: GAP ANALYSIS LOGIC ---
    recommended_career_name = recommendation['career']
    
    # Get the required skills from our new DB
    required_skills = CAREER_SKILLS_DB.get(recommended_career_name, [])
    
    # Use sets to find the gap
    current_set = set(current_skills)
    required_set = set(required_skills)
    
    skills_to_learn = list(required_set - current_set)
    known_skills = list(current_set.intersection(required_set))
    
    gap_analysis = {
        "known_skills": known_skills,
        "skills_to_learn": skills_to_learn
    }

    # --- 6. NEW: LEARNING ROADMAP BUILDER ---
    roadmap = []
    for skill in skills_to_learn:
        roadmap.append({
            "skill": skill,
            "resource": SKILL_RESOURCES_DB.get(skill, "https://www.google.com/search?q=how+to+learn+" + skill)
        })

    # --- 7. SEND FULL RESPONSE ---
    return jsonify({
        "recommendation": recommendation,
        "gap_analysis": gap_analysis,
        "roadmap": roadmap
    })
# --- END OF UPGRADED ROUTE ---


if __name__ == "__main__":
    app.run(debug=True)