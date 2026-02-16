
import React from 'react';
import { Rocket, Eye, Lightbulb, ShieldCheck, Award, Brain, ArrowRight } from 'lucide-react';

interface AboutProps {
  setView: (view: 'home' | 'about') => void;
}

const About: React.FC<AboutProps> = ({ setView }) => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <header className="relative bg-primary py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-white rounded-full translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            Empowering Businesses & <br className="hidden md:block" /> Future Professionals
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-medium leading-relaxed">
            Bridging the gap between education and industry through innovative digital solutions and world-class technical training.
          </p>
        </div>
      </header>

      {/* Mission & Vision */}
      <section className="py-24 -mt-20 relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                <Rocket className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-6">Our Mission</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                To architect modern learning pathways that equip individuals and organizations with the cutting-edge technical skills required to thrive in an ever-evolving digital economy.
              </p>
            </div>
            <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                <Eye className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-6">Our Vision</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                To become the global gold standard for digital transformation and professional upskilling, shaping a future where technology is accessible and empowering for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img 
                  alt="Team collaboration" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJAUSKLTmDqGRxmlOIzh4tHPXGUvB7Cc5b2ZIfKyw6xx78CjisgdwS3oYU83o9Fpi6-b2kX1WenIoV5DRZXr3K1DPtkQaKwETwOu2uISeJpAJ8PjuyZx_eWkyKcsxZrEJ02Ww3IT05fT-54iVhgctZYCpD_2RMauGvqkcQgSpMB1CJayevLXyjrI5O3h6xY-4yyfamHjp0i7FTsZujXfAK3SGDupmNTY6kfkKjgIK141mfViRgz7Z-Lo5IB2PAs3dUTB5cRtKuAdM"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/5 rounded-full -z-10" />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 relative inline-block">
                Our Story
                <span className="block w-16 h-2 bg-primary mt-4 rounded-full" />
              </h2>
              <div className="space-y-8 text-slate-600 leading-relaxed text-lg">
                <p>
                  Founded in 2018, EduSculptor began with a simple observation: the rapid pace of technological advancement was leaving traditional education systems behind. We saw a world where businesses struggled to find skilled talent and professionals felt overwhelmed by new tools.
                </p>
                <p>
                  What started as a boutique technical training firm has evolved into a comprehensive digital technology partner. We don't just teach technology; we help organizations integrate it into their DNA and help individuals "sculpt" their careers into something extraordinary.
                </p>
                <p>
                  Today, we take pride in having mentored over 10,000 professionals and partnered with Fortune 500 companies to drive their digital innovation strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Our Core Values</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              These pillars guide every decision we make, every course we design, and every partnership we build.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Lightbulb />, title: "Innovation", desc: "We don't just follow trends; we anticipate them, ensuring our clients stay ahead." },
              { icon: <ShieldCheck />, title: "Integrity", desc: "Honesty and transparency are the foundations of every relationship we build." },
              { icon: <Award />, title: "Excellence", desc: "We strive for perfection in our curriculum design, delivery, and customer success." },
              { icon: <Brain />, title: "Empowerment", desc: "Our goal is to give people the tools to take control of their professional destiny." }
            ].map((value, i) => (
              <div key={i} className="bg-white p-10 rounded-[2rem] border border-slate-100 hover:border-primary/20 hover:shadow-2xl transition-all group">
                <div className="mb-8 inline-block p-5 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  {/* Fixed cloneElement type error by specifying className in props type */}
                  {React.cloneElement(value.icon as React.ReactElement<{ className?: string }>, { className: "w-8 h-8" })}
                </div>
                <h4 className="text-2xl font-bold mb-4 text-slate-900">{value.title}</h4>
                <p className="text-slate-500 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Meet Our Experts</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              A diverse team of industry veterans, educators, and technologists dedicated to your growth.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { name: "Dr. Marcus Chen", role: "Founder & CEO", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvwcfPqYhYfOXV_8a7mTRV-bHH2Xb78X9zegAeROryCjdomqKHcZlpAyYGVezc3cCdVU2869ChFMa1pOcPeI1l5ldKBCRRaNhNy5yQj0-9iyFtcTSsBKJJBZuoicswBphrv5dSPxPmzYZHT3Ih8RFsN7jQTQCLg8r93TnNzGej7QDnX8yNrHPsVRiriR_olULytlrL4iqNnrg8Tav-9c5TheeCey2HJqKUWfdoCdcswnTKi6Q07QkyQUhvj9iB7RBGVQbR5CW3oTY" },
              { name: "Sarah Jenkins", role: "Head of Training", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXd4v3g0Z3RZUdzTcYKMhsopJZAift2hsjFxxxnebYeZgjUImca0QdjHf1ruvFezeZ1hkDzk_lYQUKlQdgoE478vuFYk-i45PgMxMqGH0yq7BjpPFwi-iHqFbiOalvyODXAGcrgSpgd1uMSZNfJtZfAgsEn2cHTr-xXfDpcrTvDPUP0lw31Bq1B59ukb1Z8OENt74tRf6VOFVUPBPn9Z8SjqxloavyQwdTBqYVz0C4opQZd2s_LNfT-u1NIXznzcSBF4ua_v_Yapk" },
              { name: "David Kovacs", role: "CTO", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEaHX9HPBp7rt1BBQoJxwc-7M1jgden-UnRcCXzmGdg2dtT6GrwxSvrgO6QcarIaMSaW94qd2XdO4uey77iPNnGLybw9GCVCwKsB8DnFIQLM5cjxwm6EU9zPfs90TeLtK4ta7NOLP5qg2ykYuccCGZCkszRE-ggmB6hQD5IqQeEt22o8WLzs9-pEGOwxEF_7zXKwZCMjDjsSO877Hk2vwZm9trbwWJQqP7T6jQb4Or_PCIUUQKAJh90BSK0smXAKIiM5k5TXEo4nE" },
              { name: "Elena Rodriguez", role: "Lead Digital Architect", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWCM-3meWCIZliUEYT2QQM628hEkjbwfqRpMCJKLLP6spJhLBo_PQrd-JWXqVyvI8Di5vtqe3aYw40RLxNMnNr1HV1Ps2Jmxf3G5s93Aeeyj0BUW2_-8Aqy46hjzJSMMf2FhyCHJjX23UJ0-7Bw5kjFyTd76KMRlDSCzC_V09RQN42hT-f63U1nq9c0BZ8VYFdqWqN5wxYfgusmVWnZmGvFB0VLPf_zPVNvwJ5NKYlyweW8TQenrp_RKeUO6vwrblEk6yGMeJl1Rg" }
            ].map((member, i) => (
              <div key={i} className="text-center group">
                <div className="mb-8 relative mx-auto w-56 h-56 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-lg">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                <h5 className="text-2xl font-black text-slate-900">{member.name}</h5>
                <p className="text-primary font-bold uppercase tracking-widest text-xs mt-2">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-primary to-indigo-600 rounded-[3rem] overflow-hidden p-16 md:p-24 text-center text-white shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-10 leading-tight">Ready to sculpt your future?</h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium">
                Join hundreds of companies and thousands of professionals who have already transformed their digital capabilities with us.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button 
                  onClick={() => setView('home')}
                  className="bg-white text-primary px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Explore Services <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
