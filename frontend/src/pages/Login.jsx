import { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login({
      email: formData.email,
      password: formData.password
    });

    if (res.success) {
      navigate('/shop');
    } else {
      setError(res.error || 'Login failed. Please check your credentials.');
    }
    
    setLoading(false);
  };

  // Advanced Mouse Parallax for the left showcase
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the parallax
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const rotateX = useTransform(smoothY, [-1, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [-1, 1], [-10, 10]);
  const translateX = useTransform(smoothX, [-1, 1], [-30, 30]);
  const translateY = useTransform(smoothY, [-1, 1], [-30, 30]);
  
  const bgTranslateX = useTransform(smoothX, [-1, 1], [-15, 15]);
  const bgTranslateY = useTransform(smoothY, [-1, 1], [-15, 15]);

  return (
    <div className="flex min-h-screen bg-white" onMouseMove={handleMouseMove}>
      
      {/* LEFT SIDE - Advanced Interactive Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-slate-50 items-center justify-center p-12">
        <motion.div 
          style={{ x: bgTranslateX, y: bgTranslateY }}
          className="absolute inset-0 opacity-50"
        >
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-indigo-200 to-blue-100 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-purple-200 to-pink-100 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dvw0d0bve/image/upload/v1701389786/grid-pattern_q5mvhq.svg')] bg-[length:30px_30px] opacity-20" />
        </motion.div>

        <div className="relative w-full max-w-lg h-full flex flex-col justify-center items-center" style={{ perspective: 1200 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12 text-center z-20"
          >
            <h1 className="text-5xl lg:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
              Welcome back <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                to the studio.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-500 max-w-md mx-auto">
              Log in to continue building your brand, access your saved designs, and manage your custom apparel orders.
            </p>
          </motion.div>

          <motion.div 
            style={{ rotateX, rotateY, x: translateX, y: translateY }}
            className="relative z-10"
          >
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl -rotate-6 opacity-20 blur-xl" />
              <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-white/50 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&q=80" 
                  alt="Apparel" 
                  className="w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white font-bold tracking-widest uppercase text-sm">
                  Pro Studio
                </div>
              </div>
              
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-12 top-10 bg-white/90 backdrop-blur px-5 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span className="text-sm font-bold text-slate-800">12 Saved Designs</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-12 bottom-10 bg-slate-900 px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 text-white"
              >
                <span className="text-sm font-bold">Priority Shipping</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - Standard Correct Form Layout */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-12 lg:p-16 relative bg-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 lg:hidden" />

        <div className="w-full max-w-md relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>
              </div>
              <span className="text-xl font-display font-bold text-slate-900 tracking-tight">CustomTees</span>
            </div>

            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Sign in to your account</h2>
            <p className="text-slate-500">Welcome back! Please enter your details.</p>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 sm:py-3 bg-slate-50/50 sm:bg-white/50 border border-slate-200 hover:border-slate-300 hover:bg-white rounded-xl text-[15px] sm:text-sm text-slate-900 focus:outline-none focus:ring-[3px] focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 placeholder:text-slate-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3.5 sm:py-3 bg-slate-50/50 sm:bg-white/50 border border-slate-200 hover:border-slate-300 hover:bg-white rounded-xl text-[15px] sm:text-sm text-slate-900 focus:outline-none focus:ring-[3px] focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 placeholder:text-slate-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-600" />
                <span className="text-sm font-medium text-slate-600">Remember me</span>
              </label>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pt-2">
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 px-4 bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign in to account'}
              </motion.button>
            </motion.div>

          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 pt-6 text-center border-t border-slate-100">
            <p className="text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Sign up for free
              </Link>
            </p>
          </motion.div>

        </div>
      </div>
      
    </div>
  );
};

export default Login;
