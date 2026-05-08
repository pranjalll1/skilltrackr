import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { LayoutDashboard, Settings, LogOut, BrainCircuit, PlusCircle, History, MessageSquare, Calendar, BarChart3, ShieldAlert, Menu, X } from 'lucide-react';

export default function DashboardLayout() {
  const { user, loading, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-brand-dark"><div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" replace />;

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Study Planner', href: '/dashboard/planner', icon: Calendar },
    { name: 'SavvyBot', href: '/dashboard/chat', icon: MessageSquare },
    { name: 'New Assessment', href: '/dashboard/assessments/new', icon: PlusCircle },
    { name: 'History', href: '/dashboard/history', icon: History },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  if (user.isAdmin) {
    navigation.push({ name: 'Admin Panel', href: '/dashboard/admin', icon: ShieldAlert });
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-brand-dark/80 backdrop-blur-sm md:hidden" onClick={toggleMobileMenu}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass-nav border-r border-brand-accent/10 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <BrainCircuit className="w-8 h-8 text-brand-accent" />
            <span className="text-xl font-bold tracking-wide text-brand-light">
              Savvy <span className="text-gradient">AI</span>
            </span>
          </Link>
          <button onClick={toggleMobileMenu} className="md:hidden text-brand-light">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-brand-primary/40 text-brand-secondary border border-brand-accent/20' 
                    : 'text-brand-light/70 hover:bg-brand-primary/20 hover:text-brand-light'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-accent/10">
          <div className="flex items-center gap-3 mb-4 px-4">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-brand-accent/30" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-secondary font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-brand-light truncate">{user.name}</p>
              <p className="text-xs text-brand-light/50 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-brand-light/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 glass-nav border-b border-brand-accent/10">
          <button onClick={toggleMobileMenu} className="text-brand-light p-2 rounded-lg hover:bg-brand-primary/20">
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-bold text-brand-light tracking-wide">Savvy <span className="text-gradient">AI</span></span>
        </div>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
