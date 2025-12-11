"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false); // New state to track success
  const router = useRouter();

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update profile with name
      await updateProfile(user, { displayName: name });

      // 3. Send Verification Email
      await sendEmailVerification(user);

      // 4. Sign them out immediately (so they can't access dashboard yet)
      await signOut(auth);

      // 5. Show the success message
      setVerificationSent(true);

    } catch (firebaseError: any) {
      setError(firebaseError.message);
    }
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: '#f9fafb',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10h20M10 0v20' stroke='%23cbd5e1' stroke-width='1' fill='none' fill-rule='evenodd' stroke-opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg z-10">
        
        {/* --- NEW SUCCESS UI --- */}
        {verificationSent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify your email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to <strong>{email}</strong>.<br/>
              Please check your inbox and verify your account to log in.
            </p>
            <Link href="/login" className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
              Go to Login
            </Link>
          </div>
        ) : (
          /* --- STANDARD SIGN UP FORM (UNCHANGED) --- */
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Create Your Account
            </h2>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Up
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Log In
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}