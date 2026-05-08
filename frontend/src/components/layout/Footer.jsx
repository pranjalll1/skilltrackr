import { Link } from 'react-router-dom';
import { BrainCircuit} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-brand-accent/20 bg-brand-dark/50 py-12 px-6 md:px-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-6 h-6 text-brand-accent" />
            <span className="text-xl font-bold text-brand-light">Savvy AI</span>
          </Link>
          <p className="text-brand-light/70 max-w-sm">
            Empowering the future of evaluation with advanced artificial intelligence. Premium assessment platform for modern enterprises.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-brand-secondary mb-4">Product</h4>
          <ul className="space-y-2 text-brand-light/70">
            <li><Link to="/" className="hover:text-brand-accent transition-colors">Features</Link></li>
            <li><Link to="/" className="hover:text-brand-accent transition-colors">Pricing</Link></li>
            <li><Link to="/" className="hover:text-brand-accent transition-colors">Enterprise</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-brand-secondary mb-4">Connect</h4>
          <div className="flex gap-4">
            
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-brand-accent/10 text-center text-brand-light/50 text-sm">
        &copy; {new Date().getFullYear()} Savvy AI. All rights reserved.
      </div>
    </footer>
  );
}
