
import React, { useState } from 'react';
import { 
  Globe, Smartphone, Database, Megaphone, Palette, ArrowRight, 
  CheckCircle2, Layout, Zap, Users, X, Calendar, Clock, Phone, Mail, 
  User as UserIcon, Loader2, Target, BarChart, ShieldCheck
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ServicesPageProps {
  setView: (view: 'home' | 'about' | 'services' | 'programs' | 'portfolio' | 'contact' | 'careers' | 'auth' | 'admin') => void;
  user: any;
}

const serviceOfferings = [
  {
    icon: <Globe />,
    title: "Web Development",
    desc: "Custom-built, responsive ecosystems and portals designed for performance.",
    features: ["Next.js & React", "E-commerce Solutions", "Custom CMS", "API Integration"]
  },
  {
    icon: <Smartphone />,
    title: "App Development",
    desc: "Native and cross-platform mobile experiences that users love.",
    features: ["iOS & Android", "React Native", "Flutter Apps", "App Store Optimization"]
  },
  {
    icon: <Database />,
    title: "Cloud & CRM",
    desc: "Scalable infrastructure and customer relationship management systems.",
    features: ["AWS/GCP Setup", "Salesforce Integration", "Data Warehousing", "Legacy Migration"]
  },
  {
    icon: <Palette />,
    title: "UI/UX Design",
    desc: "Award-winning interfaces centered around human-first interaction.",
    features: ["User Research", "Prototyping", "Design Systems", "Usability Testing"]
  },
  {
    icon: <Megaphone />,
    title: "Digital Strategy",
    desc: "Data-driven growth hacking and market entry strategies.",
    features: ["Growth Hacking", "SEO/SEM Strategy", "Social Media Management", "Brand Identity"]
  },
  {
    icon: <Zap />,
    title: "AI & Automation",
    desc: "Modernize workflows with custom AI models and automations.",
    features: ["LLM Integration", "Workflow Automation", "Predictive Analytics", "Chatbot Dev"]
  }
];

const ServicesPage: React.FC<ServicesPageProps> = ({ setView, user }) => {
  const [modalType, setModalType] = useState<'none' | 'call' | 'proposal'>('none');
  const [selectedService, setSelectedService] = useState('Digital Transformation');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', preferredDate: '' });

  const handleOpenCallBooking = () => {
    if (!user) {
      setView('auth');
      return;
    }
    setModalType('call');
  };

  const handleOpenProposal = (service: string) => {
    setSelectedService(service);
    setModalType('proposal');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const collectionName = modalType === 'call' ? 'call_bookings' : 'proposals';
      await addDoc(collection(db, collectionName), {
        ...form,
        service: selectedService,
        userId: user?.uid || 'guest',
        type: modalType === 'call' ? 'Strategy Call' : 'Proposal Request',
        submittedAt: serverTimestamp(),
        status: 'new'
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setModalType('none');
        setForm({ name: '', email: '', phone: '', message: '', preferredDate: '' });
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 bg-bg-light">
      {/* Modals */}
      {modalType !== 'none' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalType('none')} />
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className={`p-10 text-white ${modalType === 'call' ? 'bg-primary' : 'bg-slate-900'}`}>
              <button onClick={() => setModalType('none')} className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors">
                <X size={28} />
              </button>
              <h3 className="text-3xl font-black mb-2 tracking-tight">
                {modalType === 'call' ? 'Book a Strategy Call' : 'Request a Proposal'}
              </h3>
              <p className="text-white/70 font-bold">{selectedService}</p>
            </div>
            
            {success ? (
              <div className="p-20 text-center animate-in fade-in">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-2xl font-black text-slate-900">Request Sent!</h4>
                <p className="text-slate-500 font-bold mt-2">Our team will reach out to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 text-sm" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 text-sm" placeholder="john@company.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                    <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} type="tel" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 text-sm" placeholder="+1..." />
                  </div>
                  {modalType === 'call' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Date</label>
                      <input required value={form.preferredDate} onChange={e => setForm({...form, preferredDate: e.target.value})} type="date" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 text-sm" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message / Requirements</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 text-sm h-24 resize-none" placeholder="How can we help you?" />
                </div>
                <button disabled={loading} type="submit" className={`w-full py-5 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all ${modalType === 'call' ? 'bg-primary shadow-primary/30 hover:bg-primary-dark' : 'bg-slate-900 shadow-slate-200 hover:bg-slate-800'}`}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Submit Request'} <ArrowRight size={20} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Reverted Hero Section (Premium Blue) */}
      <header className="relative bg-primary pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-white rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center text-white relative z-10">
          <span className="inline-block py-1.5 px-5 rounded-full bg-white/20 text-white text-[10px] font-black tracking-widest uppercase mb-8">
            Digital Agency & Strategy Hub
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight">
            Sculpting Your Digital <br className="hidden md:block" /> <span className="text-blue-200">Excellence.</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            From custom ecosystem development to high-conversion growth strategies, we deliver precision-engineered digital solutions for global brands.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button onClick={() => handleOpenProposal('Agency Services')} className="w-full sm:w-auto bg-white text-primary px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-2xl shadow-black/10">
              Request a Proposal
            </button>
            <button onClick={handleOpenCallBooking} className="w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-lg border-2 border-white/30 text-white hover:bg-white/10 transition-all">
              Book a Strategy Call
            </button>
          </div>
        </div>
      </header>

      {/* Restored Service Grid Layout */}
      <section className="py-24 relative z-10 -mt-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceOfferings.map((service, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all group flex flex-col">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                  {React.cloneElement(service.icon as any, { size: 28 })}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed mb-8 flex-grow">
                  {service.desc}
                </p>
                
                <div className="space-y-3 mb-10">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-tighter">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleOpenProposal(service.title)} 
                  className="w-full py-4 rounded-xl border-2 border-slate-50 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2"
                >
                  Request Details <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Detail Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-primary font-black uppercase text-xs tracking-[0.3em] mb-4 block">Our Approach</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">Data-Driven, <br/>Human-Focused.</h2>
              <div className="space-y-8">
                {[
                  { icon: <Target className="text-orange-500" />, title: "Precision Discovery", desc: "We dive deep into your business metrics and user behavior before writing a single line of code." },
                  { icon: <BarChart className="text-indigo-500" />, title: "Agile Execution", desc: "Transparent, sprint-based development that ensures rapid time-to-market and iterative growth." },
                  { icon: <ShieldCheck className="text-green-500" />, title: "Scalable Results", desc: "We build for the future, ensuring your digital assets grow alongside your business ambitions." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      {React.cloneElement(item.icon as any, { size: 24 })}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800" 
                  alt="Team Collaboration" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-2xl max-w-xs animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 leading-none">500+</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Successful Deployments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[4rem] p-16 md:p-24 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Ready to scale?</h2>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                Join the ranks of high-growth companies that use EduSculptor to sculpt their digital future.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <button onClick={() => handleOpenProposal('General Inquiry')} className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20">
                  Request a Proposal
                </button>
                <button onClick={handleOpenCallBooking} className="bg-white/5 border-2 border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all">
                  Book Strategy Call
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
