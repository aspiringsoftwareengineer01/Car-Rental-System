/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext();

const MOCK_USERS_KEY = 'car_rental_mock_users';
const MOCK_SESSION_KEY = 'car_rental_mock_session';

const getMockUsers = () => {
  try {
    const usersJson = localStorage.getItem(MOCK_USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch {
    return [];
  }
};

const saveMockUser = (user) => {
  try {
    const users = getMockUsers();
    users.push(user);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  } catch {
    // Silent catch
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (!isSupabaseConfigured) {
      try {
        const savedSession = localStorage.getItem(MOCK_SESSION_KEY);
        return savedSession ? JSON.parse(savedSession) : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [isDemo] = useState(!isSupabaseConfigured);

  // Sync Supabase Auth state automatically on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;

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
      const specialPassKey = `car_rental_special_pass_${email.toLowerCase()}`;
      const savedPass = localStorage.getItem(specialPassKey);
      const expectedPass = savedPass || 'password';

      // Demo authentication bypass for admin account
      if (email === 'admin@example.com' && password === expectedPass) {
        const specialNameKey = `car_rental_special_name_${email.toLowerCase()}`;
        const savedName = localStorage.getItem(specialNameKey) || 'System Admin';

        const mockUser = {
          id: 'u_mock_admin',
          email: 'admin@example.com',
          user_metadata: { name: savedName, role: 'admin' }
        };
        setUser(mockUser);
        localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(mockUser));
        setLoading(false);
        toast.success('Signed in successfully as Admin! 🛠️');
        return { success: true, data: { user: mockUser, session: { user: mockUser } } };
      }

      // Demo authentication bypass for main guest account
      if (email === 'demo@example.com' && password === expectedPass) {
        const specialNameKey = `car_rental_special_name_${email.toLowerCase()}`;
        const savedName = localStorage.getItem(specialNameKey) || 'Alex Mercer (Guest)';

        const mockUser = {
          id: 'u_mock_123',
          email: 'demo@example.com',
          user_metadata: { name: savedName, role: 'user' }
        };
        setUser(mockUser);
        localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(mockUser));
        setLoading(false);
        toast.success('Signed in successfully as Guest! 🎉');
        return { success: true, data: { user: mockUser, session: { user: mockUser } } };
      }

      // Check registered mock users
      const mockUsers = getMockUsers();
      const foundUser = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        // Strip password before saving to state/session
        const safeUser = { ...foundUser };
        delete safeUser.password;
        setUser(safeUser);
        localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(safeUser));
        setLoading(false);
        toast.success(`Signed in successfully as ${safeUser.user_metadata?.name || safeUser.email}! 🎉`);
        return { success: true, data: { user: safeUser, session: { user: safeUser } } };
      } else {
        setLoading(false);
        toast.error('Invalid credentials. Use demo@example.com / password or register.');
        return { success: false, error: 'Invalid credentials' };
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data?.user) {
        setUser(data.user);
      }
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
            data: { name, role: 'user' }
          }
        });
        if (error) throw error;
        if (data?.session?.user) {
          setUser(data.session.user);
        }
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
      const mockUsers = getMockUsers();
      if (
        mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase()) ||
        email.toLowerCase() === 'demo@example.com'
      ) {
        setLoading(false);
        toast.error('Email address is already registered');
        return { success: false, error: 'Email already registered' };
      }

      const mockUser = {
        id: 'u_mock_' + Math.random().toString(36).substring(2, 11),
        email,
        password,
        user_metadata: { name, role: 'user' }
      };

      saveMockUser(mockUser);
      
      // Strip password from state and session
      const safeUser = { ...mockUser };
      delete safeUser.password;
      setUser(safeUser);
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(safeUser));
      setLoading(false);
      toast.success('Demo account registered and signed in! 🎉');
      return { success: true, data: { user: safeUser, session: { user: safeUser } } };
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
      localStorage.removeItem(MOCK_SESSION_KEY);
      setLoading(false);
      toast.success('Demo signed out.');
    }
  };

  const updateProfile = async ({ name, password }) => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      try {
        const updatedUser = { ...user };
        if (!updatedUser.user_metadata) {
          updatedUser.user_metadata = {};
        }

        if (name) {
          updatedUser.user_metadata.name = name;
        }

        setUser(updatedUser);
        localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(updatedUser));

        if (password) {
          const mockUsers = getMockUsers();
          const userIndex = mockUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());

          if (userIndex !== -1) {
            mockUsers[userIndex].password = password;
            if (name) mockUsers[userIndex].user_metadata = { ...mockUsers[userIndex].user_metadata, name };
            localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));
          } else {
            const specialPassKey = `car_rental_special_pass_${user.email.toLowerCase()}`;
            localStorage.setItem(specialPassKey, password);
            if (name) {
              const specialNameKey = `car_rental_special_name_${user.email.toLowerCase()}`;
              localStorage.setItem(specialNameKey, name);
            }
          }
        } else if (name) {
          const mockUsers = getMockUsers();
          const userIndex = mockUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
          if (userIndex !== -1) {
            mockUsers[userIndex].user_metadata = { ...mockUsers[userIndex].user_metadata, name };
            localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));
          } else {
            const specialNameKey = `car_rental_special_name_${user.email.toLowerCase()}`;
            localStorage.setItem(specialNameKey, name);
          }
        }

        setLoading(false);
        toast.success('Profile updated successfully (Demo Mode)! 👤');
        return { success: true };
      } catch (err) {
        setLoading(false);
        toast.error('Failed to update profile');
        return { success: false, error: err.message };
      }
    }

    try {
      const updates = {};
      if (name) {
        updates.data = { name };
      }
      if (password) {
        updates.password = password;
      }

      const { data, error } = await supabase.auth.updateUser(updates);
      if (error) throw error;

      setUser(data.user);
      toast.success('Profile updated successfully! 👤');
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const isAdmin = !!(
    user && (
      user.user_metadata?.role === 'admin' ||
      user.app_metadata?.role === 'admin' ||
      user.email === 'admin@example.com' ||
      user.email?.startsWith('admin@')
    )
  );

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, signIn, signUp, signOut, isAdmin, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
