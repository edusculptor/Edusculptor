
import React from 'react';
import { Clock, BarChart, ArrowRight } from 'lucide-react';

interface ProgramsProps {
  setView: (view: 'home' | 'about' | 'services' | 'programs' | 'portfolio' | 'contact' | 'careers' | 'auth') => void;
}

const programs = [
  {
    image: "https://images.unsplash.com/photo-1551288049-bbda3efb142c?auto=format&fit=crop&q=80&w=800",
    title: "Data Science Bootcamp",
    desc: "Master Python, SQL, and Machine Learning with real-world financial datasets.",
    duration: "12 Weeks",
    level: "Intermediate",
    bestseller: true
  },
  {
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800",
    title: "Product Design Masters",
    desc: "End-to-end UX/UI process from research to high-fidelity interactive prototyping.",
    duration: "8 Weeks",
    level: "Beginner",
    bestseller: false
  },
  {
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    title: "Full-stack Software Eng.",
    desc: "Intensive program covering Next.js, Node, and AWS architecture for production.",
    duration: "16 Weeks",
    level: "Advanced",
    bestseller: false
  }
];

const Programs: React.FC<ProgramsProps> = ({ setView }) => {
  return (
    <section id="programs" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-primary font-extrabold uppercase tracking-widest text-sm mb-4">Education</h2>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900">Career Accelerators</h3>
          </div>
          <button 
            onClick={() => setView('programs')}
            className="flex items-center gap-3 text-primary font-bold hover:gap-5 transition-all group border-b-2 border-transparent hover:border-primary pb-1"
          >
            View All Programs <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {programs.map((p, i) => (
            <div key={i} className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {p.bestseller && (
                  <div className="absolute top-6 left-6 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                    Bestseller
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" /> {p.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-primary rounded-full text-xs font-bold">
                    <BarChart className="w-3.5 h-3.5" /> {p.level}
                  </span>
                </div>
                
                <h4 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-primary transition-colors">{p.title}</h4>
                <p className="text-slate-500 leading-relaxed mb-8 flex-grow">
                  {p.desc}
                </p>
                
                <button 
                  onClick={() => setView('programs')}
                  className="w-full py-4 border-2 border-primary/20 text-primary font-extrabold rounded-2xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
