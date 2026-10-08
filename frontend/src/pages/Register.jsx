import { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { currency } = useCurrency();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // clear error when typing
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill out all fields in step 1');
      return;
    }
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    const res = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.isAdmin ? 'admin' : 'user'
    });

    if (res.success) {
      navigate('/shop');
    } else {
      setError(res.error || 'Registration failed. Please try again.');
    }
    
    setLoading(false);
  };

  // Advanced Mouse Parallax for the left showcase
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const x1 = useTransform(useSpring(mouseX, { stiffness: 100, damping: 30 }), [-500, 500], [-20, 20]);
  const y1 = useTransform(useSpring(mouseY, { stiffness: 100, damping: 30 }), [-500, 500], [-20, 20]);
  
  const x2 = useTransform(useSpring(mouseX, { stiffness: 100, damping: 30 }), [-500, 500], [25, -25]);
  const y2 = useTransform(useSpring(mouseY, { stiffness: 100, damping: 30 }), [-500, 500], [25, -25]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX - innerWidth / 2);
    mouseY.set(clientY - innerHeight / 2);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex" onMouseMove={handleMouseMove}>
      {/* LEFT SIDE: Visual Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        {/* Same beautiful visual bg logic you had before */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=2787&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-slate-900/90 to-black/95" />
        </div>

        <div className="relative z-10 p-16 max-w-2xl text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-12">
            <h1 className="text-5xl font-display font-extrabold tracking-tight mb-6 leading-tight">
              Enter the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Creator Studio</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed font-medium">
              Create an account to save your custom designs, track orders, and access exclusive premium drops before anyone else.
            </p>
          </motion.div>

          {/* Floating 3D Elements */}
          <div className="relative h-64 w-full perspective-1000">
            <motion.div style={{ x: x1, y: y1 }} className="absolute top-0 left-10 w-48 h-64 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
               <img src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop" alt="" className="w-full h-full object-cover opacity-90" />
            </motion.div>
            <motion.div style={{ x: x2, y: y2 }} className="absolute top-10 right-10 w-56 h-72 bg-indigo-500/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col justify-end">
                {/* Background Image to fill the empty space */}
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" 
                  alt="Premium model" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/40 to-transparent" />
                
                {/* Content Overlay */}
                <div className="relative z-10 p-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg text-slate-900">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-1">Premium Member</h3>
                  <p className="text-indigo-200 text-sm font-medium">Free Global Shipping</p>
                </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 relative z-10 bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.1)]">
        
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="inline-block mb-8">
              <span className="font-display font-extrabold text-2xl tracking-tight text-slate-900">
                CustomTees<span className="text-indigo-600">.</span>
              </span>
            </Link>
            <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500 font-medium">
              Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-all">Sign in here</Link>
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8 gap-2">
            <div className={`h-2 flex-1 rounded-full ${step === 1 ? 'bg-indigo-600' : 'bg-slate-200'} transition-colors`} />
            <div className={`h-2 flex-1 rounded-full ${step === 2 ? 'bg-indigo-600' : 'bg-slate-200'} transition-colors`} />
          </div>

          <form onSubmit={step === 1 ? nextStep : handleSubmit} className="space-y-6">
            
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold flex items-center justify-center">
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                        placeholder={currency === 'INR' ? '+91 (00000) 00000' : '+1 (555) 000-0000'}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-xl shadow-indigo-600/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:-translate-y-1">
                    Continue to Security <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Create Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                        placeholder="••••••••"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center mt-4 mb-2">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      name="isAdmin"
                      checked={formData.isAdmin || false}
                      onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="isAdmin" className="ml-2 text-sm font-bold text-slate-700">
                      Register as Admin <span className="text-xs text-slate-500 font-normal">(For evaluation purposes)</span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="w-1/3 flex justify-center items-center py-4 px-4 rounded-xl border border-slate-200 hover:border-slate-300 text-sm font-bold text-slate-700 bg-white transition-all">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </button>
                    <button type="submit" disabled={loading} className="w-2/3 flex justify-center py-4 px-4 rounded-xl shadow-xl shadow-slate-900/20 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-70 transition-all hover:-translate-y-1">
                      {loading ? 'Creating...' : 'Create Account'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Register;
