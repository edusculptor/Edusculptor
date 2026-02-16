
import React, { useState, useRef, useEffect } from 'react';
/* Added missing ArrowRight and Send icons to the imports */
import { Globe, TrendingUp, Heart, Code, Brush, Users, ChevronDown, CheckCircle2, MapPin, Briefcase, GraduationCap, Loader2, Link as LinkIcon, X, Search, ArrowRight, Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CareersPageProps {
  setView: (view: 'home' | 'about' | 'services' | 'programs' | 'portfolio' | 'contact' | 'careers' | 'auth') => void;
}

const CareersPage: React.FC<CareersPageProps> = ({ setView }) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [jobOpenings, setJobOpenings] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', portfolio: '', message: '', category: 'Engineering', resumeLink: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoadingJobs(true);
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedJobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobOpenings(fetchedJobs);
      setLoadingJobs(false);
    }, (err) => {
      console.error("Error fetching jobs:", err.message);
      setLoadingJobs(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApplyNow = (jobTitle: string) => {
    setForm(prev => ({ ...prev, category: jobTitle }));
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "applications"), {
        ...form,
        type: 'Job Application',
        position: form.category,
        submittedAt: serverTimestamp(),
        status: 'new'
      });
      setSuccess(true);
      setForm({ name: '', email: '', portfolio: '', message: '', category: 'Engineering', resumeLink: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error("Application Error:", err.message);
      alert("Application failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 bg-bg-light min-h-screen">
      {/* Hero */}
      <header className="relative pt-48 pb-32 overflow-hidden text-center bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="inline-block py-1.5 px-5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-8">Careers @ EduSculptor</span>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-none">Sculpting <br/><span className="text-primary">Future Talent.</span></h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            We are looking for bold innovators and creative problem solvers to help us build the next generation of digital excellence.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </header>

      {/* Benefits */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { icon: <Globe />, title: "Remote-First", desc: "Work from anywhere in the world. We value outcomes over office hours." },
            { icon: <TrendingUp />, title: "Rapid Growth", desc: "Join an agency at the forefront of digital transformation and scale your skills." },
            { icon: <Heart />, title: "Holistic Wellness", desc: "Comprehensive benefits designed to support your physical and mental health." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                {React.cloneElement(item.icon as any, { size: 28 })}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-500 font-bold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Job Board */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Open Positions</h2>
              <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Find your perfect fit</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
              <Search size={16} className="text-slate-400" />
              <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Live Listings</span>
            </div>
          </div>

          {loadingJobs ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-primary w-10 h-10" />
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Loading latest vacancies...</p>
            </div>
          ) : jobOpenings.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-xl">
              <Users className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-900">No vacancies currently.</h3>
              <p className="text-slate-500 font-bold mt-2">But we're always scouting! Send a general application below.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobOpenings.map(job => (
                <div key={job.id} className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl hover:shadow-2xl transition-all overflow-hidden group">
                  <button 
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                    className="w-full px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-left hover:bg-slate-50 transition-colors gap-6"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        {job.category === 'Engineering' ? <Code /> : job.category === 'Design' ? <Brush /> : <Users />}
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">{job.title}</h4>
                        <div className="flex items-center gap-6 text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">
                          <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg"><MapPin size={12} /> {job.location}</span>
                          <span className="flex items-center gap-2 bg-blue-50 text-primary px-3 py-1 rounded-lg"><Briefcase size={12} /> {job.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                      <span className="text-[10px] font-black text-slate-300 group-hover:text-primary transition-colors">{expandedJob === job.id ? 'Close' : 'View Details'}</span>
                      <ChevronDown className={`transition-transform duration-500 ${expandedJob === job.id ? 'rotate-180 text-primary' : 'text-slate-300'}`} />
                    </div>
                  </button>
                  {expandedJob === job.id && (
                    <div className="px-10 pb-10 pt-4 animate-in slide-in-from-top-6 duration-500">
                      <div className="h-px bg-slate-50 mb-10" />
                      <p className="text-lg text-slate-600 mb-10 font-medium leading-relaxed whitespace-pre-wrap">{job.description}</p>
                      <button 
                        onClick={() => handleApplyNow(job.title)} 
                        className="bg-primary text-white px-10 py-5 rounded-2xl font-black hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                      >
                        Apply for this Role <ArrowRight size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Form */}
      <section className="py-32 bg-white" ref={formRef}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-bg-light p-10 md:p-20 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            
            {success ? (
              <div className="text-center py-20 animate-in zoom-in">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4">Application Received!</h3>
                <p className="text-slate-500 font-bold text-lg">Thank you for sharing your journey. Our talent acquisition team will review your application and reach out if there's a match.</p>
                <button onClick={() => setSuccess(false)} className="mt-12 text-primary font-black uppercase text-xs tracking-[0.2em] hover:underline">Apply for another position</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Join the Pulse</h2>
                  <p className="text-slate-500 font-bold text-lg">Tell us who you are and what you build.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all" placeholder="Alex Rivera" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Professional Email</label>
                    <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all" placeholder="alex@company.com" type="email" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Target Role / Interest</label>
                  <input required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all" placeholder="e.g. Full Stack Engineer" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Resume / Cloud Storage Link (Public Access)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input required value={form.resumeLink} onChange={e => setForm({...form, resumeLink: e.target.value})} className="w-full pl-14 pr-8 py-5 rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all" placeholder="https://drive.google.com/..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Introduction / Cover Note</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-8 py-6 rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all h-40 resize-none" placeholder="What drives you to innovate?" />
                </div>

                <button disabled={loading} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-primary transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex justify-center items-center gap-4" type="submit">
                  {loading ? <Loader2 className="animate-spin" /> : <>Submit Application <Send size={20} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
