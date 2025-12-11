"use client"; 

import Link from 'next/link';
// We will use a regular <img> tag for simplicity, so no 'next/image' import needed
import { useAuth } from '@/context/AuthContext'; 

export default function HomePage() {
  const { user } = useAuth(); 

  return (
    // Main container
    <div className="flex flex-col items-center justify-center flex-grow p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      
      {/* --- New Two-Column Layout --- */}
      {/* This div will center and constrain the content */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">

        {/* Column 1: Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0 md:pr-12">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            Find Your <span className="text-blue-600">Perfect Career</span> Path
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-12">
            Stop guessing. Use the power of AI to analyze your skills and interests. 
            Get a personalized roadmap to your dream job, complete with courses 
            and resources.
          </p>

          <Link 
            href={user ? "/dashboard" : "/signup"}
            className="bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            {user ? "Go to Your Dashboard" : "Get Started for Free"}
          </Link>
        </div>

        {/* --- 2. UPDATE THE IMAGE TAG --- */}
        <div className="w-full md:w-1/2 flex justify-center">
          {/* This is a direct link to the raw image file. 
            This will fix the error.
          */}
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=500&fit=crop"
            alt="Person sketching a visionary career plan" 
            className="rounded-lg shadow-2xl"
            width={500} 
            height={500} 
          />
        </div>

      </div>
    </div>
  );
}