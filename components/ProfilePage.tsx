
import React, { useState, useEffect } from 'react';
import { type User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  User as UserIcon, Mail, Phone, School, GitBranch, 
  Save, Loader2, CheckCircle2, Camera, LogOut, ChevronLeft
} from 'lucide-react';

interface ProfilePageProps {
  user: User;
  setView: (view: any) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, setView }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState<any>({
    fullName: '',
    contact: '',
    altContact: '',
    college: '',
    branch: '',
    photoURL: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...profileData,
        updatedAt: new Date()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-bg-light animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-slate-400 hover:text-primary font-black text-xs uppercase tracking-widest mb-8 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Home
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Sidebar Info */}
          <div className="md:w-1/3 bg-slate-900 p-12 text-white text-center">
            <div className="relative inline-block mb-8 group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-slate-800 overflow-hidden border-4 border-slate-800 shadow-2xl mx-auto">
                <img 
                  src={profileData.photoURL || `https://ui-avatars.com/api/?name=${profileData.fullName}&background=5252ff&color=fff`} 
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Camera size={18} />
              </div>
            </div>
            <h2 className="text-2xl font-black mb-1">{profileData.fullName}</h2>
            <p className="text-primary font-bold text-xs uppercase tracking-widest mb-8">{profileData.role || 'Student'}</p>
            
            <div className="space-y-4 text-left">
              <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4">
                <Mail className="text-slate-500" size={18} />
                <span className="text-xs font-bold text-slate-300 truncate">{user.email}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4">
                <Phone className="text-slate-500" size={18} />
                <span className="text-xs font-bold text-slate-300">{profileData.contact || 'No contact'}</span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:w-2/3 p-12 lg:p-16">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Profile Settings</h3>
              {success && (
                <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-widest animate-in zoom-in">
                  <CheckCircle2 size={16} /> Changes Saved
                </div>
              )}
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      value={profileData.fullName}
                      onChange={e => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profile Photo URL</label>
                  <div className="relative">
                    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      value={profileData.photoURL}
                      onChange={e => setProfileData({...profileData, photoURL: e.target.value})}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">College / Institution</label>
                  <div className="relative">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      value={profileData.college}
                      onChange={e => setProfileData({...profileData, college: e.target.value})}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Branch / Stream</label>
                  <div className="relative">
                    <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      value={profileData.branch}
                      onChange={e => setProfileData({...profileData, branch: e.target.value})}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Contact</label>
                  <input 
                    value={profileData.contact}
                    onChange={e => setProfileData({...profileData, contact: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alt Contact (Optional)</label>
                  <input 
                    value={profileData.altContact}
                    onChange={e => setProfileData({...profileData, altContact: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 transition-all"
                  />
                </div>
              </div>

              <button 
                disabled={saving}
                type="submit"
                className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-lg hover:bg-primary-dark shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Update My Profile</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
