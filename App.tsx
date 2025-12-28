import React, { useMemo, useState, useEffect } from 'react';
import { TownSelector } from './components/TownSelector';
import { CategoryNav } from './components/CategoryNav';
import { ContentList } from './components/ContentList';
import { Logo } from './components/Logo';
import {
  fetchBlogPosts,
  urlFor,
  fetchTowns,
  fetchAmbassadorsByTown,
  fetchSiteSettings,
  fetchCityOfTheMonth
} from './services/sanityClient';
import './services/testSanity'; // Test Sanity data
import { sendAmbassadorApplication, sendReportIssue, AmbassadorFormData, ReportFormData } from './services/emailService';
import { DetailView } from './components/DetailView';
import { ReportView } from './components/ReportView';
import {
  Town,
  Category,
  SanityBlogPost,
  SanityListItem,
  SanityAmbassador,
  SanitySiteSettings,
  SanityCityOfTheMonth
} from './types';
import { CITY_OF_THE_MONTH, TOWNS, GENERAL_HERO_IMAGE } from './constants';
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
  const [showReport, setShowReport] = useState<boolean>(false);
  const [blogPosts, setBlogPosts] = useState<SanityBlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState<boolean>(true);
  const [towns, setTowns] = useState<Town[]>(TOWNS);
  const [ambassadors, setAmbassadors] = useState<SanityAmbassador[]>([]);
  const [ambassadorsLoading, setAmbassadorsLoading] = useState<boolean>(false);
  const [siteSettings, setSiteSettings] = useState<SanitySiteSettings | null>(null);
  const [sanityCityOfMonth, setSanityCityOfMonth] = useState<SanityCityOfTheMonth | null>(null);

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

  // Fetch Site Settings and City of the Month from Sanity
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [settings, cityFeature] = await Promise.all([
          fetchSiteSettings(),
          fetchCityOfTheMonth()
        ]);
        setSiteSettings(settings);
        setSanityCityOfMonth(cityFeature);
      } catch (error) {
        console.error('Error loading settings/city feature:', error);
      }
    };
    loadSettings();
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

  const handleBackToHome = () => {
    setSelectedPost(null);
    setSelectedItem(null);
    setShowReport(false);
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

  // Priority: 1. Sanity Feature, 2. Static Feature Fallback, 3. First Town
  const activeCityOfMonth = useMemo(() => {
    if (sanityCityOfMonth?.town) {
      const townFromSanity = towns.find(t => t.id === sanityCityOfMonth.town.slug.current);
      if (townFromSanity) return townFromSanity;
    }
    return towns.find(t => t.id === CITY_OF_THE_MONTH.townId) || towns[0];
  }, [sanityCityOfMonth, towns]);

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
        {showReport ? (
          <ReportView
            onBack={handleBackToHome}
            reportForm={reportForm}
            setReportForm={setReportForm}
            reportStatus={reportStatus}
            isSubmittingReport={isSubmittingReport}
            onSubmit={handleReportSubmit}
          />
        ) : selectedPost || selectedItem ? (
          <DetailView
            language={language}
            onBack={handleBackToHome}
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
            {/* Hero Section - Brand Focused */}
            <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden bg-slate-900">
              <img
                src={siteSettings?.heroImage ? urlFor(siteSettings.heroImage).url() : GENERAL_HERO_IMAGE}
                className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
                alt="Montenegro Landscape"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>

              <div className="relative max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-2xl space-y-6 animate-in slide-in-from-left duration-1000">
                  <h1 className="text-6xl md:text-8xl font-display font-bold text-white leading-[0.9]">
                    {siteSettings?.heroTitle ? (
                      <>
                        {siteSettings.heroTitle.split(' ').slice(0, -1).join(' ')} <br />
                        <span className="text-montenegro-gold">{siteSettings.heroTitle.split(' ').slice(-1)}</span>
                      </>
                    ) : (
                      <>
                        The real <br />
                        <span className="text-montenegro-gold">Montenegro.</span>
                      </>
                    )}
                  </h1>
                  <p className="text-xl text-slate-200 font-light leading-relaxed max-w-lg">
                    {siteSettings?.heroSubtitle || 'Hand-picked Top 5 lists by local residents. No tourist traps, no bought reviews. Just the spots we actually visit.'}
                  </p>
                  <div className="pt-8 flex flex-wrap gap-4">
                    <a href="#map" className="px-10 py-4 bg-montenegro-red text-white font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 group uppercase tracking-widest text-xs">
                      {siteSettings?.ctaPrimaryText || 'Explore Cities'} <ArrowLeft size={16} className="inline ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a href="#blog" className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold hover:bg-white/20 transition-all uppercase tracking-widest text-xs">
                      {siteSettings?.ctaSecondaryText || 'Read Stories'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Float Info Card */}
              <div className="absolute bottom-12 right-12 hidden lg:block animate-in fade-in slide-in-from-right duration-1000 delay-500">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-none w-80 shadow-2xl relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-montenegro-gold"></div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-none bg-white/10 flex items-center justify-center border border-white/10">
                      <Users size={22} className="text-montenegro-gold" />
                    </div>
                    <div>
                      <p className="text-white font-bold uppercase tracking-tighter text-lg">Ambassadors</p>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Field-verified daily</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2">
                    <span>Authenticity</span>
                    <span>100%</span>
                  </div>
                  <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-montenegro-gold/50 to-montenegro-gold shadow-[0_0_15px_rgba(255,215,0,0.3)]"></div>
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

            {/* City of the Month - Dedicated Section (Moved below Map) */}
            <section className="py-16 md:py-20 bg-blue-50/20 border-y border-blue-100/30 relative overflow-hidden">
              {/* Subtle mesh/atmosphere glows */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-montenegro-red/[0.02] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-montenegro-gold/[0.03] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

              <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="bg-white rounded-none overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] flex flex-col lg:flex-row border border-slate-200/60">
                  <div className="lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden">
                    <img
                      src={sanityCityOfMonth?.featuredImage ? urlFor(sanityCityOfMonth.featuredImage).url() : activeCityOfMonth.imageUrl}
                      alt={activeCityOfMonth.name}
                      className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-slate-900/10"></div>
                  </div>
                  <div className="lg:w-1/2 p-10 md:p-14 flex flex-col justify-center space-y-6 bg-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/20 -mr-16 -mt-16 rotate-45 border border-blue-100/30 hidden lg:block"></div>
                    <div className="space-y-6 relative">
                      <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-5 py-2.5 rounded-none">
                        <Calendar size={14} className="text-montenegro-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                          {sanityCityOfMonth?.month || new Date().toLocaleString(language === 'mn' ? 'sr-ME' : 'default', { month: 'long' })}
                          {language === 'mn' ? (sanityCityOfMonth ? ': ' + (sanityCityOfMonth.title || 'Grad Mjeseca') : ': Grad Mjeseca') : (sanityCityOfMonth ? ' ' + (sanityCityOfMonth.title || 'City of the Month') : ' City of the Month')}
                        </span>
                      </div>
                      <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-[1.1] tracking-tighter">
                        Discover <br />
                        <span className="text-montenegro-red">{activeCityOfMonth.name}</span>
                      </h2>
                      <div className="w-20 h-1 bg-montenegro-gold my-8"></div>
                      <p className="text-slate-500 text-lg leading-relaxed font-light italic">
                        "{sanityCityOfMonth?.description || CITY_OF_THE_MONTH.description}"
                      </p>
                    </div>
                    <div className="pt-4">
                      <button
                        onClick={() => setSelectedTown(activeCityOfMonth)}
                        className="px-12 py-5 bg-slate-900 text-white rounded-none font-bold hover:bg-slate-800 transition-all flex items-center gap-4 group uppercase tracking-widest text-xs border border-slate-900 shadow-xl hover:shadow-2xl"
                      >
                        Explore Selection
                        <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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

                  <form onSubmit={handleAmbassadorSubmit} className="space-y-4 bg-white rounded-none p-10 text-slate-900 shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-montenegro-red to-montenegro-gold"></div>
                    <h3 className="text-2xl font-display font-bold mb-8 uppercase tracking-tighter">Ambassador Application</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={ambassadorForm.name}
                        onChange={(e) => setAmbassadorForm({ ...ambassadorForm, name: e.target.value })}
                        className="p-4 bg-slate-50 rounded-none border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        value={ambassadorForm.email}
                        onChange={(e) => setAmbassadorForm({ ...ambassadorForm, email: e.target.value })}
                        className="p-4 bg-slate-50 rounded-none border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                      />
                      <input
                        type="text"
                        placeholder="Town you represent"
                        required
                        value={ambassadorForm.town}
                        onChange={(e) => setAmbassadorForm({ ...ambassadorForm, town: e.target.value })}
                        className="p-4 bg-slate-50 rounded-none border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                      />
                      <select
                        required
                        value={ambassadorForm.availability}
                        onChange={(e) => setAmbassadorForm({ ...ambassadorForm, availability: e.target.value })}
                        className="p-4 bg-slate-50 rounded-none border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all text-xs uppercase tracking-widest font-bold"
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
                      className="w-full p-4 bg-slate-50 rounded-none border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                    ></textarea>

                    {ambassadorStatus === 'success' ? (
                      <div className="p-4 bg-green-50 text-green-700 rounded-none border border-green-100 flex items-center gap-3">
                        <Sparkles size={18} /> Application sent! We will be in touch.
                      </div>
                    ) : (
                      <button
                        disabled={isSubmittingAmbassador}
                        className={`w-full py-5 bg-slate-900 text-white rounded-none font-bold hover:bg-slate-800 transition shadow-xl uppercase tracking-[0.3em] text-[10px] ${isSubmittingAmbassador ? 'opacity-50' : ''}`}
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
              <li><button onClick={() => setShowReport(true)} className="hover:text-white transition-colors">Report an Issue</button></li>
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
    </div >
  );
};

export default App;
