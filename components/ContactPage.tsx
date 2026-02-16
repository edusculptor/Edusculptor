
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Linkedin, Twitter, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ContactPageProps {
  setView: (view: 'home' | 'about' | 'services' | 'programs' | 'portfolio' | 'contact') => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ setView }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: 'Digital Transformation', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "proposals"), {
        ...form,
        type: 'Proposal Request',
        submittedAt: serverTimestamp(),
        status: 'new'
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', service: 'Digital Transformation', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 bg-bg-light min-h-screen">
      {/* Hero Section */}
      <header className="relative bg-primary py-32 lg:py-48 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight">
            Let's Build Something <br className="hidden md:block" /> Great Together
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Have a project in mind? Our team of digital experts is ready to help you scale through innovative technology and transformative training.
          </p>
        </div>
      </header>

      {/* Main Contact Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 lg:-mt-24 pb-32 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 grid lg:grid-cols-2">
          
          {/* Left Column: Form */}
          <div className="p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-50">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
                <h2 className="text-3xl font-black text-slate-900 mb-4">Proposal Requested!</h2>
                <p className="text-slate-500 font-bold max-w-xs mx-auto">Thank you for reaching out. An expert from our strategy team will contact you within 24 hours.</p>
                <button onClick={() => setSuccess(false)} className="mt-8 text-primary font-black hover:underline">Send another request</button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4">
                  <Mail className="text-primary w-8 h-8" />
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        placeholder="John Doe" 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-700" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        placeholder="john@company.com" 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-700" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <input 
                        type="tel" 
                        value={form.phone}
                        onChange={e => setForm({...form, phone: e.target.value})}
                        placeholder="+1 (555) 000-0000" 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-700" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Inquiry Service</label>
                      <select 
                        value={form.service}
                        onChange={e => setForm({...form, service: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                      >
                        <option>Digital Transformation</option>
                        <option>Corporate Training</option>
                        <option>Custom Software</option>
                        <option>Tech Consulting</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Message</label>
                    <textarea 
                      required 
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      placeholder="Tell us about your project or goals..." 
                      rows={5} 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-700 resize-none" 
                    />
                  </div>

                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full md:w-auto px-12 py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Request Proposal"} <Send className="w-5 h-5" />
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Right Column: Info & Map */}
          <div className="bg-primary/5 p-10 lg:p-16 flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-black text-slate-900 mb-12">Contact Information</h3>
              <div className="space-y-12">
                {[
                  { icon: <MapPin />, title: "Our Office", detail: "123 Technology Plaza, Suite 400 San Francisco, CA 94103" },
                  { icon: <Phone />, title: "Direct Line", detail: "+1 (800) EDU-SCULPT" },
                  { icon: <Clock />, title: "Office Hours", detail: "Mon - Fri: 9:00 AM - 6:00 PM PST" }
                ].map((info, i) => (
                  <div key={i} className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      {React.cloneElement(info.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg mb-1 uppercase tracking-tight">{info.title}</p>
                      <p className="text-slate-500 font-bold leading-relaxed">{info.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16">
              <div className="rounded-[2.5rem] overflow-hidden h-64 w-full bg-slate-200 relative group shadow-xl border-4 border-white">
                <img 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAchVhABbWTp7HPSIVxfT13PAmtziu_iWWbKxRrkPFghIMe_IuRUZUsZmDYBXj0Cm9pOvvOLEyuqaZFDNqA9MrXk0OeSJAsl5kMK56D04x99YVIKGe_RNR7ulQTYCJ7ifmoS-DbBb2RZJzbNwSuCrYu4y56dJDzKI29V9v2EOcQklHMwrdGnOyCLHbYM8OVTd_0ZxQ-qrF4rSFaDk6if1WlCApHh7q08Yy7VXzctomGJMArmAe1JDwKQurZGJAeBN8hB-IjFvbcRN0" 
                  alt="Office Location Map" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl ring-8 ring-white/50">
                    <MapPin className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Social Connect */}
              <div className="mt-12">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Connect with us</p>
                <div className="flex gap-4">
                  {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
                    <a 
                      key={i} 
                      href="#" 
                      className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:scale-110 border border-transparent shadow-lg transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
