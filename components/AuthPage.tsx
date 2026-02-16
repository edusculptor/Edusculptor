
import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  School, 
  GitBranch, 
  ArrowRight, 
  AlertCircle, 
  Loader2,
  Palette,
  ShieldAlert,
  Camera
} from 'lucide-react';

interface AuthPageProps {
  setView: (view: 'home' | 'about' | 'services' | 'programs' | 'portfolio' | 'contact' | 'careers' | 'auth') => void;
  redirectReason?: string | null;
}

const AuthPage: React.FC<AuthPageProps> = ({ setView, redirectReason }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [contact, setContact] = useState('');
  const [altContact, setAltContact] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setView('home');
    } catch (err: any) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Login Logic
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Signup Logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Auth Profile with Name and Photo
        await updateProfile(user, { 
          displayName: fullName,
          photoURL: photoURL || `https://ui-avatars.com/api/?name=${fullName}&background=5252ff&color=fff`
        });

        // Save metadata to Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          fullName,
          email,
          photoURL: photoURL || `https://ui-avatars.com/api/?name=${fullName}&background=5252ff&color=fff`,
          contact,
          altContact,
          college,
          branch,
          role: 'student',
          createdAt: serverTimestamp()
        });
      }
      setView('home');
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-bg-light animate-in fade-in duration-500 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-100">
        
        {/* Left Branding Side */}
        <div className="lg:w-2/5 bg-primary p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <Palette className="text-primary w-7 h-7" />
              </div>
              <span className="text-3xl font-black tracking-tight">EduSculptor</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-8 leading-tight">
              {isLogin ? "Welcome Back to Digital Excellence." : "Sculpt Your Career Path Today."}
            </h2>
            <p className="text-xl text-blue-100/80 font-medium leading-relaxed">
              {isLogin 
                ? "Continue your journey with the world's most advanced digital learning platform."
                : "Join 10,000+ students and professionals transforming their future through industry-led programs."}
            </p>
          </div>

          <div className="relative z-10 mt-12 pt-12 border-t border-white/20">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-slate-200" />
              ))}
            </div>
            <p className="text-sm font-bold text-blue-50">Joined by 200+ new members this week</p>
          </div>

          {/* Decor */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        </div>

        {/* Right Form Side */}
        <div className="lg:w-3/5 p-10 lg:p-16 bg-white">
          <div className="max-w-md mx-auto">
            
            {redirectReason && (
              <div className="mb-8 p-4 bg-primary/5 rounded-2xl border-2 border-primary/10 flex items-start gap-3 text-primary animate-in slide-in-from-top-4">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-bold leading-tight">{redirectReason}</p>
              </div>
            )}

            <div className="mb-10">
              <h3 className="text-3xl font-black text-slate-900 mb-2">
                {isLogin ? "Sign In" : "Create Account"}
              </h3>
              <p className="text-slate-500 font-medium">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-black hover:underline"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3 text-red-600 animate-in slide-in-from-top-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold leading-tight">{error}</p>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <>
                  {/* Profile Photo Upload Emulation */}
                  <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-3xl bg-slate-100 overflow-hidden border-2 border-slate-200 shadow-inner flex items-center justify-center">
                        {photoURL ? (
                          <img src={photoURL} className="w-full h-full object-cover" alt="Preview" onError={() => setPhotoURL('')} />
                        ) : (
                          <UserIcon className="w-10 h-10 text-slate-300" />
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg">
                        <Camera className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="w-full space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Profile Photo URL</label>
                      <input 
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        className="w-full px-6 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">User Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          required
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-slate-700"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          required
                          type="tel"
                          placeholder="+91 00000 00000"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">College</label>
                    <div className="relative">
                      <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        required
                        type="text"
                        placeholder="University Name"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Branch</label>
                    <div className="relative">
                      <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        required
                        type="text"
                        placeholder="CS / IT / EC"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>
                
                {!isLogin && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Alternative Number (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 opacity-50" />
                      <input 
                        type="tel"
                        placeholder="Alternative contact"
                        value={altContact}
                        onChange={(e) => setAltContact(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button 
                disabled={loading}
                type="submit"
                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"} <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest">Or continue with</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-slate-100 text-slate-700 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3 mb-6"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
