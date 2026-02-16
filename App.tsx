
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Trust from './components/Trust';
import Programs from './components/Programs';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import About from './components/About';
import ServicesPage from './components/ServicesPage';
import ProgramsPage from './components/ProgramsPage';
import PortfolioPage from './components/PortfolioPage';
import ContactPage from './components/ContactPage';
import CareersPage from './components/CareersPage';
import BlogsPage from './components/BlogsPage';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import AdminPanel from './components/Admin/AdminPanel';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('student');
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState<'home' | 'about' | 'services' | 'programs' | 'portfolio' | 'contact' | 'careers' | 'blog' | 'auth' | 'admin' | 'profile'>('home');
  const [redirectReason, setRedirectReason] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthLoading(true);
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || 'student');
          }
          if (currentUser.email === 'admin@edusculptor.com') {
            setUserRole('admin');
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        }
        
        if (view === 'auth') {
          setView('home');
          setRedirectReason(null);
        }
      } else {
        setUserRole('student');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [view]);

  useEffect(() => {
    if (authLoading) return;

    const protectedViews = ['programs', 'portfolio', 'profile'];
    const adminViews = ['admin'];
    
    if (!user && protectedViews.includes(view)) {
      setRedirectReason(`Please login to access our ${view}.`);
      setView('auth');
    }
    
    if (adminViews.includes(view) && userRole !== 'admin') {
      setView('home');
    }
  }, [view, user, userRole, authLoading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Initializing Session...</p>
      </div>
    );
  }

  if (view === 'admin' && userRole === 'admin') {
    return <AdminPanel user={user} onLogout={() => auth.signOut()} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} userRole={userRole} setView={setView} currentView={view} />
      <main className="flex-grow">
        {view === 'home' && (
          <>
            <Hero setView={setView} />
            <Services />
            <Trust />
            <Programs setView={setView} />
            <Testimonials user={user} />
          </>
        )}
        {view === 'about' && <About setView={setView} />}
        {view === 'services' && <ServicesPage setView={setView} user={user} />}
        {view === 'programs' && <ProgramsPage setView={setView} />}
        {view === 'portfolio' && <PortfolioPage setView={setView} />}
        {view === 'contact' && <ContactPage setView={setView} />}
        {view === 'careers' && <CareersPage setView={setView} />}
        {view === 'blog' && <BlogsPage setView={setView} />}
        {view === 'auth' && <AuthPage setView={setView} redirectReason={redirectReason} />}
        {view === 'profile' && user && <ProfilePage user={user} setView={setView} />}
      </main>
      <Footer setView={setView} />
    </div>
  );
};

export default App;
