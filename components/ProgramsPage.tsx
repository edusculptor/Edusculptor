
import React, { useState } from 'react';
import { 
  BadgeCheck, 
  Users, 
  Briefcase, 
  Clock, 
  BarChart, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  FileDown, 
  X, 
  Mail, 
  Phone, 
  User as UserIcon,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ProgramsPageProps {
  setView: (view: 'home' | 'about' | 'services' | 'programs' | 'portfolio') => void;
}

const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;

const programsList = [
  {
    category: "Development",
    title: "Advanced Full Stack Web Development",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800",
    duration: "6 Months",
    level: "Beginner",
    modules: ["React & Modern Frontend", "Node.js & Microservices", "Database (SQL & NoSQL)"],
    outcome: "Junior Full Stack Dev",
    salary: "$85k/yr",
    type: "Live Batch",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    category: "Data Science",
    title: "Data Science & Machine Learning",
    img: "https://images.unsplash.com/photo-1551288049-bbda3efb142c?auto=format&fit=crop&w=800",
    duration: "8 Months",
    level: "Advanced",
    modules: ["Advanced Python & Statistics", "Predictive Modeling & ML", "Big Data & Cloud Computing"],
    outcome: "Data Scientist",
    salary: "$110k/yr",
    type: "Fast-Track",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    category: "Design",
    title: "Mastering UX Research & UI Design",
    img: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800",
    duration: "4 Months",
    level: "Beginner",
    modules: ["Figma & Design Systems", "User Research & Persona", "Interactive Prototyping"],
    outcome: "Product Designer",
    salary: "$75k/yr",
    type: "Creative",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    category: "Finance",
    title: "Professional Trading & Risk Analysis",
    img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800",
    duration: "12 Weeks",
    level: "Advanced",
    modules: ["Technical Analysis Pro", "Options Trading Strategies", "Portfolio & Risk Management"],
    outcome: "Financial Trader",
    salary: "High-Yield",
    type: "Strategic",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    category: "Marketing",
    title: "Digital Marketing & Growth Hacking",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800",
    duration: "5 Months",
    level: "Beginner",
    modules: ["SEO, SEM & PPC Ads", "Content & Social Strategy", "Analytics & CRM Tools"],
    outcome: "Growth Marketer",
    salary: "$65k/yr",
    type: "Growth",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

const categories = ["All Programs", "Development", "Data Science", "Design", "Finance", "Marketing"];

const ProgramsPage: React.FC<ProgramsPageProps> = ({ setView }) => {
  const [activeTab, setActiveTab] = useState("All Programs");
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  const filteredPrograms = activeTab === "All Programs" 
    ? programsList 
    : programsList.filter(p => p.category === activeTab);

  const openEnrollModal = (courseTitle: string) => {
    setSelectedCourse(courseTitle);
    setShowModal(true);
    setError(null);
  };

  const sendEmailViaBrevo = async (toEmail: string, toName: string, course: string) => {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: "EduSculptor IT Solutions", email: "info@edusculptor.com" },
          to: [{ email: toEmail, name: toName }],
          subject: `Enrollment Confirmation: ${course} – EduSculptor`,
          htmlContent: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 40px; border-radius: 20px;">
              <h2 style="color: #5252ff;">Hello ${toName},</h2>
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Thank you for applying for the <b>${course}</b> at EduSculptor. We have received your application successfully!
              </p>
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Our admissions team will review your profile and connect with you within 24-48 business hours to discuss the next steps.
              </p>
              <div style="margin: 30px 0; padding: 20px; background: #f8f9fc; border-radius: 10px;">
                <p style="margin: 0; color: #5252ff; font-weight: bold;">Application Details:</p>
                <p style="margin: 5px 0;"><b>Course:</b> ${course}</p>
                <p style="margin: 5px 0;"><b>Status:</b> Application Received</p>
              </div>
              <p style="font-size: 14px; color: #777;">
                If you have any immediate questions, feel free to reply to this mail or contact us at <a href="mailto:info@edusculptor.com">info@edusculptor.com</a>.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #aaa; text-align: center;">
                © 2024 EduSculptor IT Solutions. All rights reserved.
              </p>
            </div>
          `
        })
      });
      return response.ok;
    } catch (err) {
      console.error("Brevo API error:", err);
      return false;
    }
  };

  const handleEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // 1. Save to Firestore (Simulating your Excel Sheet)
      await addDoc(collection(db, "enrollments"), {
        ...form,
        courseName: selectedCourse,
        submittedAt: serverTimestamp(),
        status: 'new'
      });

      // 2. Send Real Email via Brevo
      await sendEmailViaBrevo(form.email, form.name, selectedCourse);

      setShowModal(false);
      setForm({ name: '', email: '', phone: '' });
      setToast({ show: true, msg: 'Enrollment Submitted! Check your email for confirmation.' });
      setTimeout(() => setToast({ show: false, msg: '' }), 5000);
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("permission-denied")) {
        setError("Firebase Permission Error: Please update your Firestore Rules to allow 'create' on the 'enrollments' collection.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 bg-bg-light min-h-screen relative">
      
      {/* Toast Feedback */}
      {toast.show && (
        <div className="fixed top-24 right-8 z-[100] bg-white border-2 border-primary p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-300">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-primary w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-slate-900 leading-tight">Request Received!</p>
            <p className="text-sm text-slate-500 font-bold">{toast.msg}</p>
          </div>
        </div>
      )}

      {/* Enrollment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
            <div className="bg-primary p-12 text-white relative">
              <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-white/60 hover:text-white">
                <X className="w-8 h-8" />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black mb-2">Enroll Now</h3>
              <p className="text-blue-100 font-bold text-lg">{selectedCourse}</p>
            </div>
            <form onSubmit={handleEnrollment} className="p-12 space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-start gap-3 text-sm font-bold">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" placeholder="John Doe" className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-slate-700" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" placeholder="john@example.com" className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-slate-700" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} type="tel" placeholder="+91 00000 00000" className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-slate-700" />
                </div>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center gap-3">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm Enrollment"}
              </button>
              <div className="flex items-center gap-3 justify-center text-slate-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Application System</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="pt-48 pb-32 text-center max-w-7xl mx-auto px-4">
        <span className="inline-block py-1.5 px-5 rounded-full bg-primary/10 text-primary text-xs font-black mb-8 tracking-widest uppercase">Career Accelerators</span>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-tight tracking-tight">Industry-Led <br/><span className="text-primary">Global Programs</span></h1>
        <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">Sculpt your career path with intensive programs designed and delivered by industry veterans from the world's leading technology firms.</p>
        
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-8 py-3.5 rounded-3xl font-black text-xs transition-all uppercase tracking-widest ${activeTab === cat ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}>
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPrograms.map((p, i) => (
            <div key={i} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-primary/20 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
                    {p.type}
                  </span>
                </div>
              </div>

              <div className="p-10 flex-grow flex flex-col">
                <div className="flex gap-4 mb-6">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5" /> {p.duration}
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-lg">
                    <BarChart className="w-3.5 h-3.5" /> {p.level}
                  </span>
                </div>

                <h3 className="text-2xl font-black mb-8 text-slate-900 leading-tight group-hover:text-primary transition-colors">{p.title}</h3>

                <div className="space-y-4 mb-10 flex-grow">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Curriculum Highlights</p>
                  {p.modules.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm font-bold text-slate-600">{m}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto space-y-3">
                  <button 
                    onClick={() => openEnrollModal(p.title)}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
                  >
                    Enroll Now <ArrowRight className="w-5 h-5" />
                  </button>
                  <a 
                    href={p.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border-2 border-slate-100 text-slate-500 py-3.5 rounded-2xl font-black hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
                  >
                    <FileDown className="w-4 h-4" /> Course Details PDF
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProgramsPage;
