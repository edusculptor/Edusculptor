
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const Trust: React.FC = () => {
  const points = [
    { title: "Expert Mentorship", desc: "Direct access to industry veterans with 10+ years of experience in Fortune 500 companies." },
    { title: "Industry-Standard Curriculum", desc: "Regularly updated modules that reflect real-time market demands and technology shifts." },
    { title: "Job Placement Support", desc: "Dedicated career coaching, resume workshops, and direct hiring partner connections." }
  ];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000" 
              alt="Collaboration" 
              className="rounded-3xl shadow-2xl relative z-10 w-full object-cover aspect-[4/3]"
            />
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-primary/5 rounded-3xl -z-0" />
          </div>

          <div>
            <h3 className="text-4xl lg:text-5xl font-extrabold mb-10 text-slate-900 leading-tight">
              Why Industry Leaders Trust EduSculptor
            </h3>
            
            <div className="space-y-10">
              {points.map((p, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-slate-900">{p.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
