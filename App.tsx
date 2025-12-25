import React, { useMemo, useState, useEffect } from 'react';
import { TownSelector } from './components/TownSelector';
import { CategoryNav } from './components/CategoryNav';
import { ContentList } from './components/ContentList';
import { Logo } from './components/Logo';
import { fetchBlogPosts, urlFor, fetchTowns, fetchAmbassadorsByTown } from './services/sanityClient';
import './services/testSanity'; // Test Sanity data
import { sendAmbassadorApplication, sendReportIssue, AmbassadorFormData, ReportFormData } from './services/emailService';
import { DetailView } from './components/DetailView';
import { Town, Category, SanityBlogPost, SanityListItem, SanityAmbassador } from './types';
import { CITY_OF_THE_MONTH, TOWNS } from './constants';
import {
  ArrowLeft,
  Star,
  Users,
  MapPin,
  Instagram,
  Calendar,
  PenLine,
  Send,
  Clock,
  Sparkles,
  Share2,
  AlertTriangle,
  MessageCircle,
  RotateCcw
} from 'lucide-react';

const App: React.FC = () => {
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.HIDDEN_GEMS);
  const [language, setLanguage] = useState<'en' | 'mn'>('en');
  const [selectedPost, setSelectedPost] = useState<SanityBlogPost | null>(null);
  const [selectedItem, setSelectedItem] = useState<SanityListItem | null>(null);
  const [blogPosts, setBlogPosts] = useState<SanityBlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState<boolean>(true);
  const [towns, setTowns] = useState<Town[]>(TOWNS);
  const [ambassadors, setAmbassadors] = useState<SanityAmbassador[]>([]);
  const [ambassadorsLoading, setAmbassadorsLoading] = useState<boolean>(false);

  // Form states
  const [reportForm, setReportForm] = useState<ReportFormData>({
    name: '',
    email: '',
    location: '',
    issue: '',
  });
  const [reportStatus, setReportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const [ambassadorForm, setAmbassadorForm] = useState<AmbassadorFormData>({
    name: '',
    email: '',
    town: '',
    expertise: '',
    motivation: '',
    links: '',
    availability: '1-2 hrs / week',
  });
  const [ambassadorStatus, setAmbassadorStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isSubmittingAmbassador, setIsSubmittingAmbassador] = useState(false);

  // Load blog posts from Sanity
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setBlogLoading(true);
        const sanityPosts = await fetchBlogPosts();
        if (sanityPosts && sanityPosts.length > 0) {
          setBlogPosts(sanityPosts);
        }
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setBlogLoading(false);
      }
    };
    loadBlogPosts();
  }, []);

  // Fetch towns from Sanity
  useEffect(() => {
    const getTowns = async () => {
      try {
        const fetchedTowns = await fetchTowns();
        if (fetchedTowns && fetchedTowns.length > 0) {
          // Map SanityTown to the frontend Town interface
          const mappedTowns: Town[] = fetchedTowns.map(t => ({
            id: t.slug.current, // Use the slug for searching in listItem.town field
            name: t.name,
            region: t.region,
            tagline: t.tagline,
            imageUrl: urlFor(t.image).width(800).height(600).url()
          }));
          setTowns(mappedTowns);
        }
      } catch (error) {
        console.error('Error fetching towns from Sanity:', error);
      }
    };
    getTowns();
  }, []);

  // Fetch ambassadors when town selection changes
  useEffect(() => {
    if (!selectedTown) {
      setAmbassadors([]);
      return;
    }

    const loadAmbassadors = async () => {
      try {
        setAmbassadorsLoading(true);
        const fetched = await fetchAmbassadorsByTown(selectedTown.id);
        setAmbassadors(fetched);
      } catch (error) {
        console.error('Error loading ambassadors:', error);
      } finally {
        setAmbassadorsLoading(false);
      }
    };

    loadAmbassadors();
  }, [selectedTown]);

  const handleBackToMap = () => {
    setSelectedTown(null);
    window.scrollTo(0, 0);
  };

  const handleBackToBlog = () => {
    setSelectedPost(null);
    setSelectedItem(null);
    window.scrollTo(0, 0);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReport(true);
    setReportStatus('loading');
    const success = await sendReportIssue(reportForm);
    if (success) {
      setReportStatus('success');
      setReportForm({ name: '', email: '', location: '', issue: '' });
    } else {
      setReportStatus('error');
    }
    setIsSubmittingReport(false);
  };

  const handleAmbassadorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAmbassador(true);
    setAmbassadorStatus('loading');
    const success = await sendAmbassadorApplication(ambassadorForm);
    if (success) {
      setAmbassadorStatus('success');
      setAmbassadorForm({
        name: '', email: '', town: '', expertise: '', motivation: '', links: '', availability: '1-2 hrs / week'
      });
    } else {
      setAmbassadorStatus('error');
    }
    setIsSubmittingAmbassador(false);
  };

  const sortedBlogPosts = useMemo(() =>
    [...blogPosts].sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime())
    , [blogPosts]);

  const cityOfMonth = towns.find(t => t.id === CITY_OF_THE_MONTH.townId) || towns[0];

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Logo onClick={() => setSelectedTown(null)} className="cursor-pointer" />

          <div className="hidden md:flex items-center gap-10 text-sm font-bold tracking-wide">
            <a href="#map" className="hover:text-montenegro-red transition-colors uppercase">Explore Map</a>
            <a href="#blog" className="hover:text-montenegro-red transition-colors uppercase">Stories</a>
            <a href="#ambassadors" className="hover:text-montenegro-red transition-colors uppercase">Ambassadors</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg shadow-inner">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('mn')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${language === 'mn' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                MN
              </button>
            </div>

            <a
              href="https://instagram.com"
              target="_blank"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {selectedPost || selectedItem ? (
          <DetailView
            language={language}
            onBack={handleBackToBlog}
            data={selectedPost ? {
              title: selectedPost.title,
              category: selectedPost.category,
              heroImage: selectedPost.hero,
              content: selectedPost.content,
              author: {
                name: selectedPost.author.name,
                title: selectedPost.author.title,
                image: selectedPost.author.avatar,
                bio: selectedPost.author.bio
              },
              date: selectedPost.publishedAt,
              readingTime: selectedPost.readingTime,
              tags: selectedPost.tags,
              takeaway: selectedPost.takeaway
            } : {
              title: selectedItem!.name,
              category: selectedItem!.category,
              heroImage: selectedItem!.images[0],
              content: selectedItem!.content,
              author: selectedItem!.verifiedBy && selectedItem!.verifiedBy[0] ? {
                name: selectedItem!.verifiedBy[0].name,
                title: selectedItem!.verifiedBy[0].title,
                image: selectedItem!.verifiedBy[0].avatar,
                bio: selectedItem!.verifiedBy[0].bio
              } : undefined,
              rank: selectedItem!.rank,
              location: selectedItem!.location,
              gallery: selectedItem!.gallery,
              features: selectedItem!.features,
              contactInfo: selectedItem!.contactInfo,
              takeaway: selectedItem!.reason
            }}
          />
        ) : selectedTown ? (
          <div className="animate-in fade-in duration-700 bg-slate-100 min-h-screen">
            {/* Immersive Glassy Header */}
            <header className="relative w-full overflow-hidden h-[450px] md:h-[500px] flex flex-col justify-end">
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0">
                <img
                  src={selectedTown.imageUrl || `https://picsum.photos/1600/900?nature,${selectedTown.name}`}
                  alt={selectedTown.name}
                  className="w-full h-full object-cover grayscale-[0.1] contrast-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent"></div>
              </div>

              <div className="relative z-10 max-w-[1820px] mx-auto w-full px-4 md:px-12 pb-16">
                {/* Back Button - Sharp Ghost Style */}
                <div className="mb-10">
                  <button
                    onClick={handleBackToMap}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group text-[10px] font-black uppercase tracking-[0.2em] bg-black/30 backdrop-blur-md px-5 py-2.5 rounded-lg border border-white/10"
                  >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    {language === 'mn' ? 'Vrati se na Mapu' : 'Return to Map'}
                  </button>
                </div>

                {/* Open Hero Content - No Glass Card */}
                <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-1000">
                  {/* Region Card */}
                  <div className="inline-block bg-montenegro-red text-white px-4 py-2 rounded-sm shadow-2xl transform -rotate-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">
                      {selectedTown.region} Exploration
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-7xl md:text-[11rem] font-display font-bold text-white leading-[0.8] tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                      {selectedTown.name}
                    </h1>
                    <p className="text-xl md:text-3xl text-white font-medium italic leading-tight max-w-2xl drop-shadow-xl">
                      "{selectedTown.tagline}"
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {/* Seamless Toolbar (CategoryNav) */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Main Content: Ultra-Wide Balanced Grid (+30% Width) */}
            <div className="max-w-[1820px] mx-auto px-4 md:px-12 pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-12 md:gap-16 items-start">
                {/* Left: Compact Expert Sidebar */}
                <aside className="lg:sticky lg:top-8 hidden lg:block">
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in duration-700">
                    <div className="space-y-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-3">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                            {(ambassadors.length > 0 && ambassadors[0].avatar) ? (
                              <img src={urlFor(ambassadors[0].avatar).width(80).url()} alt={ambassadors[0].name} className="w-full h-full object-cover" />
                            ) : (
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ambassadors.length > 0 ? ambassadors[0].name : selectedTown.name + ' Guide')}&background=0ea5e9&color=fff&size=80&bold=true`}
                                alt="Local Guide"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-teal-500 rounded-full p-1 border-2 border-white shadow-sm">
                            <Star size={10} className="fill-white text-white" />
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Local Guide</p>
                          <p className="text-sm font-bold text-slate-900">
                            {ambassadors.length > 0 ? ambassadors[0].name : `${selectedTown.name} Expert`}
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic text-center border-t border-slate-50 pt-4">
                        "{ambassadors.length > 0 && ambassadors[0].bio
                          ? ambassadors[0].bio
                          : (language === 'mn'
                            ? 'Poznaje svaki kutak svog grada.'
                            : 'Knows every corner of their city.')}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 leading-tight text-center">
                      Verified for authenticity.
                    </div>
                  </div>
                </aside>

                {/* Center: The Selection - Now in Ultra-Wide Canvas */}
                <div className="min-h-[600px] w-full">
                  <ContentList
                    town={selectedTown}
                    category={selectedCategory}
                    language={language}
                    onSelectItem={setSelectedItem}
                    hideTitle={true}
                  />
                </div>

                {/* Right: Invisible Balance Column */}
                <div className="hidden lg:block w-[280px]"></div>
              </div>

              {/* Mobile Ambassador View */}
              <div className="lg:hidden mt-8 bg-white rounded-lg border border-slate-200 p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 shrink-0">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ambassadors.length > 0 ? ambassadors[0].name : selectedTown.name + ' Guide')}&background=0ea5e9&color=fff&size=60&bold=true`}
                    alt="Local Guide"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Local Expert Selection</p>
                  <p className="text-xs text-slate-600 font-medium">Verified Local Recommendations</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {/* Hero Section */}
            <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden bg-slate-900">
              <img
                src={cityOfMonth.imageUrl}
                className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
                alt="Montenegro Landscape"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>

              <div className="relative max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-2xl space-y-6 animate-in slide-in-from-left duration-1000">
                  <div className="inline-flex items-center gap-2 bg-montenegro-red/20 backdrop-blur-md border border-montenegro-red/30 px-4 py-2 rounded-full">
                    <Star size={14} className="text-montenegro-gold fill-montenegro-gold" />
                    <span className="text-white text-xs font-bold uppercase tracking-[0.2em]">{cityOfMonth.name} is Month's Featured City</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-display font-bold text-white leading-[0.9]">
                    The real <br />
                    <span className="text-montenegro-gold">Montenegro.</span>
                  </h1>
                  <p className="text-xl text-slate-200 font-light leading-relaxed max-w-lg">
                    Hand-picked Top 5 lists by local residents. No tourist traps, no bought reviews. Just the spots we actually visit.
                  </p>
                  <div className="pt-8 flex flex-wrap gap-4">
                    <button
                      onClick={() => setSelectedTown(cityOfMonth)}
                      className="px-8 py-4 bg-montenegro-red text-white rounded-full font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 group"
                    >
                      Explore {cityOfMonth.name} <ArrowLeft size={18} className="inline ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <a href="#map" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all">
                      Browse all cities
                    </a>
                  </div>
                </div>
              </div>

              {/* Float Info Card */}
              <div className="absolute bottom-12 right-12 hidden lg:block animate-in fade-in slide-in-from-right duration-1000 delay-500">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-xl w-72 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-montenegro-gold/20 flex items-center justify-center">
                      <Users size={20} className="text-montenegro-gold" />
                    </div>
                    <div>
                      <p className="text-white font-bold">12 Town Ambassadors</p>
                      <p className="text-white/60 text-xs">Field-verified daily</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-montenegro-gold rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* City Selector Section */}
            <section id="map" className="py-24 max-w-7xl mx-auto px-4">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900">Pick your destination</h2>
                <p className="text-slate-500 text-lg max-w-xl mx-auto">Select a town to see the Top 5 hidden gems, local eats, and verified activities.</p>
              </div>

              <TownSelector towns={towns} onSelectTown={setSelectedTown} />
            </section>

            {/* Ambassador Call to Action */}
            <section id="ambassadors" className="py-24 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-montenegro-red/10 to-transparent"></div>
              <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 animate-in slide-in-from-left duration-700">
                  <p className="text-montenegro-gold font-bold uppercase tracking-[0.3em] text-sm">Join the movement</p>
                  <h2 className="text-4xl md:text-6xl font-display font-bold">Help us protect local culture.</h2>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    We are looking for locals in smaller towns like Kolašin, Cetinje, and Bar. If you know the spots that deserve to be in the Top 5, apply to become an Ambassador.
                  </p>

                  <div className="grid grid-cols-2 gap-6 pb-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <Star className="text-montenegro-gold mb-3" />
                      <p className="font-bold">Verified Status</p>
                      <p className="text-slate-400 text-sm">Your picks get the local seal</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <Sparkles className="text-montenegro-gold mb-3" />
                      <p className="font-bold">Exposure</p>
                      <p className="text-slate-400 text-sm">Share your town's story</p>
                    </div>
                  </div>

                  <form onSubmit={handleAmbassadorSubmit} className="space-y-4 bg-white rounded-xl p-8 text-slate-900 shadow-2xl">
                    <h3 className="text-2xl font-display font-bold mb-6">Ambassador Application</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={ambassadorForm.name}
                        onChange={(e) => setAmbassadorForm({ ...ambassadorForm, name: e.target.value })}
                        className="p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-montenegro-red outline-none transition-all"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        value={ambassadorForm.email}
                        onChange={(e) => setAmbassadorForm({ ...ambassadorForm, email: e.target.value })}
                        className="p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-montenegro-red outline-none transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Town you represent"
                        required
                        value={ambassadorForm.town}
                        onChange={(e) => setAmbassadorForm({ ...ambassadorForm, town: e.target.value })}
                        className="p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-montenegro-red outline-none transition-all"
                      />
                      <select
                        required
                        value={ambassadorForm.availability}
                        onChange={(e) => setAmbassadorForm({ ...ambassadorForm, availability: e.target.value })}
                        className="p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-montenegro-red outline-none transition-all"
                      >
                        <option>1-2 hrs / week</option>
                        <option>3-5 hrs / week</option>
                        <option>More</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Tell us why your town is special..."
                      rows={4}
                      value={ambassadorForm.motivation}
                      onChange={(e) => setAmbassadorForm({ ...ambassadorForm, motivation: e.target.value })}
                      className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-montenegro-red outline-none transition-all"
                    ></textarea>

                    {ambassadorStatus === 'success' ? (
                      <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3">
                        <Sparkles size={18} /> Application sent! We will be in touch.
                      </div>
                    ) : (
                      <button
                        disabled={isSubmittingAmbassador}
                        className={`w-full py-5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-xl ${isSubmittingAmbassador ? 'opacity-50' : ''}`}
                      >
                        {isSubmittingAmbassador ? 'Sending...' : 'Submit Application'}
                      </button>
                    )}
                  </form>
                </div>

                <div className="hidden md:block relative animate-in slide-in-from-right duration-1000">
                  <div className="absolute inset-0 bg-montenegro-red rounded-[2rem] rotate-3"></div>
                  <img
                    src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
                    className="relative rounded-[2rem] shadow-2xl"
                    alt="Ambassador"
                  />
                </div>
              </div>
            </section>

            {/* Blog Section */}
            <section id="blog" className="py-24 bg-slate-900 text-white border-t border-slate-800">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between flex-col md:flex-row md:items-end gap-6 mb-12">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-montenegro-gold mb-2">Ambassador Blog</p>
                    <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">Stories from the frontlines</h2>
                    <p className="text-slate-400 mt-3 max-w-xl text-lg">Field notes, photo drops, and why certain spots make the cut. Updated by the locals who walk these streets.</p>
                  </div>
                  <button onClick={() => window.location.href = '#ambassadors'} className="inline-flex items-center gap-2 text-sm font-bold text-montenegro-gold hover:text-white transition-colors">
                    Become a contributor <ArrowLeft className="rotate-180" size={18} />
                  </button>
                </div>

                {blogLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin text-montenegro-gold"><RotateCcw size={40} /></div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-8">
                    {sortedBlogPosts.map((post) => (
                      <article
                        key={post.title}
                        onClick={() => setSelectedPost(post)}
                        className="group cursor-pointer flex flex-col h-full bg-slate-800 rounded-xl overflow-hidden transition-all duration-500 hover:bg-slate-750 hover:-translate-y-1 hover:shadow-2xl"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={urlFor(post.hero).width(600).url()}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-montenegro-gold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                              {post.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-8 flex flex-col flex-grow">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                            <Calendar size={12} className="text-montenegro-red" />
                            {new Date(post.publishedAt || '').toLocaleDateString(language === 'mn' ? 'sr-ME' : 'en-US', { month: 'short', day: 'numeric' })}
                          </div>

                          <h3 className="text-2xl font-display font-bold text-white mb-4 leading-tight group-hover:text-montenegro-gold transition-colors">
                            {post.title}
                          </h3>

                          <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                            {post.excerpt}
                          </p>

                          <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-700/50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold ring-2 ring-slate-800 overflow-hidden">
                                {post.author.avatar ? (
                                  <img src={urlFor(post.author.avatar).width(50).url()} alt={post.author.name} className="w-full h-full object-cover" />
                                ) : post.author.name[0]}
                              </div>
                              <span className="text-xs font-semibold text-slate-200">{post.author.name}</span>
                            </div>
                            <div className="text-montenegro-gold group-hover:translate-x-1 transition-transform">
                              <ArrowLeft className="rotate-180" size={18} />
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Report an Issue Footer Section */}
            <section className="py-24 bg-white border-t border-slate-100">
              <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
                <div className="w-16 h-16 bg-red-50 text-montenegro-red rounded-full flex items-center justify-center mx-auto mb-8">
                  <AlertTriangle size={32} />
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900">Spotted an issue?</h2>
                <p className="text-slate-500 text-lg">Is a place closed? Did the name change? We rely on you to keep our Top 5 lists perfect. Let us know and we'll verify it.</p>

                <form onSubmit={handleReportSubmit} className="max-w-xl mx-auto pt-8 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={reportForm.name}
                      onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                      className="p-4 bg-slate-50 rounded-lg border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-montenegro-red outline-none transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={reportForm.email}
                      onChange={(e) => setReportForm({ ...reportForm, email: e.target.value })}
                      className="p-4 bg-slate-50 rounded-lg border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-montenegro-red outline-none transition-all"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Location Name"
                    value={reportForm.location}
                    onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                    className="p-4 bg-slate-50 rounded-lg border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-montenegro-red outline-none transition-all"
                  />
                  <textarea
                    placeholder="What's the issue?"
                    rows={3}
                    value={reportForm.issue}
                    onChange={(e) => setReportForm({ ...reportForm, issue: e.target.value })}
                    className="p-4 bg-slate-50 rounded-lg border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-montenegro-red outline-none transition-all"
                  ></textarea>

                  {reportStatus === 'success' ? (
                    <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3 justify-center">
                      <Sparkles size={18} /> Thank you! Our team will verify this soon.
                    </div>
                  ) : (
                    <button
                      disabled={isSubmittingReport}
                      className={`py-5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition shadow-xl ${isSubmittingReport ? 'opacity-50' : ''}`}
                    >
                      {isSubmittingReport ? 'Sending...' : 'Report Issue'}
                    </button>
                  )}
                </form>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Logo className="text-white text-3xl mb-6" />
            <p className="text-sm leading-relaxed text-slate-500">
              The anti-algorithm guide. <br />
              Hand-picked Top 5 lists for every corner of Montenegro.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Curated Lists</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#map" className="hover:text-white transition-colors">Hidden Gems</a></li>
              <li><a href="#map" className="hover:text-white transition-colors">Local Activities</a></li>
              <li><a href="#map" className="hover:text-white transition-colors">Traditional Food</a></li>
              <li><a href="#map" className="hover:text-white transition-colors">Cultural Heritage</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Community</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#ambassadors" className="hover:text-white transition-colors">Apply as Ambassador</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Submit a Location</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Vote & Verify</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-xs flex justify-between items-center text-slate-600">
          <span>&copy; {new Date().getFullYear()} Top 5 Montenegro.</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> Made in Montenegro</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
