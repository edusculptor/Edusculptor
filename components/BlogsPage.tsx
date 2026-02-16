
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  User as UserIcon, 
  ArrowRight, 
  Loader2, 
  X, 
  ChevronRight,
  Bookmark,
  Share2,
  Clock,
  TrendingUp,
  Tag
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  image: string;
  category: string;
  createdAt: any;
  updatedAt?: any;
}

interface BlogsPageProps {
  setView: (view: any) => void;
}

const BlogsPage: React.FC<BlogsPageProps> = ({ setView }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBlogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Blog[];
      setBlogs(fetchedBlogs);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching blogs:", err.message);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 bg-bg-light min-h-screen pt-24">
      {/* Hero Section */}
      <header className="relative py-24 bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block py-1.5 px-5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
              EduSculptor Insights
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-none">
              The Digital <br/><span className="text-primary">Thought Collective.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
              Deep dives into technology, strategy, and the future of professional education. Crafted by industry experts.
            </p>
            <div className="relative max-w-lg">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search articles, authors, or topics..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none font-bold text-slate-700 shadow-sm transition-all"
              />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
      </header>

      {/* Main Feed */}
      <main className="max-w-7xl mx-auto px-4 py-24">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-primary w-12 h-12" />
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Compiling Latest Insights...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-xl">
            <TrendingUp className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-3xl font-black text-slate-900">No matching articles found.</h3>
            <p className="text-slate-500 font-bold mt-2">Try adjusting your search terms or exploring our main categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredBlogs.map((blog) => (
              <article 
                key={blog.id} 
                className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={blog.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800"} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black text-primary uppercase tracking-widest shadow-lg">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <div className="p-10 flex-grow flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <UserIcon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 leading-none">{blog.author}</p>
                      {blog.createdAt && (
                        <p className="text-[10px] text-slate-400 font-bold mt-1">
                          {new Date(blog.createdAt.toMillis()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-primary transition-colors leading-tight">
                    {blog.title}
                  </h3>
                  
                  <p className="text-slate-500 font-medium leading-relaxed mb-10 line-clamp-3 text-sm">
                    {blog.content}
                  </p>

                  <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                    <button 
                      onClick={() => setSelectedBlog(blog)}
                      className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 group/btn"
                    >
                      Read Article <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex gap-4 text-slate-300">
                      <Bookmark size={18} className="hover:text-primary transition-colors cursor-pointer" />
                      <Share2 size={18} className="hover:text-primary transition-colors cursor-pointer" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Reader Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedBlog(null)} />
          <div className="relative bg-white w-full max-w-4xl h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                  {selectedBlog.category}
                </span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12} /> 6 Min Read
                </span>
              </div>
              <button 
                onClick={() => setSelectedBlog(null)}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-12 lg:p-20">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 font-black text-2xl">
                    {selectedBlog.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900">{selectedBlog.author}</p>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Expert Contributor</p>
                  </div>
                </div>

                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-10 leading-[1.1] tracking-tight">
                  {selectedBlog.title}
                </h2>

                <div className="aspect-video rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl">
                  <img src={selectedBlog.image} className="w-full h-full object-cover" alt={selectedBlog.title} />
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-8 whitespace-pre-wrap">
                    {selectedBlog.content}
                  </p>
                  
                  {/* Conceptual segments to make it feel like a real post */}
                  <h4 className="text-2xl font-black text-slate-900 mt-12 mb-6 uppercase tracking-tight">Strategic Implementation</h4>
                  <p className="text-lg text-slate-500 leading-relaxed mb-6">
                    In the current digital landscape, precision is everything. As we've observed in our latest deployments, the intersection of AI and human-centric design is where the most significant value is captured.
                  </p>
                  
                  <div className="bg-slate-50 p-10 rounded-[2.5rem] border-2 border-slate-100 my-12">
                    <p className="text-lg font-black text-slate-900 italic leading-relaxed">
                      "Excellence is not an act, but a habit. In digital sculpting, your habit must be constant iteration and uncompromising quality."
                    </p>
                  </div>
                  
                  <p className="text-lg text-slate-500 leading-relaxed">
                    Moving forward, EduSculptor remains committed to exploring these frontiers and sharing the technical blueprints with our global community.
                  </p>
                </div>

                <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all">
                      <Share2 size={16} /> Share Article
                    </button>
                    <button className="flex items-center gap-3 bg-slate-50 text-slate-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-primary transition-all">
                      <Tag size={16} /> Technical Strategy
                    </button>
                  </div>
                  <button 
                    onClick={() => setView('contact')}
                    className="text-primary font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 hover:gap-5 transition-all"
                  >
                    Discuss this Topic <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Segment */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-primary rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Never miss a dive.</h2>
              <p className="text-xl text-blue-100 mb-12 font-medium">
                Get our weekly technical blueprints and strategic insights delivered straight to your terminal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your professional email" 
                  className="flex-grow px-8 py-5 rounded-2xl bg-white/10 border-2 border-white/20 text-white placeholder:text-blue-100/50 font-bold focus:border-white outline-none transition-all"
                />
                <button className="bg-white text-primary px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl shadow-black/10">
                  Subscribe Now
                </button>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogsPage;
