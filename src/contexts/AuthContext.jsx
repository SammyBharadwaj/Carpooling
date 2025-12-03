import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      console.log('🔐 Auth state changed:', user ? `${user.displayName} (${user.email})` : 'Not signed in');
    });

    return unsubscribe;
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      console.log('🔑 Signing in with Google...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Signed in:', result.user.displayName);
      return result.user;
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setError(error.message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      console.log('👋 Signing out...');
      await signOut(auth);
      console.log('✅ Signed out');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
