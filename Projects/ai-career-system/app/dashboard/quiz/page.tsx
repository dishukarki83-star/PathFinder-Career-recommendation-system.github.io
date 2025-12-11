"use client"; 

import { useState, FormEvent } from 'react';

// --- (The types are the same as before) ---
type Recommendation = {
  career: string;
  description: string;
};
type GapAnalysis = {
  known_skills: string[];
  skills_to_learn: string[];
};
type RoadmapItem = {
  skill: string;
  resource: string;
};

export default function QuizPage() {
  // --- STATE WITH 4 QUESTIONS ---
  const [answers, setAnswers] = useState({ 
    q1: '', 
    q2: '', 
    q3: '',
    q4: '' // 4th question
  });
  // ------------------------------

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnswers(prevAnswers => ({ ...prevAnswers, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setRecommendation(null);
    setGapAnalysis(null);
    setRoadmap([]);

    const savedSkills = localStorage.getItem('userSkills');
    const current_skills = savedSkills ? JSON.parse(savedSkills) : [];

    try {
      const response = await fetch('http://127.0.0.1:5000/api/quiz-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers: answers, 
          current_skills: current_skills 
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to get analysis.");
      }
      setRecommendation(data.recommendation);
      setGapAnalysis(data.gap_analysis);
      setRoadmap(data.roadmap);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-3xl"> {/* Made container wider */}
        
        {/* --- 1. THE QUIZ --- */}
        {!recommendation && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Career Aptitude Quiz
            </h1>
            <p className="text-gray-600 mb-8">
              Answer these questions to help us understand your interests.
            </p>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-8">
              
              {/* Question 1 */}
              <fieldset disabled={isLoading}>
                <legend className="text-lg font-semibold text-gray-700 mb-2">1. Which activity sounds more interesting?</legend>
                <div className="space-y-2">
                  <label className="flex items-center"><input type="radio" name="q1" value="logic" onChange={handleChange} required className="mr-2" />Solving logical puzzles.</label>
                  <label className="flex items-center"><input type="radio" name="q1" value="creative" onChange={handleChange} required className="mr-2" />Designing a beautiful poster.</label>
                  <label className="flex items-center"><input type="radio" name="q1" value="data" onChange={handleChange} required className="mr-2" />Analyzing data trends.</label>
                </div>
              </fieldset>

              {/* Question 2 */}
              <fieldset disabled={isLoading}>
                <legend className="text-lg font-semibold text-gray-700 mb-2">2. What role do you prefer?</legend>
                <div className="space-y-2">
                  <label className="flex items-center"><input type="radio" name="q2" value="leader" onChange={handleChange} required className="mr-2" />Organizing and leading.</label>
                  <label className="flex items-center"><input type="radio" name="q2" value="builder" onChange={handleChange} required className="mr-2" />Building the core project.</label>
                  <label className="flex items-center"><input type="radio" name="q2" value="support" onChange={handleChange} required className="mr-2" />Testing and finding problems.</label>
                </div>
              </fieldset>

              {/* Question 3 */}
              <fieldset disabled={isLoading}>
                <legend className="text-lg font-semibold text-gray-700 mb-2">3. What is your ideal environment?</legend>
                <div className="space-y-2">
                  <label className="flex items-center"><input type="radio" name="q3" value="structured" onChange={handleChange} required className="mr-2" />Stable, corporate environment.</label>
                  <label className="flex items-center"><input type="radio" name="q3" value="startup" onChange={handleChange} required className="mr-2" />Fast-paced, flexible startup.</label>
                  <label className="flex items-center"><input type="radio" name="q3" value="remote" onChange={handleChange} required className="mr-2" />Working remotely.</label>
                </div>
              </fieldset>
              
              {/* Question 4 */}
              <fieldset disabled={isLoading}>
                <legend className="text-lg font-semibold text-gray-700 mb-2">4. How much do you enjoy interacting with end-users?</legend>
                <div className="space-y-2">
                  <label className="flex items-center"><input type="radio" name="q4" value="user_facing" onChange={handleChange} required className="mr-2" />A lot. I want to understand their needs.</label>
                  <label className="flex items-center"><input type="radio" name="q4" value="team_facing" onChange={handleChange} required className="mr-2" />A little. I prefer collaborating with my team.</label>
                  <label className="flex items-center"><input type="radio" name="q4" value="task_facing" onChange={handleChange} required className="mr-2" />Very little. I prefer to focus on the task.</label>
                </div>
              </fieldset>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
              >
                {isLoading ? "Analyzing..." : "Get My Career Analysis"}
              </button>
            </form>
          </>
        )}
        
        {isLoading && <p className="text-center mt-4">Generating your full report...</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {/* --- 2. THE NEW, STYLED REPORT --- */}
        {recommendation && gapAnalysis && (
          <div className="bg-white p-8 rounded-xl shadow-2xl space-y-8">
            
            {/* --- Report Header --- */}
            <div className="text-center">
              <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Your Personal Career Report
              </h2>
              <h3 className="mt-2 text-4xl font-bold text-gray-800">
                {recommendation.career}
              </h3>
              <p className="mt-3 text-lg text-gray-600">
                {recommendation.description}
              </p>
            </div>

            <hr />

            {/* --- Skill Gap Analysis --- */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Your Skill Gap Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Skills You Have */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800">Skills You Have</h4>
                  <p className="text-sm text-green-600 mb-3">
                    Found on your resume, matching this career path.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {gapAnalysis.known_skills.length > 0 ? (
                      gapAnalysis.known_skills.map((skill, i) => (
                        <span key={i} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full">{skill}</span>
                      ))
                    ) : <p className="text-sm text-gray-500">None of your current skills match this path.</p>}
                  </div>
                </div>

                {/* Skills To Learn */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800">Skills To Learn</h4>
                  <p className="text-sm text-blue-600 mb-3">
                    These are the skills you should focus on next.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {gapAnalysis.skills_to_learn.length > 0 ? (
                      gapAnalysis.skills_to_learn.map((skill, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full">{skill}</span>
                      ))
                    ) : <p className="text-sm text-gray-500">You have all the required skills!</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* --- Learning Roadmap --- */}
            {roadmap.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Your Learning Roadmap
                </h3>
                <ul className="space-y-3">
                  {roadmap.map((item, i) => (
                    <li key={i} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center transition hover:bg-gray-100">
                      <span className="font-semibold text-gray-700 capitalize">
                        {item.skill}
                      </span>
                      <a 
                        href={item.resource} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm bg-blue-500 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-600"
                      >
                        Learn
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}
      </div>
    </main>
  );
}
