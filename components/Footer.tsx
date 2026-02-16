
import React from 'react';
import { Palette, Facebook, Instagram, Github, Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';

interface FooterProps {
  setView: (view: 'home' | 'about' | 'services' | 'programs' | 'portfolio' | 'contact' | 'careers' | 'blog' | 'auth' | 'admin') => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-slate-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-16 mb-20">
          {/* Brand Col */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => setView('home')}>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Palette className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight">EduSculptor</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-8 font-medium">
              Sculpting digital excellence through professional agency services and expert-led training programs for the modern world.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Github, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">Quick Links</h5>
            <ul className="space-y-4 text-slate-300 font-bold text-sm">
              <li><button onClick={() => setView('home')} className="hover:text-primary transition-colors">Home</button></li>
              <li><button onClick={() => setView('programs')} className="hover:text-primary transition-colors">Career Programs</button></li>
              <li><button onClick={() => setView('blog')} className="hover:text-primary transition-colors">Insights (Blog)</button></li>
              <li><button onClick={() => setView('portfolio')} className="hover:text-primary transition-colors">Our Portfolio</button></li>
              <li><button onClick={() => setView('services')} className="hover:text-primary transition-colors">Agency Services</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">Company</h5>
            <ul className="space-y-4 text-slate-300 font-bold text-sm">
              <li><button onClick={() => setView('about')} className="hover:text-primary transition-colors">Our Story (About)</button></li>
              <li><button onClick={() => setView('careers')} className="hover:text-primary transition-colors">Careers</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-primary transition-colors">Contact Us</button></li>
              <li><button className="hover:text-primary transition-colors">Partner With Us</button></li>
            </ul>
          </div>

          {/* Stay Updated */}
          <div>
            <h5 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">Stay Updated</h5>
            <p className="text-sm text-slate-400 mb-6 font-medium">Join 5,000+ graduates getting our weekly tech insights.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white transition-all text-sm"
              />
              <button className="w-full bg-primary hover:bg-primary-dark text-white font-black py-3.5 rounded-xl transition-all shadow-xl shadow-primary/20 text-sm">
                Get Early Access
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 font-bold text-xs uppercase tracking-widest">
          <p>© 2024 EduSculptor Agency. Proudly built for innovators.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Compliance</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
