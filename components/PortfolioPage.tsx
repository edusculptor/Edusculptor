
import React, { useState } from 'react';
/* Removed non-existent Visibility icon and will use Eye instead */
import { Eye, Smartphone, Palette, ArrowRight, Send, Globe, Layout, Layers } from 'lucide-react';

interface PortfolioPageProps {
  setView: (view: 'home' | 'about' | 'services' | 'programs' | 'portfolio') => void;
}

const portfolioItems = [
  {
    category: "Web Design",
    title: "EduPortal 2.0",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVh4sKQ0Dd13IOUMbmlA929MHPqDeCpbFw_K7lODyS9l2XLzPcwEKEqDMOgOgTQBLSsZdPFDncL-ksx4YCi2kt2nzSIa3eta9G3sp3aJp7xAtG4bfzAquqa38ZeHtftJVGkT_86g6-sqrdo2VXbbvW82TClRX1mZjDwMaYxM9h5mCTKNWEVTeY-bahwMnKTYfXqnTN-DRKHFA-9c706eZReoNBS_gkzvbq3PEi-o41RbwFuYfHgHmeutbb1otPXXyMHIyV8WqRy7o",
    desc: "A full-scale Learning Management System (LMS) redesign, streamlining digital learning for over 50k+ students globally.",
    tag: "LMS Solutions",
    icon: <Globe className="w-4 h-4" />
  },
  {
    category: "App Development",
    title: "SkillUp Mobile",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbDPaGyKQeefoyhwSNd6wHFJqIVLYonwkvvfE-aa2k9UpDaYgtYrZS8Pu_2WuLezEY7ZZsOsWS9Cuw4uVFDJhtEr-GIazrCKH9oYTPZ9tl4pWdWRYbVJ2v084Svyp4le_dUC2nA5Y2fnq8lMGU5GjcwkyWZ6pV-6VfxQ0FXXDPcrVezgqCNt3tV8jQTgjAUI3Na1pLzGhrW9Apc_UqaEcmmO8VazS2x96vYQg1VXir1csKuZz3Bf7eGvqaReOv4MHP5W2Bv-9XwzQ",
    desc: "Micro-learning application featuring AI-driven personalized paths and offline course synchronization.",
    tag: "Mobile App",
    icon: <Smartphone className="w-4 h-4" />
  },
  {
    category: "Digital Branding",
    title: "TechNexus Identity",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZreo33WM1748SQcTyjM-A6032D57eLfd1du00FXm9xGxf5mKPcKnss6XWIC3EC21Kbs9PL0L-DEvgDCYFJW_iP67YB4kBxDu8iSmtp0PuIPqn27v1fFEJh4Bf9-HhoB-bnnT4XESdgGrwB7ART8ugbPgYdOBCmCXKm4eoZ4SYhmNC7aSxX_tr8EQ5vv9cgF7SOJxnWxREgeCgbR4Cey4qND7Ev3DczmVyaiTMz2c_eSZa8Xyt47j3BeYKrpHgK4Xc0W4y6yoULqY",
    desc: "Complete visual identity and brand strategy for a rising Silicon Valley incubator and training hub.",
    tag: "Branding",
    icon: <Palette className="w-4 h-4" />
  },
  {
    category: "Web Design",
    title: "Vogue & Vision",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhvPkW7rmVaQW-jiTLIL8Dp8a2hvesfo8CmJHUhWKEYw1ftqhALlEkmIPF8fEnWyaKvX9g2f-OTdSElRDplZsDXS9D3rB2cewG2wbuUTQhSEcdVNqmVRXHJcebFJaiKoMCkT-CRZlmT89ZHM_gf8xuS5iJ35O8iRko_w_MY64tetaYyKY-yN_sL-Cp58hHuFw0QxP_92iD0_qXHnQQeB9yWGXDuYQz4FBmvBzKzXVMtl9oqlOsYhe4D313V-33IXVlaGXNSLnPADM",
    desc: "A high-conversion headless e-commerce experience for a luxury educational book publisher.",
    tag: "E-Commerce",
    icon: <Globe className="w-4 h-4" />
  },
  {
    category: "App Development",
    title: "DataViz Pro",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4nvBLVz6hOYZS1oRVLAkeGVnxiVv5mc_lMblPXyk71NCYdzGxJU0-yw-f21JYMXipB3pepASb2kNpzN-FHHuq1zbbXDGG4qoZaGPGDRJM4GOuBinXG_MHoFF6VJ9BP6WnCuTYjtTew_rVd5ZQiPSlIGCNCQP7HDR8p4uq0uEqDXoerirCRgXRE3h0oZSQWmtxL-ZGfNBqN5oFWhqKQ5ZRc8iB_MornLTuWmvFVzAVAt26WfRzWhO1vMg8y49P0LA9hUUXLTp-U1Y",
    desc: "Internal training analytics tool for corporate HR departments to track employee progress.",
    tag: "Enterprise App",
    icon: <Layout className="w-4 h-4" />
  },
  {
    category: "Digital Branding",
    title: "MindSpace Co.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnufqlKNt37rlKvqB4TDcl-78xKdnXd6dJBpvPt1IAzYOJcBzeNeV01P-aTqY3VWWVkAQNmAR-el58WUv2xEDIjyM6eBki7l-dTn0K7ejB2LWese8D72IJ5MENBfww1brTfEVRiDNs5AOGiTyDKzj3X5QSSeCxUx3j_BZ3SE8s54PlAAJYbum69wz2KOlmtIAIGwjeU38W8sBIInj2E7vUYqmG2t0KfILaZnRQhWqj8FAcWAULxCqHqmZotd0vh_fE6fkr9ergpL4",
    desc: "Rebranding a network of co-working spaces with a focus on educational community building.",
    tag: "Branding",
    icon: <Palette className="w-4 h-4" />
  }
];

