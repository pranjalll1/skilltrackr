import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="glass-nav sticky top-0 z-50 py-4 px-6 md:px-12 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <BrainCircuit className="w-8 h-8 text-brand-accent group-hover:scale-110 transition-transform" />
        <span className="text-xl font-bold tracking-wide text-brand-light">
          Savvy <span className="text-gradient">AI</span>
        </span>
      </Link>
      
      <div className="flex items-center gap-6">
        <Link to="/login" className="text-brand-light hover:text-brand-secondary transition-colors font-medium">
          Log In
        </Link>
        <Link to="/register" className="bg-brand-accent hover:bg-opacity-90 text-brand-dark px-5 py-2 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(255,133,187,0.4)]">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
