import React, { useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/auth';
import { X, Lock, Mail, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setError('');
    }
  }, [isOpen, isLogin]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await loginUser({ email, password });
        localStorage.setItem('token', data.access_token);

        const userInfo = { 
            id: data.agencyId, 
            email, 
            name: data.name || 'User',
            role: data.role || 'AGENT'
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        onSuccess(userInfo);
      } else {
        const regData = await registerUser({ email, password, name });
        const loginData = await loginUser({ email, password });
        localStorage.setItem('token', loginData.access_token);
        
        const userInfo = { 
          id: loginData.agencyId || regData.agencyId, 
          email, 
          name: loginData.name || name 
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        onSuccess(userInfo);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {isLogin ? 'Sign In' : 'Agency Registration'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {isLogin ? 'Sign in to save your property searches' : 'Create an account to manage properties'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Agency Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Éire Properties"
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@agency.ie"
                autoComplete="off"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm shadow-sm cursor-pointer"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};