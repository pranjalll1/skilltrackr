import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { BrainCircuit, Mail, Lock, User, Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled in context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-brand-dark">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="glass-card p-10 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex justify-center mb-4">
            <BrainCircuit className="w-12 h-12 text-brand-accent" />
          </Link>
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-brand-light/60">Join Savvy AI today</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-light/80 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light/40" />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-brand-primary/20 border border-brand-accent/30 rounded-lg py-3 pl-10 pr-4 text-brand-light focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-light/80 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light/40" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-primary/20 border border-brand-accent/30 rounded-lg py-3 pl-10 pr-4 text-brand-light focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-light/80 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light/40" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-primary/20 border border-brand-accent/30 rounded-lg py-3 pl-10 pr-4 text-brand-light focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-accent hover:bg-opacity-90 text-brand-dark font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,133,187,0.3)]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-brand-light/60 text-sm">
          Already have an account? <Link to="/login" className="text-brand-secondary hover:text-brand-accent transition-colors font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
