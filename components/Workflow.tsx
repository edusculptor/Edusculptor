
import React from 'react';

const steps = [
  { id: '01', title: "Discovery", desc: "In-depth research and consultation to define project objectives." },
  { id: '02', title: "Strategy", desc: "Crafting a strategic roadmap tailored to your unique requirements." },
  { id: '03', title: "Execution", desc: "Agile development and implementation by our expert squads." },
  { id: '04', title: "Optimization", desc: "Continuous monitoring and scaling for maximum long-term impact." }
];

const Workflow: React.FC = () => {
  return (
    <section id="our-process" className="py-24 bg-primary text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] border-[50px] border-white rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-blue-200 font-extrabold uppercase tracking-[0.3em] text-sm mb-4">Our Workflow</h2>
        <h3 className="text-4xl lg:text-6xl font-black mb-20 tracking-tight">The Path to Success</h3>
        
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-white/20 -z-0" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 group">
                <div className={`w-24 h-24 bg-white rounded-[2rem] mx-auto flex items-center justify-center mb-10 shadow-2xl transition-transform duration-500 ${i % 2 === 0 ? 'rotate-3 group-hover:rotate-0' : '-rotate-3 group-hover:rotate-0'}`}>
                  <span className="text-primary text-4xl font-black">{s.id}</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 tracking-tight">{s.title}</h4>
                <p className="text-blue-100/80 leading-relaxed max-w-[240px] mx-auto">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
