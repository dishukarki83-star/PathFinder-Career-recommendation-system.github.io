"use client"; 

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; 
import { auth } from '@/lib/firebase';           
import { signOut } from 'firebase/auth';        
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 5. Create a logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      
      // --- THIS IS THE NEW LINE ---
      // Clear the resume data when the user logs out
      localStorage.removeItem('userSkills');
      // ----------------------------
      
      // User is logged out, redirect to homepage
      router.push('/'); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          PathFinder
        </Link>
        <div>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : user ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-500 px-3 py-2">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white rounded hover:bg-red-600 px-4 py-2 ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/" className="text-gray-600 hover:text-blue-500 px-3 py-2">
                Home
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-blue-500 px-3 py-2">
                Login
              </Link>
              <Link href="/signup" className="bg-blue-500 text-white rounded hover:bg-blue-600 px-4 py-2 ml-2">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
