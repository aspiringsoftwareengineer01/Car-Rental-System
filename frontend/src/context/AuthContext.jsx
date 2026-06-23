/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext();

const MOCK_USERS_KEY = 'car_rental_mock_users';
const MOCK_SESSION_KEY = 'car_rental_mock_session';

// ─── Local Storage Helpers ────────────────────────────────────────────────────
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
    // Prevent duplicates
    const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx !== -1) {
      users[idx] = user; // update existing
    } else {
      users.push(user);
    }
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  } catch {
    // Silent catch
  }
};

const getLocalSession = () => {
  try {
    const saved = localStorage.getItem(MOCK_SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveLocalSession = (user) => {
  try {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
  } catch { /* silent */ }
};

const clearLocalSession = () => {
  try {
    localStorage.removeItem(MOCK_SESSION_KEY);
  } catch { /* silent */ }
};

// ─── Built-in Demo Accounts ───────────────────────────────────────────────────
const DEMO_ACCOUNTS = {
  'admin@example.com': {
    id: 'u_mock_admin',
    email: 'admin@example.com',
    defaultPassword: 'password',
    defaultName: 'System Admin',
    role: 'admin',
  },
  'demo@example.com': {
    id: 'u_mock_123',
    email: 'demo@example.com',
    defaultPassword: 'password',
    defaultName: 'Alex Mercer (Guest)',
    role: 'user',
  },
};

const buildMockUser = (acc) => {
  const specialNameKey = `car_rental_special_name_${acc.email.toLowerCase()}`;
  const savedName = localStorage.getItem(specialNameKey) || acc.defaultName;
  return {
    id: acc.id,
    email: acc.email,
    user_metadata: { name: savedName, role: acc.role },
  };
};

// ─── AuthProvider ─────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  // Restore session from localStorage immediately (works for both demo and real)
  const [user, setUser] = useState(() => getLocalSession());

  // loading = only true during active signIn / signUp / signOut calls
  const [loading, setLoading] = useState(false);

  // sessionChecked = true once we've verified (or timed-out) the Supabase session check
  // If no Supabase configured, it's immediately checked (we use localStorage only)
  const [sessionChecked, setSessionChecked] = useState(!isSupabaseConfigured);

  const [isDemo] = useState(!isSupabaseConfigured);

  // ── On mount: sync Supabase session without blocking the UI ──────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Safety net: unblock UI after 5 seconds if Supabase never responds
    const timeout = setTimeout(() => {
      setSessionChecked(true);
    }, 5000);

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          // Real Supabase session found — use it and persist locally
          setUser(session.user);
          saveLocalSession(session.user);
        }
        // else keep the localStorage user if any (set in useState initializer)
        clearTimeout(timeout);
        setSessionChecked(true);
      })
      .catch((err) => {
        console.warn('Supabase getSession failed, using local session:', err.message);
        clearTimeout(timeout);
        setSessionChecked(true);
      });

    // Listen for Supabase real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        saveLocalSession(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // ── SIGN IN ──────────────────────────────────────────────────────────────────
  const signIn = async (email, password) => {
    setLoading(true);
    const emailLower = email.toLowerCase().trim();

    try {
      // 1. Check built-in demo accounts (always works, no network needed)
      const demoAcc = DEMO_ACCOUNTS[emailLower];
      if (demoAcc) {
        const specialPassKey = `car_rental_special_pass_${emailLower}`;
        const expectedPass = localStorage.getItem(specialPassKey) || demoAcc.defaultPassword;
        if (password === expectedPass) {
          const mockUser = buildMockUser(demoAcc);
          setUser(mockUser);
          saveLocalSession(mockUser);
          const label = demoAcc.role === 'admin' ? 'Admin 🛠️' : 'Guest 🎉';
          toast.success(`Signed in successfully as ${label}`);
          setLoading(false);
          return { success: true, data: { user: mockUser, session: { user: mockUser } } };
        } else {
          toast.error('Incorrect password for demo account.');
          setLoading(false);
          return { success: false, error: 'Incorrect password' };
        }
      }

      // 2. Check locally registered users (always works, no network needed)
      const mockUsers = getMockUsers();
      const localUser = mockUsers.find(
        (u) => u.email.toLowerCase() === emailLower && u.password === password
      );
      if (localUser) {
        const safeUser = { ...localUser };
        delete safeUser.password;
        setUser(safeUser);
        saveLocalSession(safeUser);
        toast.success(`Welcome back, ${safeUser.user_metadata?.name || safeUser.email}! 🎉`);
        setLoading(false);
        return { success: true, data: { user: safeUser, session: { user: safeUser } } };
      }

      // 3. Try Supabase (only if configured)
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          if (data?.user) {
            setUser(data.user);
            saveLocalSession(data.user);
            toast.success('Signed in successfully! 🎉');
            setLoading(false);
            return { success: true, data };
          }
        } catch (supabaseErr) {
          const msg = (supabaseErr.message || '').toLowerCase();
          const isNetworkFailure =
            msg.includes('failed to fetch') ||
            msg.includes('networkerror') ||
            msg.includes('network request failed') ||
            msg.includes('load failed') ||
            msg.includes('typeerror') ||
            supabaseErr.name === 'TypeError';

          if (isNetworkFailure) {
            // Supabase server is unreachable — silently fall through to step 4
            // (Don't mislead the user — their internet is fine, our backend is down)
            console.warn('Supabase unreachable, falling through to local auth check.');
          } else if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
            toast.error('Invalid email or password. Please check and try again.');
            setLoading(false);
            return { success: false, error: supabaseErr.message };
          } else if (msg.includes('email not confirmed')) {
            toast.error('Please confirm your email address first. Check your inbox for a verification link.');
            setLoading(false);
            return { success: false, error: supabaseErr.message };
          } else {
            // Some other real Supabase error — show it
            toast.error(supabaseErr.message || 'Sign in failed. Please try again.');
            setLoading(false);
            return { success: false, error: supabaseErr.message };
          }
        }
      }

      // 4. Nothing matched locally or remotely
      toast.error('No account found. Please register a new account first.');
      setLoading(false);
      return { success: false, error: 'No account found' };


    } catch (err) {
      console.error('Unexpected signIn error:', err);
      toast.error('An unexpected error occurred. Please try again.');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // ── SIGN UP ──────────────────────────────────────────────────────────────────
  const signUp = async (email, password, name) => {
    setLoading(true);
    const emailLower = email.toLowerCase().trim();

    try {
      // Reject demo account emails
      if (DEMO_ACCOUNTS[emailLower]) {
        toast.error('This email is reserved. Please use a different email address.');
        setLoading(false);
        return { success: false, error: 'Email reserved' };
      }

      // Check if already registered locally
      const mockUsers = getMockUsers();
      if (mockUsers.some((u) => u.email.toLowerCase() === emailLower)) {
        toast.error('This email is already registered. Please log in instead.');
        setLoading(false);
        return { success: false, error: 'Email already registered' };
      }

      // Always save to local storage first so login always works
      const newMockUser = {
        id: 'u_local_' + Math.random().toString(36).substring(2, 11),
        email: emailLower,
        password, // stored for local auth only
        user_metadata: { name, role: 'user' },
      };
      saveMockUser(newMockUser);

      // Strip password for session
      const safeUser = { ...newMockUser };
      delete safeUser.password;

      // Also attempt Supabase registration (fire-and-forget, don't block login)
      if (isSupabaseConfigured) {
        supabase.auth.signUp({
          email,
          password,
          options: { data: { name, role: 'user' } },
        }).then(({ data, error }) => {
          if (error) {
            console.warn('Supabase signUp background error (local signup still worked):', error.message);
          } else if (data?.session?.user) {
            // Auto-confirmed — update local session with real Supabase user
            setUser(data.session.user);
            saveLocalSession(data.session.user);
          }
        }).catch((err) => {
          console.warn('Supabase signUp network error (local signup still worked):', err.message);
        });
      }

      // Log in immediately with local account
      setUser(safeUser);
      saveLocalSession(safeUser);
      toast.success(`Account created! Welcome, ${name}! 🎉`);
      setLoading(false);
      return { success: true, data: { user: safeUser, session: { user: safeUser } } };

    } catch (err) {
      console.error('Unexpected signUp error:', err);
      toast.error('Registration failed. Please try again.');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // ── SIGN OUT ─────────────────────────────────────────────────────────────────
  const signOut = async () => {
    setLoading(true);
    try {
      // Clear local session always
      setUser(null);
      clearLocalSession();

      // Also sign out from Supabase if configured
      if (isSupabaseConfigured) {
        supabase.auth.signOut().catch((err) => {
          console.warn('Supabase signOut error (local signout still succeeded):', err.message);
        });
      }

      toast.success('Signed out successfully. See you soon! 👋');
    } catch (err) {
      console.error('signOut error:', err);
      toast.error('Sign out failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── UPDATE PROFILE ────────────────────────────────────────────────────────────
  const updateProfile = async ({ name, password }) => {
    setLoading(true);
    try {
      const updatedUser = { ...user };
      if (!updatedUser.user_metadata) updatedUser.user_metadata = {};
      if (name) updatedUser.user_metadata.name = name;

      // Update local session
      setUser(updatedUser);
      saveLocalSession(updatedUser);

      // Update local mock user store
      const mockUsers = getMockUsers();
      const userIndex = mockUsers.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
      if (userIndex !== -1) {
        if (password) mockUsers[userIndex].password = password;
        if (name) mockUsers[userIndex].user_metadata = { ...mockUsers[userIndex].user_metadata, name };
        localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));
      } else {
        // Special accounts (admin/demo)
        if (password) {
          localStorage.setItem(`car_rental_special_pass_${user.email.toLowerCase()}`, password);
        }
        if (name) {
          localStorage.setItem(`car_rental_special_name_${user.email.toLowerCase()}`, name);
        }
      }

      // Also update Supabase in background
      if (isSupabaseConfigured) {
        const updates = {};
        if (name) updates.data = { name };
        if (password) updates.password = password;
        supabase.auth.updateUser(updates).catch((err) => {
          console.warn('Supabase updateUser background error:', err.message);
        });
      }

      toast.success('Profile updated successfully! 👤');
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('updateProfile error:', err);
      toast.error('Failed to update profile. Please try again.');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // ── Admin check ───────────────────────────────────────────────────────────────
  const isAdmin = !!(
    user && (
      user.user_metadata?.role === 'admin' ||
      user.app_metadata?.role === 'admin' ||
      user.email === 'admin@example.com' ||
      user.email?.startsWith('admin@')
    )
  );

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      sessionChecked,
      isDemo,
      isAdmin,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
