
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, Briefcase, Settings, LogOut, Search, Filter, 
  MoreVertical, Eye, CheckCircle, XCircle, Clock, TrendingUp, Mail, Phone, Calendar, 
  ChevronRight, Plus, FileText, Bold, Italic, Underline, List, Link as LinkIcon, 
  Image as ImageIcon, Quote, Code as CodeIcon, Type, Trash2, Save, Globe, 
  HelpCircle, Upload, BarChart3, ExternalLink, ShieldAlert, PenTool, PlusCircle,
  Copy, AlertTriangle, Terminal, Info, UserCheck, UserMinus, UserPlus, PieChart, Activity,
  X
} from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, updateDoc, 
  doc, deleteDoc, addDoc, serverTimestamp, setDoc 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface AdminPanelProps {
  onLogout: () => void;
  user: any;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, user }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'programs' | 'careers' | 'blog' | 'users'>('dashboard');
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'all'>('all');
  
  // Data States
  const [leads, setLeads] = useState<any[]>([]); 
  const [calls, setCalls] = useState<any[]>([]); 
  const [enrollments, setEnrollments] = useState<any[]>([]); 
  const [applications, setApplications] = useState<any[]>([]); 
  const [jobs, setJobs] = useState<any[]>([]); 
  const [blogs, setBlogs] = useState<any[]>([]); 
  const [platformUsers, setPlatformUsers] = useState<any[]>([]);
  
  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form States
  const [jobForm, setJobForm] = useState({ title: '', category: 'Engineering', location: 'Remote', type: 'Full-time', description: '' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '', author: 'Admin', image: '', category: 'Technology' });
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.email !== import.meta.env.ADMIN_EMAIL) return;

    const unsubLeads = onSnapshot(query(collection(db, "proposals"), orderBy("submittedAt", "desc")), 
      (snap) => setLeads(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'proposals' }))));

    const unsubCalls = onSnapshot(query(collection(db, "call_bookings"), orderBy("submittedAt", "desc")), 
      (snap) => setCalls(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'call_bookings' }))));

    const unsubEnroll = onSnapshot(query(collection(db, "enrollments"), orderBy("submittedAt", "desc")), 
      (snap) => setEnrollments(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'enrollments' }))));

    const unsubApps = onSnapshot(query(collection(db, "applications"), orderBy("submittedAt", "desc")), 
      (snap) => setApplications(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'applications' }))));

    const unsubJobs = onSnapshot(query(collection(db, "jobs"), orderBy("createdAt", "desc")), 
      (snap) => setJobs(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'jobs' }))));

    const unsubBlogs = onSnapshot(query(collection(db, "blogs"), orderBy("createdAt", "desc")), 
      (snap) => setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'blogs' }))));

    const unsubUsers = onSnapshot(query(collection(db, "users"), orderBy("createdAt", "desc")), 
      (snap) => setPlatformUsers(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'users' }))));

    return () => {
      unsubLeads(); unsubCalls(); unsubEnroll(); unsubApps(); unsubJobs(); unsubBlogs(); unsubUsers();
    };
  }, [user]);

  const handleDelete = async (id: string, collectionName: string) => {
    if (!id || !collectionName) {
      alert("Error: Missing document identity.");
      return;
    }
    if (window.confirm(`Confirm PERMANENT deletion from ${collectionName}? This action cannot be reversed.`)) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        if (selectedItem?.id === id) setSelectedItem(null);
      } catch (err: any) { 
        console.error("Delete error:", err);
        alert("Delete failed: " + err.message); 
      }
    }
  };

  const handleToggleStatus = async (item: any) => {
    const newStatus = item.status === 'connected' ? 'unselected' : 'connected';
    try {
      await updateDoc(doc(db, item.collection, item.id), { status: newStatus });
    } catch (err: any) { alert("Update failed: " + err.message); }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "jobs"), { ...jobForm, createdAt: serverTimestamp(), collection: 'jobs' });
      setShowForm(false);
      setJobForm({ title: '', category: 'Engineering', location: 'Remote', type: 'Full-time', description: '' });
    } catch (err: any) { alert("Job Post Error: " + err.message); }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlogId) {
        await updateDoc(doc(db, "blogs", editingBlogId), { ...blogForm, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "blogs"), { ...blogForm, createdAt: serverTimestamp(), collection: 'blogs' });
      }
      setShowForm(false);
      setEditingBlogId(null);
      setBlogForm({ title: '', content: '', author: 'Admin', image: '', category: 'Technology' });
    } catch (err: any) { alert("Blog Save Error: " + err.message); }
  };

  const combinedLeads = useMemo(() => {
    return [...leads, ...calls].sort((a, b) => 
      (b.submittedAt?.toMillis() || 0) - (a.submittedAt?.toMillis() || 0)
    );
  }, [leads, calls]);

  const filteredStats = useMemo(() => {
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;
    const month = 30 * 24 * 60 * 60 * 1000;
    
    const filterFn = (item: any) => {
      if (timeFilter === 'all') return true;
      const ts = item.submittedAt?.toMillis() || item.createdAt?.toMillis() || 0;
      return now - ts < (timeFilter === 'weekly' ? week : month);
    };

    const periodLeads = combinedLeads.filter(filterFn);
    const periodEnroll = enrollments.filter(filterFn);
    const periodUsers = platformUsers.filter(filterFn);

    const connectedLeads = periodLeads.filter(l => l.status === 'connected').length;
    const connectedEnroll = periodEnroll.filter(e => e.status === 'connected').length;

    const totalPeriod = periodLeads.length + periodEnroll.length;

    return {
      leads: periodLeads.length,
      enroll: periodEnroll.length,
      users: periodUsers.length,
      connectedRatio: totalPeriod === 0 ? 0 : Math.round(((connectedLeads + connectedEnroll) / totalPeriod) * 100),
      connectedCount: connectedLeads + connectedEnroll,
      unselectedCount: totalPeriod - (connectedLeads + connectedEnroll)
    };
  }, [combinedLeads, enrollments, platformUsers, timeFilter]);

  const filterItems = (items: any[]) => {
    return items.filter(item => 
      (item.name || item.title || item.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.email || item.college || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f3f5f9]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">E</span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">EduSculptor</span>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: <LayoutDashboard />, label: 'Analytics' },
              { id: 'leads', icon: <Users />, label: 'Leads CRM', count: combinedLeads.length },
              { id: 'programs', icon: <BookOpen />, label: 'Enrollments', count: enrollments.length },
              { id: 'careers', icon: <Briefcase />, label: 'Careers Hub', count: jobs.length },
              { id: 'blog', icon: <PenTool />, label: 'Insights Hub', count: blogs.length },
              { id: 'users', icon: <UserPlus />, label: 'User Directory', count: platformUsers.length },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setShowForm(false); setSelectedItem(null); }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all relative ${
                  activeTab === item.id ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {React.cloneElement(item.icon as any, { size: 20 })}
                <span className="flex-grow text-left">{item.label}</span>
                {item.count !== undefined && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8">
          <button onClick={onLogout} className="w-full flex items-center gap-3 text-red-500 font-black text-sm hover:translate-x-1 transition-transform border-t border-slate-100 pt-6">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 capitalize tracking-tight">{activeTab} Panel</h1>
            <p className="text-slate-400 font-bold text-sm mt-1">Intelligence & Asset Management</p>
          </div>
          
          <div className="flex gap-4">
            {(activeTab === 'careers' || activeTab === 'blog') && !showForm && (
              <button 
                onClick={() => { setShowForm(true); setEditingBlogId(null); }}
                className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 hover:bg-primary-dark transition-all"
              >
                <Plus size={18} /> {activeTab === 'careers' ? 'Post New Job' : 'Create Article'}
              </button>
            )}
            {activeTab === 'dashboard' && (
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                {(['weekly', 'monthly', 'all'] as const).map(t => (
                  <button 
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${timeFilter === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Deep Search..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 rounded-2xl bg-white border border-slate-200 outline-none focus:border-primary/50 font-bold text-sm w-72 shadow-sm" 
              />
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* Visual Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Growth Leads', value: filteredStats.leads, icon: <Activity className="text-orange-500" />, sub: 'New potential clients' },
                { label: 'New Enrollments', value: filteredStats.enroll, icon: <BookOpen className="text-blue-500" />, sub: 'Program admissions' },
                { label: 'Conversion', value: `${filteredStats.connectedRatio}%`, icon: <TrendingUp className="text-green-500" />, sub: 'Total connectivity' },
                { label: 'User Index', value: filteredStats.users, icon: <Users className="text-indigo-500" />, sub: 'Registered on platform' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6">
                      {stat.icon}
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-2">{stat.value}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-[10px] font-bold text-slate-300 mt-1 italic">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Graphical Analytics Card */}
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-50" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h3 className="text-2xl font-black mb-1">Conversion Health</h3>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Connected vs. Unselected Ratio</p>
                    </div>
                    <PieChart className="text-primary" size={32} />
                  </div>
                  
                  <div className="space-y-8 mb-12">
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                        <span className="text-green-400">Connected ({filteredStats.connectedCount})</span>
                        <span className="text-slate-400">{filteredStats.connectedRatio}%</span>
                      </div>
                      <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-1000"
                          style={{ width: `${filteredStats.connectedRatio}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                        <span className="text-orange-400">Unselected ({filteredStats.unselectedCount})</span>
                        <span className="text-slate-400">{100 - filteredStats.connectedRatio}%</span>
                      </div>
                      <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-1000"
                          style={{ width: `${100 - filteredStats.connectedRatio}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Growth Index</p>
                      <p className="text-3xl font-black text-primary">+{filteredStats.leads + filteredStats.enroll}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Period</p>
                      <p className="text-3xl font-black capitalize">{timeFilter}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Priority CRM Actions</h3>
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {combinedLeads.filter(l => l.status !== 'connected').slice(0, 10).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-primary/20 transition-all cursor-pointer group" onClick={() => setSelectedItem(item)}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 group-hover:text-primary transition-colors">{item.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{item.service || 'Strategy Call'}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  ))}
                  {combinedLeads.filter(l => l.status !== 'connected').length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="mx-auto text-green-500 mb-4" size={40} />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Inbox Clean</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Forms */}
        {showForm && (
          <div className="max-w-4xl bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black tracking-tight">
                {activeTab === 'careers' ? 'Post New Career Opportunity' : (editingBlogId ? 'Update Insight Article' : 'Compose Fresh Insight')}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-4 bg-slate-50 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                <X size={24} />
              </button>
            </div>

            {activeTab === 'careers' ? (
              <form onSubmit={handlePostJob} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
                    <input required placeholder="Full Stack Developer" className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-none" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <select className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-none appearance-none" value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})}>
                      <option>Engineering</option>
                      <option>Design</option>
                      <option>Marketing</option>
                      <option>Product</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                    <input required placeholder="Remote / Bengaluru" className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-none" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Employment Type</label>
                    <input required placeholder="Full-time / Part-time" className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-none" value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea required placeholder="Detailed job requirements..." className="w-full p-8 rounded-[2rem] bg-slate-50 font-medium border-none h-[200px] resize-none" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-primary text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95"><Save size={20} /> Publish Opening</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-12 py-6 bg-slate-100 text-slate-500 font-black rounded-[2rem] hover:bg-slate-200 transition-colors">Cancel</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveBlog} className="space-y-8">
                <input required placeholder="Insight Title" className="w-full p-6 rounded-3xl bg-slate-50 font-black text-2xl border-none focus:ring-4 focus:ring-primary/5 transition-all" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} />
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Author</label>
                    <input placeholder="Admin" className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-none" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Visual URL</label>
                    <input placeholder="https://unsplash.com/..." className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-none" value={blogForm.image} onChange={e => setBlogForm({...blogForm, image: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Article Body</label>
                  <textarea required placeholder="Begin masterpiece..." className="w-full p-8 rounded-[3rem] bg-slate-50 font-medium border-none h-[300px] resize-none focus:ring-4 focus:ring-primary/5 transition-all text-slate-700 leading-relaxed" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-slate-900 text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95"><Save size={20} /> {editingBlogId ? 'Update' : 'Publish'}</button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingBlogId(null); }} className="px-12 py-6 bg-slate-100 text-slate-500 font-black rounded-[2rem] hover:bg-slate-200 transition-colors">Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Global List View */}
        {activeTab !== 'dashboard' && !showForm && (
          <div className="grid grid-cols-3 gap-10">
            <div className="col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-10 py-6">Record Identity</th>
                      <th className="px-10 py-6">Primary Context</th>
                      <th className="px-10 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filterItems(
                      activeTab === 'leads' ? combinedLeads : 
                      activeTab === 'programs' ? enrollments : 
                      activeTab === 'careers' ? jobs : 
                      activeTab === 'users' ? platformUsers :
                      blogs
                    ).map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-8">
                          <p className="font-black text-slate-900 text-sm">{item.name || item.title || item.fullName}</p>
                          <span className="text-[10px] font-black text-primary uppercase tracking-tighter">
                            {item.email || item.category || 'Platform Account'}
                          </span>
                        </td>
                        <td className="px-10 py-8">
                          <p className="text-xs font-bold text-slate-600 truncate max-w-[200px]">
                            {activeTab === 'users' ? `${item.college}` : (item.service || item.courseName || item.position || item.author)}
                          </p>
                          {(item.submittedAt || item.createdAt) && (
                            <span className="text-[9px] text-slate-400 font-black uppercase">
                              {new Date((item.submittedAt || item.createdAt).toMillis()).toLocaleDateString()}
                            </span>
                          )}
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            {['leads', 'programs'].includes(activeTab) && (
                              <button 
                                onClick={() => handleToggleStatus(item)} 
                                className={`p-2.5 rounded-xl transition-all ${item.status === 'connected' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 hover:text-orange-500'}`}
                                title={item.status === 'connected' ? 'Connected' : 'Mark Priority'}
                              >
                                {item.status === 'connected' ? <UserCheck size={18} /> : <UserMinus size={18} />}
                              </button>
                            )}
                            <button onClick={() => setSelectedItem(item)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary transition-all rounded-xl hover:bg-white hover:shadow-md"><Eye size={18} /></button>
                            {activeTab === 'blog' && (
                              <button onClick={() => { setEditingBlogId(item.id); setBlogForm({ ...item }); setShowForm(true); }} className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-500 transition-all rounded-xl hover:bg-white hover:shadow-md">
                                <PenTool size={18} />
                              </button>
                            )}
                            <button onClick={() => handleDelete(item.id, item.collection || activeTab)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 transition-all rounded-xl hover:bg-white hover:shadow-md"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side Inspector */}
            <div className="col-span-1">
              <div className="sticky top-12">
                {selectedItem ? (
                  <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10 animate-in slide-in-from-right duration-500">
                    <div className="text-center mb-10">
                      <div className="w-20 h-20 bg-primary text-white rounded-[2rem] flex items-center justify-center font-black text-3xl mx-auto mb-6 shadow-xl shadow-primary/20 overflow-hidden">
                        {selectedItem.photoURL ? (
                          <img src={selectedItem.photoURL} className="w-full h-full object-cover" />
                        ) : (
                          (selectedItem.name || selectedItem.title || selectedItem.fullName)?.charAt(0)
                        )}
                      </div>
                      <h4 className="text-xl font-black text-slate-900 leading-tight">{selectedItem.name || selectedItem.title || selectedItem.fullName}</h4>
                      <div className="flex justify-center gap-2 mt-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{selectedItem.collection || activeTab}</span>
                        {selectedItem.status && (
                          <span className={`text-[10px] font-black uppercase px-2 rounded ${selectedItem.status === 'connected' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            {selectedItem.status}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-6 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Connectivity</p>
                        <p className="text-sm font-black text-slate-900 flex items-center gap-2 truncate"><Mail size={14} className="text-slate-300" /> {selectedItem.email || 'N/A'}</p>
                        {(selectedItem.phone || selectedItem.contact) && <p className="text-sm font-bold text-slate-500 mt-2 flex items-center gap-2"><Phone size={14} className="text-slate-300" /> {selectedItem.phone || selectedItem.contact}</p>}
                      </div>
                      <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Internal Context</p>
                        <p className="text-sm font-black text-slate-900 leading-relaxed">
                          {selectedItem.service || selectedItem.courseName || selectedItem.position || selectedItem.category || 'Platform Member'}
                        </p>
                        {selectedItem.college && <p className="text-xs text-slate-500 font-bold mt-2 italic">{selectedItem.college} • {selectedItem.branch}</p>}
                      </div>
                      {selectedItem.message && (
                        <div className="bg-slate-50 p-6 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Message Payload</p>
                          <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-4">"{selectedItem.message}"</p>
                        </div>
                      )}
                      <div className="flex gap-4 pt-4">
                        <button onClick={() => handleDelete(selectedItem.id, selectedItem.collection || activeTab)} className="flex-1 bg-red-50 text-red-500 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Delete Record</button>
                        <button onClick={() => setSelectedItem(null)} className="flex-1 border border-slate-200 text-slate-400 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Close</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[500px] border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-10 text-slate-300 font-black text-center animate-pulse">
                    <BarChart3 size={48} className="mb-4 opacity-10" />
                    <p className="text-sm uppercase tracking-widest opacity-20">Monitoring Realtime Streams...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
