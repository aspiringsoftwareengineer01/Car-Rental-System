import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  IoLockClosedOutline, 
  IoMailOutline, 
  IoLogInOutline, 
  IoPersonAddOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, loading: authLoading } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Target redirect path (defaults to /dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  const validateForm = () => {
    setValidationError('');
    
    if (!email || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return false;
    }
    
    if (!password || password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return false;
    }

    if (!isLogin && !name.trim()) {
      setValidationError('Please enter your full name.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLocalLoading(true);

    try {
      if (isLogin) {
        const result = await signIn(email, password);
        if (result?.success) {
          navigate(from, { replace: true });
        }
      } else {
        const result = await signUp(email, password, name);
        if (result?.success) {
          // Check if session exists (user is auto-logged in, e.g. Demo Mode or auto-confirm enabled)
          if (result.data?.session) {
            navigate(from, { replace: true });
          } else {
            // Email confirmation required: switch to login tab, keep email for convenience, clear name/password
            setIsLogin(true);
            setName('');
            setPassword('');
            setValidationError('');
          }
        }
      }
    } catch (err) {
      console.error('Authentication Error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setValidationError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const isLoading = authLoading || localLoading;

  return (
    <div className="w-full max-w-md card-glass p-8 rounded-2xl mx-auto my-12 relative overflow-hidden">
      {/* Accent gradients */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-purple/10 rounded-full blur-3xl"></div>

      <div className="text-center mb-8 relative">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-text-muted text-sm">
          {isLogin ? 'Log in to manage your active rentals' : 'Sign up to gain access to premium fleets'}
        </p>
      </div>

      {validationError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2 animate-pulse">
          <IoAlertCircleOutline className="text-lg shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form className="flex flex-col gap-5 relative" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="relative">
            <IoPersonAddOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              disabled={isLoading}
              required
              className="w-full bg-bg-deep border border-border-light rounded-xl pl-12 pr-4 py-3 outline-none text-white focus:border-accent-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        )}

        <div className="relative">
          <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            disabled={isLoading}
            required
            className="w-full bg-bg-deep border border-border-light rounded-xl pl-12 pr-4 py-3 outline-none text-white focus:border-accent-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="relative">
          <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isLoading}
            required
            className="w-full bg-bg-deep border border-border-light rounded-xl pl-12 pr-4 py-3 outline-none text-white focus:border-accent-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="btn-premium btn-premium-hover mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></div>
          ) : (
            <>
              {isLogin ? <IoLogInOutline className="text-xl" /> : <IoPersonAddOutline className="text-xl" />}
              <span>{isLogin ? 'Log In' : 'Register Now'}</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-6 text-sm text-text-muted relative">
        <span>{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
        <button
          onClick={toggleAuthMode}
          disabled={isLoading}
          className="text-accent-cyan font-bold hover:underline bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </div>
    </div>
  );
}

