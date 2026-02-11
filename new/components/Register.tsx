import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { register } from '../services/auth';
import { User } from '../types';

interface RegisterProps {
  onRegister: (user: User) => void;
  onSwitch: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitch }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await register(name, email, password);
      onRegister(user);
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-teal-50 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-inner transform -rotate-3 text-teal-600">
           <Sparkles className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Us</h2>
        <p className="text-gray-500">Track your CGPA with style</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50/80 backdrop-blur text-red-700 text-sm rounded-xl border border-red-100">
             {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700 ml-1">Full Name</label>
          <div className="relative group">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all"
              placeholder="student@vtu.ac.in"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700 ml-1">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all"
              placeholder="Create a password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 transform hover:-translate-y-0.5"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <>
              Create Account <CheckCircle className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={onSwitch}
            className="text-teal-600 font-bold hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;