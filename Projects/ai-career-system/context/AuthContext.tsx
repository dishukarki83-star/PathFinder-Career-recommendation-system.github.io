// context/AuthContext.tsx

"use client"; // This must be a client component

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Import your Firebase auth service

// Define the shape of your context data
type AuthContextType = {
  user: User | null; // The Firebase user object
  loading: boolean;  // To show a loading spinner
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the "Provider" component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is the core of Firebase Auth:
    // It listens for changes in the user's login state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
  };

  // We return the provider with the value, only showing children when not loading
  // or you could show a global spinner here
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Create a custom "hook" to easily use the context in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};