
import React from 'react';
import { TrendingUp, Users } from 'lucide-react';

interface HeroProps {
  setView: (view: 'home' | 'about' | 'services' | 'programs' | 'portfolio' | 'contact' | 'careers' | 'auth') => void;
}

const Hero: React.FC<HeroProps> = ({ setView }) => {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 bg-primary overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 text-xs font-bold uppercase tracking-widest mb-6">
              Pioneering Digital Education
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-8">
              Sculpting the Future of <span className="text-blue-200">Digital Excellence.</span>
            </h1>
            <p className="text-xl text-blue-50/80 mb-10 leading-relaxed max-w-xl">
              Premium training and digital solutions tailored for the next generation of innovators. We bridge the gap between academic theory and industry reality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 mb-12">
              <button 
                onClick={() => setView('programs')}
                className="bg-white text-primary hover:bg-blue-50 px-10 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-xl"
              >
                Explore Programs
              </button>
              <button 
                onClick={() => setView('services')}
                className="border-2 border-white/40 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold transition-all shadow-xl"
              >
                Our Agency Services
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i} 
                    src={`https://picsum.photos/seed/${i + 10}/100/100`} 
                    className="w-12 h-12 rounded-full border-2 border-primary object-cover" 
                    alt="User"
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-200" />
                <p className="text-sm font-medium text-blue-100">Joined by 2,500+ professionals this year</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-700">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
                alt="Digital Excellence" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>

            {/* Success Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-5 max-w-xs animate-bounce-slow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-green-600 w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">98%</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Placement Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
