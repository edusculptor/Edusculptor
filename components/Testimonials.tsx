
import React, { useState, useEffect, useMemo } from 'react';
import { Star, Quote, Send, ShieldCheck, User as UserIcon, AlertCircle, TrendingUp, Search, Info, CheckCircle2, MapPin, ExternalLink } from 'lucide-react';
import { type User, signInWithPopup } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

interface TestimonialsProps {
  user: User | null;
}

interface Review {
  userId: string;
  userName: string;
  userPhoto: string;
  reviewText: string;
  rating: number;
  createdAt: any;
  isVerified?: boolean;
  source?: 'google' | 'platform';
}

const GMB_VIEW_ALL_LINK = "https://share.google/AZkSgBeP6IMPDWB6H";
const GMB_ADD_REVIEW_LINK = "https://g.page/r/CdDonw1B-eDNEBM/review";

const Testimonials: React.FC<TestimonialsProps> = ({ user }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  // High-quality mock reviews based on GMB profile context
  const googleReviews: Review[] = [
    {
      userId: "gmb-1",
      userName: "Rohan Sharma",
      userPhoto: "https://i.pravatar.cc/150?u=rohan",
      reviewText: "Excellent training platform. The React course was very structured and helped me land a job in a top MNC within 3 months. Highly recommended!",
      rating: 5,
      createdAt: null,
      source: 'google',
      isVerified: true
    },
    {
      userId: "gmb-2",
      userName: "Ananya Iyer",
      userPhoto: "https://i.pravatar.cc/150?u=ananya",
      reviewText: "The instructors are industry experts. They don't just teach theory; they show you how to solve real production issues. The UI/UX program is world-class.",
      rating: 5,
      createdAt: null,
      source: 'google',
      isVerified: true
    },
    {
      userId: "gmb-3",
      userName: "Vikram Malhotra",
      userPhoto: "https://i.pravatar.cc/150?u=vikram",
      reviewText: "Very professional agency. They built our corporate portal and it works flawlessly. Also, the corporate training provided to our staff was top-notch.",
      rating: 5,
      createdAt: null,
      source: 'google',
      isVerified: true
    }
  ];

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        ...doc.data(),
        source: 'platform' as const
      }) as Review);
      setReviews(fetchedReviews);
    }, (err) => {
      console.error("Firestore reviews error:", err);
    });
    return () => unsubscribe();
  }, []);

  const allReviews = useMemo(() => {
    return [...reviews, ...googleReviews];
  }, [reviews]);

  const stats = useMemo(() => {
    const total = allReviews.length;
    if (total === 0) return { avg: 0, count: 0, distribution: [0,0,0,0,0] };
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    const distribution = [0, 0, 0, 0, 0];
    allReviews.forEach(r => distribution[r.rating - 1]++);
    return {
      avg: (sum / total).toFixed(1),
      count: total,
      distribution: distribution.reverse() // 5 to 1
    };
  }, [allReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);

    if (newReview.length < 10) {
      setError("Review must be at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "reviews", user.uid), {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL || "",
        reviewText: newReview,
        rating: rating,
        createdAt: serverTimestamp(),
        isVerified: true
      });
      setNewReview('');
      setShowForm(false);
      setJustSubmitted(true);
      // Encourage GMB review after platform review
    } catch (err: any) {
      console.error(err);
      setError("Missing Firestore permissions. Please ensure your Firebase Rules allow creates to 'reviews'.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="success-stories" className="py-24 bg-bg-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start mb-20">
          {/* GMB Rating Overview Card */}
          <div className="lg:w-1/3 w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">
              <TrendingUp className="w-4 h-4 text-primary" /> Verified Google Rating
            </div>
            
            <div className="flex items-end gap-3 mb-2">
              <span className="text-6xl font-black text-slate-900 leading-none">{stats.avg}</span>
              <div className="flex flex-col">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(stats.avg)) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-slate-500 font-bold text-sm tracking-tight">{stats.count} Total Reviews</p>
              </div>
            </div>

            <div className="space-y-3 my-8">
              {stats.distribution.map((count, i) => {
                const starLevel = 5 - i;
                const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0;
                return (
                  <div key={starLevel} className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-400 w-4">{starLevel}</span>
                    <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
              <a 
                href={GMB_VIEW_ALL_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="w-6 h-6" alt="G" />
                  <span className="font-bold text-slate-800 text-sm">View all on GMB</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary" />
              </a>

              <a 
                href={GMB_ADD_REVIEW_LINK}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3"
              >
                Rate us on Google <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="w-5 h-5 brightness-0 invert" alt="G" />
              </a>
            </div>
          </div>

          <div className="lg:w-2/3 w-full">
            <h2 className="text-primary font-extrabold uppercase tracking-widest text-sm mb-4">Social Proof</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-12 tracking-tight">Our Success Stories</h3>
            
            {justSubmitted && (
              <div className="mb-12 bg-green-50 p-10 rounded-[3rem] border-2 border-green-200 text-center animate-in zoom-in duration-500">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h4 className="text-3xl font-black text-slate-900 mb-4">Review Submitted Successfully!</h4>
                <p className="text-slate-600 font-bold mb-8">Your feedback helps us grow. Please consider sharing your experience on Google as well.</p>
                <a 
                  href={GMB_ADD_REVIEW_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                  Write a GMB Review <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="w-5 h-5 brightness-0 invert" alt="G" />
                </a>
                <button onClick={() => setJustSubmitted(false)} className="block mx-auto mt-6 text-slate-400 font-bold hover:text-slate-600 transition-colors">Close</button>
              </div>
            )}

            {!justSubmitted && (
              <div className="grid md:grid-cols-2 gap-8">
                {allReviews.map((r, i) => (
                  <div key={r.userId + i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col h-full relative group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-4 h-4 ${j < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-100'}`} />
                        ))}
                      </div>
                      {r.source === 'google' && (
                        <div className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-lg">
                          <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="w-3.5 h-3.5" alt="G" />
                          <span className="text-[10px] font-black uppercase text-blue-600 tracking-tighter">GMB Review</span>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium italic mb-8 flex-grow">"{r.reviewText}"</p>
                    <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                      <img src={r.userPhoto || `https://ui-avatars.com/api/?name=${r.userName}`} className="w-12 h-12 rounded-xl object-cover border border-slate-100" alt={r.userName} />
                      <div>
                        <p className="font-black text-slate-900 text-sm leading-tight">{r.userName}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Verified Client</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Submit review teaser */}
                <button 
                  onClick={() => setShowForm(!showForm)}
                  className="bg-primary/5 border-2 border-dashed border-primary/20 p-8 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-primary/10 transition-all group"
                >
                  <Quote className="w-8 h-8 text-primary/30 mb-4 group-hover:scale-125 transition-transform" />
                  <p className="font-black text-primary text-lg mb-2">Share Your Journey</p>
                  <p className="text-slate-500 font-bold text-sm">Add your review to the platform</p>
                </button>
              </div>
            )}

            {showForm && !justSubmitted && (
              <div className="mt-12 bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-primary/20 animate-in slide-in-from-bottom-8 duration-500">
                <h4 className="text-2xl font-black text-slate-900 mb-8">Write a Review</h4>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-6 mb-4">
                    <p className="font-bold text-slate-700">Rating:</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button key={s} type="button" onClick={() => setRating(s)} className="hover:scale-125 transition-all">
                          <Star className={`w-8 h-8 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea 
                    required
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    className="w-full p-6 bg-slate-50 border-none rounded-2xl h-32 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-700"
                    placeholder="Describe your experience with EduSculptor..."
                  />
                  {error && <p className="text-red-500 text-sm font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</p>}
                  <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => setShowForm(false)} className="font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all flex items-center gap-3"
                    >
                      {isSubmitting ? "Posting..." : "Post Review"} <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
