"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // --- SECURITY CHECK: IS EMAIL VERIFIED? ---
      if (!user.emailVerified) {
        // If not verified, sign them out immediately so they can't enter
        await signOut(auth);
        setError("Please verify your email address before logging in. Check your inbox.");
        return; 
      }
      // ------------------------------------------

      console.log("User logged in:", user);
      router.push('/dashboard');

    } catch (firebaseError: any) {
      if (firebaseError.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else {
        setError(firebaseError.message);
      }
    }
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: '#f9fafb',
        // Minimal Grid Pattern
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10h20M10 0v20' stroke='%23cbd5e1' stroke-width='1' fill='none' fill-rule='evenodd' stroke-opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg z-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
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
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}