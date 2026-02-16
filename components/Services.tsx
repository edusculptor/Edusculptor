
import React from 'react';
import { Lightbulb, BrainCircuit, Brush, Code, Cloud, Zap } from 'lucide-react';

const services = [
  {
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
    title: "Digital Strategy",
    desc: "Tailored roadmaps designed to scale your business using cutting-edge market insights."
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: "Custom Training",
    desc: "Corporate and individual training modules focused on practical industry application."
  },
  {
    icon: <Brush className="w-8 h-8 text-primary" />,
    title: "UI/UX Design",
    desc: "User-centric designs that drive engagement and create memorable digital experiences."
  },
  {
    icon: <Code className="w-8 h-8 text-primary" />,
    title: "Full-stack Dev",
    desc: "Scalable web and mobile applications built with modern frameworks and clean code."
  },
  {
    icon: <Cloud className="w-8 h-8 text-primary" />,
    title: "Cloud Solutions",
    desc: "Modernize your infrastructure with secure and cost-effective cloud transitions."
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "AI Integration",
    desc: "Leverage artificial intelligence to automate workflows and unlock data insights."
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-primary font-extrabold uppercase tracking-[0.2em] text-sm mb-4">Our Expertise</h2>
          <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900">Comprehensive Digital Solutions</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, idx) => (
            <div 
              key={idx}
              className="p-10 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-primary/5 transition-transform">
                {s.icon}
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-900">{s.title}</h4>
              <p className="text-slate-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
