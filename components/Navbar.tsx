
import React, { useState, useEffect } from 'react';
import { Palette, Menu, X, LogOut, UserPlus, ShieldCheck, UserCircle } from 'lucide-react';
import { type User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface NavbarProps {
  user: User | null;
  userRole?: string;
  setView: (view: any) => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, userRole, setView, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    signOut(auth);
    setView('home');
  };

  const navItems = [
    { name: 'Home', view: 'home' },
    { name: 'Programs', view: 'programs' },
    { name: 'Blog', view: 'blog' },
    { name: 'Portfolio', view: 'portfolio' },
    { name: 'Services', view: 'services' },
    { name: 'Careers', view: 'careers' },
    { name: 'Contact', view: 'contact' },
  ];

  const isSolid = scrolled || currentView !== 'home';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isSolid ? 'bg-white shadow-xl py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setView('home')}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${isSolid ? 'bg-primary shadow-primary/30' : 'bg-white shadow-white/20'}`}>
              <Palette className={`${isSolid ? 'text-white' : 'text-primary'} w-6 h-6`} />
            </div>
            <span className={`text-2xl font-black tracking-tight transition-colors ${isSolid ? 'text-slate-900' : 'text-white'}`}>
              EduSculptor
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <button 
                key={item.name}
                onClick={() => setView(item.view)}
                className={`text-sm font-bold hover:text-primary transition-colors relative group/link ${
                  item.view === currentView 
                    ? 'text-primary' 
                    : (isSolid ? 'text-slate-600' : 'text-white/90')
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover/link:w-full ${item.view === currentView ? 'w-full' : ''}`} />
              </button>
            ))}
            
            <div className={`h-6 w-px ${isSolid ? 'bg-slate-200' : 'bg-white/20'}`} />

            {user ? (
              <div className="flex items-center gap-4">
                {userRole === 'admin' && (
                  <button 
                    onClick={() => setView('admin')}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-slate-800 transition-all"
                  >
                    <ShieldCheck size={14} /> Admin
                  </button>
                )}
                
                <button 
                  onClick={() => setView('profile')}
                  className={`flex items-center gap-2 rounded-full pr-4 pl-1 py-1 border transition-all hover:scale-105 ${isSolid ? 'bg-slate-100 border-slate-200' : 'bg-white/10 border-white/20'}`}
                >
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} className="w-7 h-7 rounded-full" alt="User" />
                  <span className={`text-xs font-black ${isSolid ? 'text-slate-700' : 'text-white'}`}>Profile</span>
                </button>

                <button 
                  onClick={handleLogout}
                  className={`p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors ${isSolid ? 'text-slate-400' : 'text-white/60'}`}
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setView('auth')} 
                className={`px-6 py-2.5 rounded-xl font-black transition-all shadow-lg flex items-center gap-2 active:scale-95 ${isSolid ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/25' : 'bg-white text-primary hover:bg-blue-50 shadow-white/10'}`}
              >
                <UserPlus className="w-4 h-4" /> Login / Join
              </button>
            )}
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={isSolid ? 'text-slate-900' : 'text-white'}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white absolute top-full left-0 w-full shadow-2xl p-6 border-t border-slate-100 flex flex-col space-y-2 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => (
            <button key={item.name} onClick={() => { setView(item.view); setIsOpen(false); }} className={`text-left font-bold py-3 px-4 rounded-xl transition-all ${item.view === currentView ? 'bg-primary/5 text-primary' : 'text-slate-700 hover:bg-slate-50'}`}>{item.name}</button>
          ))}
          {user ? (
            <>
              <button onClick={() => { setView('profile'); setIsOpen(false); }} className="text-left font-black py-3 px-4 rounded-xl text-slate-700 flex items-center gap-2">
                <UserCircle size={20} /> My Profile
              </button>
              {userRole === 'admin' && (
                <button onClick={() => { setView('admin'); setIsOpen(false); }} className="text-left font-black py-3 px-4 rounded-xl bg-slate-900 text-white flex items-center gap-2">
                  <ShieldCheck size={16} /> Admin Panel
                </button>
              )}
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-red-600 font-bold flex items-center gap-2 py-4 px-4 hover:bg-red-50 rounded-xl transition-all border-t border-slate-50 mt-4"><LogOut size={20} /> Logout</button>
            </>
          ) : (
            <button onClick={() => { setView('auth'); setIsOpen(false); }} className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg mt-4">Login / Sign Up</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
