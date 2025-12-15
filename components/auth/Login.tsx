import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';
import { InputField } from '../ui/FormElements';
import { api } from '../../services/api';

interface LoginProps {
  onLogin: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await api.login(email, password);
      onLogin(email);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Decorative Background Header */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-br from-blue-600 to-indigo-700 rounded-b-[48px] shadow-lg z-0">
        <div className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8 relative z-10 w-full max-w-md mx-auto">
        
        {/* Brand Section */}
        <div className="text-center mb-10">
          <div className="bg-white p-6 rounded-[28px] shadow-xl shadow-blue-900/25 w-32 h-32 flex items-center justify-center mx-auto mb-6 cursor-default">
             {/* Replace src below with your actual logo URL */}
             <img 
               src="https://cdn-icons-png.flaticon.com/512/5930/5930472.png" 
               alt="Inspection TV Logo" 
               className="w-full h-full object-contain"
             />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2 drop-shadow-md">
            Inspection TV
          </h2>
          <p className="text-blue-100 font-medium text-sm tracking-wide opacity-90">
            Professional Vehicle Inventory
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50">
          <div className="mb-6 text-center">
              <h3 className="text-xl font-bold text-slate-900">Welcome Back</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Sign in to access your dashboard</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-3 animate-slide-up border border-red-100 shadow-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <InputField 
                label="Email" 
                type="email" 
                autoComplete="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="bg-white border-slate-200 focus:border-blue-500"
                icon={<Mail className="w-4 h-4" />}
              />

              <div>
                <InputField 
                  label="Password" 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white border-slate-200 focus:border-blue-500"
                  icon={<Lock className="w-4 h-4" />}
                />
                <div className="flex justify-end mt-2">
                  <button type="button" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot Password?
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 text-sm font-bold leading-6 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-8 text-center text-[10px] text-slate-400 font-medium tracking-wide uppercase">
          Powered by AutoInventory Pro &copy; 2024
        </p>
      </div>
    </div>
  );
};