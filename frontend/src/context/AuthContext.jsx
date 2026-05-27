import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // Sync Supabase Auth state automatically on mount
  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Offline Demo Mode: No active user initially
      setUser(null);
      setLoading(false);
      setIsDemo(true);
      return;
    }

    // 1. Get current active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Listen to real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // SIGN IN METHOD
  const signIn = async (email, password) => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      // Demo authentication bypass
      if (email === 'demo@example.com' && password === 'password') {
        const mockUser = {
          id: 'u_mock_123',
          email: 'demo@example.com',
          user_metadata: { name: 'Alex Mercer (Guest)' }
        };
        setUser(mockUser);
        setLoading(false);
        toast.success('Signed in successfully as Guest! 🎉');
        return { success: true };
      } else {
        setLoading(false);
        toast.error('Demo credentials: use demo@example.com / password');
        return { success: false, error: 'Invalid demo credentials' };
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Signed in successfully! 🎉');
      return { success: true, data };
    } catch (err) {
      toast.error(err.message || 'Failed to authenticate');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // SIGN UP METHOD
  const signUp = async (email, password, name) => {
    setLoading(true);
    if (!isDemo && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });
        if (error) throw error;
        toast.success('Signup successful! Check email for verification link.');
        setLoading(false);
        return { success: true, data };
      } catch (err) {
        toast.error(err.message || 'Failed to register account');
        setLoading(false);
        return { success: false, error: err.message };
      }
    } else {
      // Demo Mode Registration Simulation
      const mockUser = {
        id: 'u_mock_' + Math.random().toString(36).substr(2, 9),
        email,
        user_metadata: { name }
      };
      setUser(mockUser);
      setLoading(false);
      toast.success('Demo account registered and signed in! 🎉');
      return { success: true };
    }
  };

  // SIGN OUT METHOD
  const signOut = async () => {
    setLoading(true);
    if (!isDemo && isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        toast.success('Signed out successfully.');
      } catch (err) {
        toast.error(err.message || 'Failed to sign out');
      } finally {
        setLoading(false);
      }
    } else {
      // Demo Sign Out
      setUser(null);
      setLoading(false);
      toast.success('Demo signed out.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
