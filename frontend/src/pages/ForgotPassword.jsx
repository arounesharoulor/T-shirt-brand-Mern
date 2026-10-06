import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, call API to send password reset email
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </button>

        <div className="bg-white py-8 px-4 shadow-2xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-extrabold text-slate-900">Reset Password</h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-slate-900 font-bold mb-6">Check your email</p>
              <p className="text-slate-500 text-sm mb-6">We've sent password reset instructions to {email}</p>
              <button onClick={() => setSubmitted(false)} className="text-blue-600 font-bold hover:underline text-sm">
                Didn't receive the email? Try again.
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-xl shadow-slate-900/20 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none transition-all hover:-translate-y-1"
              >
                Send Reset Link
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
