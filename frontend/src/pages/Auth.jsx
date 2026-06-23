import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  IoLockClosedOutline, 
  IoMailOutline, 
  IoLogInOutline, 
  IoPersonAddOutline,
  IoAlertCircleOutline,
  IoEyeOutline,
  IoEyeOffOutline
} from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, loading: authLoading, sessionChecked } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
          const userObj = result.data?.user;
          const isAdminUser = !!(
            userObj && (
              userObj.user_metadata?.role === 'admin' ||
              userObj.app_metadata?.role === 'admin' ||
              userObj.email === 'admin@example.com' ||
              userObj.email?.startsWith('admin@')
            )
          );
          navigate(isAdminUser ? '/admin' : from, { replace: true });
        } else {
          // signIn already shows a toast, but show one here if result has error
          if (result?.error && !result?.toastShown) {
            toast.error(result.error || 'Invalid email or password. Please try again.');
          }
        }
      } else {
        const result = await signUp(email, password, name);
        if (result?.success) {
          // Check if session exists (user is auto-logged in, e.g. Demo Mode or auto-confirm enabled)
          if (result.data?.session) {
            const userObj = result.data.session.user;
            const isAdminUser = !!(
              userObj && (
                userObj.user_metadata?.role === 'admin' ||
                userObj.app_metadata?.role === 'admin' ||
                userObj.email === 'admin@example.com' ||
                userObj.email?.startsWith('admin@')
              )
            );
            navigate(isAdminUser ? '/admin' : from, { replace: true });
          } else {
            // Email confirmation required: switch to login tab, keep email for convenience, clear name/password
            toast.success('Account created! Please check your email to confirm before logging in.');
            setIsLogin(true);
            setName('');
            setPassword('');
            setValidationError('');
          }
        } else {
          if (result?.error && !result?.toastShown) {
            toast.error(result.error || 'Failed to create account. Please try again.');
          }
        }
      }
    } catch (err) {
      console.error('Authentication Error:', err);
      toast.error(err?.message || 'An unexpected error occurred. Please try again.');
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
    setShowPassword(false);
  };

  // Only block form during active auth operations (signIn/signUp),
  // NOT during the background Supabase session init (sessionChecked)
  const isLoading = authLoading || localLoading;

  // Show a subtle initializing indicator only while session is being checked
  const isInitializing = !sessionChecked;

  return (
    <div className="w-full max-w-md card-glass p-8 rounded-2xl mx-auto my-12 relative overflow-hidden">
      {/* Accent gradients */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-purple/10 rounded-full blur-3xl"></div>

      {/* Subtle session-check indicator - only shows very briefly on first load */}
      {isInitializing && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] text-text-muted animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping"></div>
          <span>Connecting...</span>
        </div>
      )}

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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isLoading}
            required
            className="w-full bg-bg-deep border border-border-light rounded-xl pl-12 pr-12 py-3 outline-none text-white focus:border-accent-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xl hover:text-white transition-colors focus:outline-none"
            tabIndex="-1"
          >
            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </button>
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

      {/* Demo Mode credentials helper */}
      <div className="mt-8 pt-6 border-t border-white/5 relative z-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-accent-cyan text-[10px] font-bold uppercase tracking-wider mb-3">
          💡 Demo Mode Sandbox
        </div>
        <p className="text-xs text-text-muted leading-relaxed max-w-sm mx-auto">
          Sign in as Guest using <code className="text-white bg-white/5 px-1.5 py-0.5 rounded font-mono">demo@example.com</code> / <code className="text-white bg-white/5 px-1.5 py-0.5 rounded font-mono">password</code>, or as Admin using <code className="text-white bg-white/5 px-1.5 py-0.5 rounded font-mono">admin@example.com</code> / <code className="text-white bg-white/5 px-1.5 py-0.5 rounded font-mono">password</code>.
        </p>
      </div>
    </div>
  );
}

