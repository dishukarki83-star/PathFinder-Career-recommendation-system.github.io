"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // We use this to greet the user

export default function DashboardPage() {
  const { user } = useAuth(); // Get the currently logged-in user

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  // We remove uploadSuccess, as isResumeUploaded does the same job
  
  // This state now checks localStorage, so if you've uploaded before, it remembers
  const [isResumeUploaded, setIsResumeUploaded] = useState(() => {
    if (typeof window !== 'undefined') {
      // The '!!' turns the string (or null) into a true/false boolean
      return !!localStorage.getItem('userSkills');
    }
    return false;
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleResumeUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append('resumeFile', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/upload-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      localStorage.setItem('userSkills', JSON.stringify(data.skills));
      setIsResumeUploaded(true); // Update state to show the quiz card

    } catch (error: any) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    // We update the main container to center the single card
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {user ? (user.displayName || user.email) : 'User'}!
        </h1>
      </div>

      {/* This new div will center the content and grow to fill the space */}
      <div className="flex-grow flex items-center justify-center">
        {/* --- Adjusted width to be responsive --- */}
        <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2"> 
          
          {/* --- THIS IS THE NEW LOGIC ---
            We use a ternary operator to show ONE card at a time.
          */}

          {!isResumeUploaded ? (
            
            // --- 1. IF RESUME IS NOT UPLOADED, SHOW THIS ---
            <form onSubmit={handleResumeUpload} className="bg-white p-8 rounded-lg shadow-lg space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700 text-center">
                Step 1: Upload Your Resume
              </h2>
              
              <p className="text-gray-600 text-center">
                Upload your resume (PDF only) and let our AI analyze it.
              </p>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                className="block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={isUploading || !selectedFile}
              >
                {isUploading ? "Analyzing..." : "Analyze Resume"}
              </button>
              {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
            </form>

          ) : (

            // --- 2. IF RESUME IS UPLOADED, SHOW THIS INSTEAD ---
            <div 
              className={`bg-white p-8 rounded-lg shadow-lg flex flex-col text-center
                          animate-pulse-slow border-2 border-green-500`}
            >
              <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 className="text-xl font-semibold text-gray-700 mt-3">Upload Successful!</h3>
              <p className="text-gray-600 mt-2 mb-6">
                Your skills have been analyzed. You're ready for the next step!
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Step 2: Discover Your Path
              </h2>
              <Link href="/dashboard/quiz">
                <button 
                  className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                >
                  Start Quiz
                </button>
              </Link>
            </div>
          )}
          {/* --- END OF NEW LOGIC --- */}

        </div>
      </div>
    </main>
  );
}