const categories = ["All Projects", "Web Design", "App Development", "Digital Branding", "LMS Solutions"];

const PortfolioPage: React.FC<PortfolioPageProps> = ({ setView }) => {
  const [activeTab, setActiveTab] = useState("All Projects");

  const filteredItems = activeTab === "All Projects"
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeTab || item.tag === activeTab);

  return (
    <div className="animate-in fade-in duration-500 bg-bg-light min-h-screen">
      {/* Hero Section */}
      <header className="relative pt-48 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
            Our Selected Works
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-tight">
            Our Work Speaks <br/><span className="text-primary">for Itself</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            We design and build digital solutions that empower learning and streamline business operations through cutting-edge technology.
          </p>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden -z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/5 rounded-full blur-[120px]" />
        </div>
      </header>

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex flex-wrap justify-center gap-3 bg-white p-3 rounded-[2.5rem] shadow-xl border border-slate-100">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-8 py-3.5 rounded-3xl font-black text-xs transition-all uppercase tracking-widest ${
                activeTab === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Portfolio Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredItems.map((item, i) => (
            <div key={i} className="group bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-slate-50">
              <div className="relative overflow-hidden h-72">
                <img 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={item.img} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">
                  {/* Changed Visibility to Eye icon usage */}
                  <div className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                    <Eye className="w-4 h-4" /> Live Preview
                  </div>
                </div>
              </div>

              <div className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-xl tracking-widest flex items-center gap-2">
                    {item.icon} {item.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors leading-tight">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-base leading-relaxed mb-8 font-medium">
                  {item.desc}
                </p>
                <button className="inline-flex items-center text-sm font-black text-primary group/link hover:gap-3 transition-all duration-300">
                  View Case Study <ArrowRight className="w-5 h-5 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-24 text-center">
          <button className="px-12 py-5 bg-white border-2 border-primary text-primary font-black rounded-2xl hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-xl shadow-slate-200">
            Load More Projects
          </button>
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-slate-900 rounded-[3rem] overflow-hidden p-16 md:p-24 flex flex-col md:flex-row items-center justify-between gap-16 shadow-2xl">
            <div className="absolute inset-0 bg-primary/5 opacity-50" />
            <div className="relative z-10 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Ready to build <br className="hidden lg:block" /> something amazing?</h2>
              <p className="text-xl text-blue-100/60 max-w-lg font-medium">
                Let's collaborate to create digital solutions that set your brand apart.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-6">
              <button className="px-10 py-5 bg-primary text-white font-black rounded-2xl text-lg hover:bg-primary-dark transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-3">
                Start a Project <Layers className="w-5 h-5" />
              </button>
              <button className="px-10 py-5 bg-white/5 backdrop-blur-md text-white border-2 border-white/20 font-black rounded-2xl text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                Contact Sales <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
