import React, { useMemo, useState, useEffect } from 'react';
import { TownSelector } from './components/TownSelector';
import { CategoryNav } from './components/CategoryNav';
import { ContentList } from './components/ContentList';
import { Logo } from './components/Logo';
import { Town, Category, SanityBlogPost } from './types';
import { CITY_OF_THE_MONTH, TOWNS } from './constants';
import { ArrowLeft, Star, Users, MapPin, Instagram, Calendar, PenLine, Send, Clock, Sparkles, Share2, AlertTriangle, MessageCircle } from 'lucide-react';
import { fetchBlogPosts, urlFor, fetchTowns } from './services/sanityClient';
import './services/testSanity'; // Test Sanity data
import { sendAmbassadorApplication, sendReportIssue, AmbassadorFormData, ReportFormData } from './services/emailService';

type BlogPost = {
  slug: string;
  title: string;
  category: string;
  author: string;
  authorTitle: string;
  excerpt: string;
  date: string;
  readingTime: string;
  hero: string;
  tags: string[];
  content: { heading?: string; body: string }[];
  takeaway: string;
};

const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'march-city-curation',
    title: 'How we picked the March City of the Month',
    category: 'Curation',
    author: 'Milena',
    authorTitle: 'Kotor Ambassador',
    excerpt: 'Behind the scenes of the carnival route, the viewpoints we verified, and how locals voted.',
    date: 'Mar 12, 2024',
    readingTime: '6 min read',
    hero: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80',
    tags: ['Curation', 'Community vote', 'City of the Month'],
    content: [
      {
        body: 'We put Kotor on the pedestal this month because locals rebuilt the carnival route after heavy rain. The shortlist started with 17 spots and went through three rounds of in-person checks.',
      },
      {
        heading: 'How we verified',
        body: 'Two ambassadors walked each alley twice—day and night—to confirm signage, crowds, and accessibility. Every spot needed at least two independent confirmations and recent photos.',
      },
      {
        heading: 'What got removed',
        body: 'We dropped a waterfront cafe after staff changed and quality slipped, and swapped in a family-run bakery that kept its pre-dawn hours for night-shift workers.',
      },
      {
        heading: 'What\'s next',
        body: 'We are opening a public proof-of-visit form so locals can flag closures faster. Expect micro-updates every Friday until the next city is crowned.',
      },
    ],
    takeaway: 'City of the Month is earned, never bought. Every pick needs current field notes, not old hype.',
  },
  {
    slug: 'sunrise-spots',
    title: '5 sunrise spots that never make the guidebooks',
    category: 'Hidden Gems',
    author: 'Luka',
    authorTitle: 'Cetinje Ambassador',
    excerpt: 'From Lovćen ridge to tiny village chapels, these are the early-morning places we trust.',
    date: 'Mar 8, 2024',
    readingTime: '5 min read',
    hero: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80&sat=-20',
    tags: ['Hidden gems', 'Outdoors', 'Sunrise'],
    content: [
      {
        body: 'Guidebooks rarely cover where locals actually start their mornings. These five spots are reachable before work and have clear sightlines even in winter light.',
      },
      {
        heading: 'Lovćen South Ridge',
        body: 'Park by 5:20, take the ridge path for 12 minutes, and you will have space for a tripod. Cloud inversions after rain are common—bring layers.',
      },
      {
        heading: 'Village Chapel Terrace',
        body: 'A tiny stone terrace above Njeguši faces east with zero tour buses. The bells start at 6:00; be respectful and keep it quiet.',
      },
      {
        heading: 'Why these made the cut',
        body: 'Each spot has safe footing, zero tickets, and quick exit routes. We removed two "Instagram hills" because parking blocks locals from getting to work.',
      },
    ],
    takeaway: 'Sunrise spots stay good only when we keep them light on crowds and heavy on respect for locals.',
  },
  {
    slug: 'midnight-street-food',
    title: 'Street food we actually eat after midnight',
    category: 'Food',
    author: 'Ana',
    authorTitle: 'Podgorica Ambassador',
    excerpt: 'No tourist traps, just proper burek, kebab, and the bakery windows that stay lit.',
    date: 'Mar 3, 2024',
    readingTime: '4 min read',
    hero: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
    tags: ['Food', 'Nightlife', 'Local tips'],
    content: [
      {
        body: 'After midnight we need quick, safe, and consistent food. These five spots are run by owners who recognize half their customers by name.',
      },
      {
        heading: 'The burek window',
        body: 'Opens 23:30, closes when the last tray sells out. Cheese burek first, then mushroom—never leave without ajvar.',
      },
      {
        heading: 'Quality checks',
        body: 'We drop any place that reheats instead of baking on site. We also time the queue; if locals stop lining up, we revisit the rating.',
      },
      {
        heading: 'Safety first',
        body: 'All spots have lighting, nearby transport, and owners willing to call a cab if needed. Avoid alley kiosks with no receipt system.',
      },
    ],
    takeaway: 'Late-night food lists must balance flavor with safety and predictability—no compromises.',
  },
];

const App: React.FC = () => {
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.HIDDEN_GEMS);
  const [language, setLanguage] = useState<'en' | 'mn'>('en');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [blogLoading, setBlogLoading] = useState<boolean>(true);
  const [towns, setTowns] = useState<Town[]>(TOWNS); // Initialize with hardcoded, update if Sanity has data

  // Form States
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportStatus, setReportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [reportForm, setReportForm] = useState<ReportFormData>({
    name: '',
    listName: '',
    reason: 'Closed down',
    details: ''
  });

  const [isSubmittingAmbassador, setIsSubmittingAmbassador] = useState(false);
  const [ambassadorStatus, setAmbassadorStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [ambassadorForm, setAmbassadorForm] = useState<AmbassadorFormData>({
    name: '',
    email: '',
    town: '',
    expertise: '',
    motivation: '',
    links: '',
    availability: '1-2 hrs / week'
  });

  const handleReportSubmit = async () => {
    if (!reportForm.details) {
      alert('Please provide some details for us to verify.');
      return;
    }

    setIsSubmittingReport(true);
    setReportStatus('idle');

    const success = await sendReportIssue(reportForm);

    setIsSubmittingReport(false);
    if (success) {
      setReportStatus('success');
      setReportForm({ name: '', listName: '', reason: 'Closed down', details: '' }); // Reset
    } else {
      setReportStatus('error');
    }
  };

  const handleAmbassadorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAmbassador(true);
    setAmbassadorStatus('idle');

    const success = await sendAmbassadorApplication(ambassadorForm);

    setIsSubmittingAmbassador(false);
    if (success) {
      setAmbassadorStatus('success');
      setAmbassadorForm({ // Reset
        name: '',
        email: '',
        town: '',
        expertise: '',
        motivation: '',
        links: '',
        availability: '1-2 hrs / week'
      });
    } else {
      setAmbassadorStatus('error');
    }
  };

  // Fetch blog posts from Sanity on mount
  useEffect(() => {
    const loadBlogPosts = async () => {
      setBlogLoading(true);
      try {
        const sanityPosts = await fetchBlogPosts();

        if (sanityPosts && sanityPosts.length > 0) {
          // Transform Sanity posts to app format
          const transformedPosts: BlogPost[] = sanityPosts.map((post) => ({
            slug: post.slug.current,
            title: post.title,
            category: post.category,
            author: post.author.name,
            authorTitle: post.author.title,
            excerpt: post.excerpt,
            date: post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
              : 'Recent',
            readingTime: post.readingTime || '5 min read',
            hero: urlFor(post.hero).width(1200).height(800).url(),
            tags: post.tags || [],
            content: post.content,
            takeaway: post.takeaway,
          }));

          setBlogPosts(transformedPosts);
        } else {
          // Fallback to hardcoded posts if no Sanity data
          setBlogPosts(BLOG_POSTS);
        }
      } catch (error) {
        console.error('Error loading blog posts:', error);
        // Fallback to hardcoded posts on error
        setBlogPosts(BLOG_POSTS);
      } finally {
        setBlogLoading(false);
      }
    };

    loadBlogPosts();
    loadBlogPosts();
  }, []);

  // Fetch towns from Sanity
  useEffect(() => {
    const loadTowns = async () => {
      try {
        const sanityTowns = await fetchTowns();
        if (sanityTowns && sanityTowns.length > 0) {
          const mappedTowns: Town[] = sanityTowns.map(t => ({
            id: t.slug.current,
            name: t.name,
            region: t.region,
            tagline: t.tagline,
            imageUrl: urlFor(t.image).width(800).height(600).url()
          }));
          setTowns(mappedTowns);
        }
      } catch (error) {
        console.error("Failed to load towns from Sanity, using fallback.", error);
      }
    };
    loadTowns();
  }, []);

  const handleBackToMap = () => {
    setSelectedTown(null);
    setSelectedCategory(Category.HIDDEN_GEMS);
    window.scrollTo(0, 0);
  };

  const handleBackToBlog = () => {
    setSelectedPost(null);
    window.scrollTo(0, 0);
  };

  const cityOfMonth = towns.find(t => t.id === CITY_OF_THE_MONTH.townId);

  const sortedBlogPosts = useMemo(() => [...blogPosts].sort((a, b) => b.date.localeCompare(a.date)), [blogPosts]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="cursor-pointer group" onClick={handleBackToMap}>
              <Logo className="text-3xl text-slate-900 transition-transform group-hover:scale-105" />
            </div>
            {/* Language Toggle */}
            <div className="flex items-center space-x-1 text-sm font-bold tracking-wide border-l border-slate-200 pl-6 h-8 select-none">
              <button
                onClick={() => setLanguage('en')}
                className={`transition-colors ${language === 'en' ? 'text-montenegro-red' : 'text-slate-300 hover:text-slate-500'}`}
              >
                EN
              </button>
              <span className="text-slate-200">/</span>
              <button
                onClick={() => setLanguage('mn')}
                className={`transition-colors ${language === 'mn' ? 'text-montenegro-red' : 'text-slate-300 hover:text-slate-500'}`}
              >
                MN
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-montenegro-red transition-colors">About Us</a>
              <a href="#ambassadors" className="hover:text-montenegro-red transition-colors">Ambassadors</a>
              <a href="#blog" className="hover:text-montenegro-red transition-colors">Blog</a>
            </nav>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-4">
              <button className="text-slate-400 hover:text-slate-900 transition-colors">
                <Instagram size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {selectedPost ? (
          <div className="bg-slate-50">
            <div className="relative h-[45vh] min-h-[360px] w-full overflow-hidden">
              <img src={selectedPost.hero} alt={selectedPost.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-50"></div>
              <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-12 flex flex-col gap-6 justify-end h-full">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handleBackToBlog}
                    className="w-max bg-white/15 border border-white/20 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/25 transition"
                  >
                    <ArrowLeft size={16} /> Back to Blog
                  </button>
                  <div className="hidden md:flex items-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 bg-white/10 border border-white/20 rounded-full px-4 py-2 backdrop-blur">
                    Field-verified story
                  </div>
                </div>
                <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl shadow-slate-900/40">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-montenegro-gold font-bold mb-4">
                    <span className="bg-montenegro-gold/10 text-montenegro-gold px-3 py-1 rounded-full border border-montenegro-gold/40 flex items-center gap-2"><Sparkles size={12} /> {selectedPost.category}</span>
                    <span className="text-white/80 flex items-center gap-2"><Calendar size={12} /> {selectedPost.date}</span>
                    <span className="text-white/80 flex items-center gap-2"><Clock size={12} /> {selectedPost.readingTime}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4 drop-shadow-sm">{selectedPost.title}</h1>
                  <p className="text-lg text-white/80 leading-relaxed mb-5">{selectedPost.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                    <div className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-xl border border-white/20">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold">{selectedPost.author[0]}</div>
                      <div>
                        <p className="font-semibold">{selectedPost.author}</p>
                        <p className="text-white/70 text-xs">{selectedPost.authorTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/80"><Sparkles size={16} /> Verified by two locals</div>
                    <div className="flex items-center gap-2 text-white/80"><Share2 size={16} /> Share-worthy insights only</div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedPost.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 bg-white/10 border border-white/20 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 pb-20 -mt-16 relative z-10">
              <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 p-8 md:p-12 space-y-10">
                {selectedPost.content.map((section, index) => (
                  <section key={section.heading ?? index} className="space-y-3">
                    {section.heading && (
                      <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles size={18} className="text-montenegro-red" /> {section.heading}
                      </h2>
                    )}
                    <p className="text-lg leading-relaxed text-slate-700">{section.body}</p>
                  </section>
                ))}

                <div className="p-6 bg-gradient-to-r from-montenegro-red/10 via-montenegro-gold/10 to-slate-50 rounded-xl border border-montenegro-red/20">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-montenegro-red mb-2">Key takeaway</p>
                  <p className="text-xl text-slate-900 font-semibold">{selectedPost.takeaway}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MessageCircle size={18} className="text-montenegro-red" />
                    <span>
                      Disagree with this list?{' '}
                      <button
                        onClick={() => document.getElementById('feedback-box')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-montenegro-red font-semibold underline-offset-4 hover:underline"
                      >
                        Tell us why
                      </button>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Share2 size={16} />
                    <span>Copy link</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        ) : !selectedTown ? (
          // Landing Page
          <div className="animate-in fade-in duration-500">
            {/* Hero */}
            <div className="bg-slate-900 text-white py-24 px-4 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?blur=4')] opacity-20 bg-cover bg-center"></div>
              <div className="relative z-10 max-w-4xl mx-auto">
                <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-sm text-montenegro-gold">
                  Authentic. Curated. Limited.
                </span>
                <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tight leading-none">
                  The <span className="text-montenegro-red">Real</span> Montenegro.
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                  Strict Top 5 lists for every town. Curated by locals, verified by the community.
                  No endless scrolling, just the absolute best.
                </p>
              </div>
            </div>

            {/* City of the Month Feature */}
            {cityOfMonth && (
              <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 mb-20">
                <div className="bg-white rounded-3xl p-2 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row overflow-hidden group cursor-pointer border border-slate-100" onClick={() => setSelectedTown(cityOfMonth)}>
                  <div className="md:w-3/5 h-72 md:h-96 relative overflow-hidden rounded-2xl">
                    <img src={cityOfMonth.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={cityOfMonth.name} />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider flex items-center shadow-lg border border-white/10">
                        <Star size={12} className="mr-1.5 text-montenegro-gold fill-current" /> City of the Month
                      </div>
                      <div className="bg-montenegro-red text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                        {CITY_OF_THE_MONTH.month}
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-display font-bold select-none overflow-hidden">
                      {CITY_OF_THE_MONTH.month.substring(0, 3).toUpperCase()}
                    </div>

                    <span className="text-montenegro-red font-bold tracking-widest text-xs uppercase mb-2">Editor's Choice • {CITY_OF_THE_MONTH.month}</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-slate-900">{cityOfMonth.name}</h2>

                    <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-montenegro-red mb-8">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center">
                        <Calendar size={14} className="mr-2" /> Why it was picked
                      </h3>
                      <p className="text-slate-600 text-base leading-relaxed italic">
                        "{CITY_OF_THE_MONTH.description}"
                      </p>
                    </div>

                    <div className="flex items-center text-slate-900 font-bold tracking-wide group-hover:translate-x-2 transition-transform mt-auto">
                      EXPLORE THE LIST <ArrowLeft className="rotate-180 ml-2" size={20} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selector */}
            <TownSelector towns={towns} onSelectTown={setSelectedTown} />

            {/* Ambassador Program Section */}
            <div id="ambassadors" className="bg-white py-24 border-t border-slate-100 mt-12">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-6">
                    <Users size={32} className="text-slate-400" />
                  </div>
                  <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Built by Locals, Not Algorithms</h2>
                  <p className="text-xl text-slate-500 max-w-3xl mx-auto">
                    Our lists are limited because quality matters. If you know the shortcuts, the family-run kitchens,
                    and the stories behind each place, we want you on the team.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-stretch">
                  <div
                    id="feedback-box"
                    className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-xl h-full flex flex-col"
                  >
                    <div className="space-y-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold uppercase tracking-[0.2em] text-montenegro-gold">Disagree with a list?</p>
                          <h3 className="text-2xl font-display font-bold">Report an issue</h3>
                          <p className="text-sm text-slate-300 mt-1">
                            Tell us why something shouldn’t be on the list and our curators will re-check it within 48 hours.
                          </p>
                        </div>
                        <div className="hidden md:flex items-center text-[10px] text-slate-200 gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 whitespace-nowrap">
                          <AlertTriangle size={12} /> Fast triage
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <label className="flex flex-col text-sm font-semibold text-white">
                          Your name (optional)
                          <input
                            value={reportForm.name}
                            onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                            className="mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-montenegro-gold focus:ring-2 focus:ring-montenegro-gold/30 outline-none"
                            placeholder="Anonymous works too"
                          />
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-white">
                          Which list are you flagging?
                          <input
                            value={reportForm.listName}
                            onChange={(e) => setReportForm({ ...reportForm, listName: e.target.value })}
                            className="mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 focus:border-montenegro-gold focus:ring-2 focus:ring-montenegro-gold/30 outline-none"
                            placeholder="e.g. Kotor food"
                          />
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-white">
                          Why should it change?
                          <select
                            value={reportForm.reason}
                            onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
                            className="mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-montenegro-gold focus:ring-2 focus:ring-montenegro-gold/30 outline-none"
                          >
                            <option className="text-slate-900" value="Closed down">Closed down</option>
                            <option className="text-slate-900" value="Quality slipped">Quality slipped</option>
                            <option className="text-slate-900" value="Safety concerns">Safety concerns</option>
                            <option className="text-slate-900" value="Better alternative exists">Better alternative exists</option>
                            <option className="text-slate-900" value="Other">Other</option>
                          </select>
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-white">
                          Details that help us verify
                          <textarea
                            value={reportForm.details}
                            onChange={(e) => setReportForm({ ...reportForm, details: e.target.value })}
                            className="mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white placeholder:text-white/50 focus:border-montenegro-gold focus:ring-2 focus:ring-montenegro-gold/30 outline-none"
                            rows={3}
                            placeholder="Share dates, photos, or what you observed"
                          ></textarea>
                        </label>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-200">How we respond</p>
                        <ul className="space-y-2 text-sm text-slate-100">
                          <li className="flex items-start gap-2"><span className="text-montenegro-gold text-lg leading-5">•</span>We verify on the ground within 48 hours.</li>
                          <li className="flex items-start gap-2"><span className="text-montenegro-gold text-lg leading-5">•</span>You receive a follow-up with what changed.</li>
                          <li className="flex items-start gap-2"><span className="text-montenegro-gold text-lg leading-5">•</span>If urgent, we temporarily hide the spot while we check.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-[1fr_auto] items-center gap-3 mt-auto pt-4">
                      {reportStatus === 'success' ? (
                        <p className="text-green-400 font-bold flex items-center gap-2">
                          <Sparkles size={16} /> Report sent! We'll look into it.
                        </p>
                      ) : reportStatus === 'error' ? (
                        <p className="text-red-400 font-bold flex items-center gap-2">
                          <AlertTriangle size={16} /> Something went wrong. Try again.
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 flex items-center gap-2">
                          <Sparkles size={14} /> <span className="whitespace-nowrap">Fast triage by the curator team</span>
                        </p>
                      )}

                      <button
                        onClick={handleReportSubmit}
                        disabled={isSubmittingReport || reportStatus === 'success'}
                        className={`px-5 py-2.5 font-bold rounded-lg transition-colors ${reportStatus === 'success'
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-white text-slate-900 hover:bg-slate-200'
                          } ${isSubmittingReport ? 'opacity-70 cursor-wait' : ''}`}
                      >
                        {isSubmittingReport ? 'Sending...' : reportStatus === 'success' ? 'Sent' : 'Submit a report'}
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleAmbassadorSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/60 h-full flex flex-col">
                    <div className="space-y-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold uppercase tracking-[0.2em] text-montenegro-red">Apply</p>
                          <h3 className="text-2xl font-display font-bold text-slate-900">Become an Ambassador</h3>
                          <p className="text-sm text-slate-500 mt-1">Share the essentials and we'll reach out within 48 hours.</p>
                        </div>
                        <div className="hidden md:flex items-center text-[10px] text-slate-500 gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 whitespace-nowrap">
                          <Send size={12} /> Secure form
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <label className="flex flex-col text-sm font-semibold text-slate-700">
                          Full Name
                          <input
                            required
                            value={ambassadorForm.name}
                            onChange={(e) => setAmbassadorForm({ ...ambassadorForm, name: e.target.value })}
                            className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-montenegro-red focus:ring-2 focus:ring-montenegro-red/20 outline-none"
                            placeholder="Your name"
                          />
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-slate-700">
                          Email
                          <input
                            required
                            type="email"
                            value={ambassadorForm.email}
                            onChange={(e) => setAmbassadorForm({ ...ambassadorForm, email: e.target.value })}
                            className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-montenegro-red focus:ring-2 focus:ring-montenegro-red/20 outline-none"
                            placeholder="you@example.com"
                          />
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-slate-700">
                          Town or Region
                          <input
                            value={ambassadorForm.town}
                            onChange={(e) => setAmbassadorForm({ ...ambassadorForm, town: e.target.value })}
                            className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-montenegro-red focus:ring-2 focus:ring-montenegro-red/20 outline-none"
                            placeholder="e.g. Kotor, Durmitor area"
                          />
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-slate-700">
                          Expertise
                          <input
                            value={ambassadorForm.expertise}
                            onChange={(e) => setAmbassadorForm({ ...ambassadorForm, expertise: e.target.value })}
                            className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-montenegro-red focus:ring-2 focus:ring-montenegro-red/20 outline-none"
                            placeholder="Food, hikes, architecture..."
                          />
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-slate-700 md:col-span-2">
                          Why do you want to join?
                          <textarea
                            value={ambassadorForm.motivation}
                            onChange={(e) => setAmbassadorForm({ ...ambassadorForm, motivation: e.target.value })}
                            className="mt-2 rounded-lg border border-slate-200 px-3 py-3 text-slate-900 focus:border-montenegro-red focus:ring-2 focus:ring-montenegro-red/20 outline-none"
                            rows={3}
                            placeholder="Tell us how you explore your town"
                          ></textarea>
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-slate-700">
                          Links or Socials
                          <input
                            value={ambassadorForm.links}
                            onChange={(e) => setAmbassadorForm({ ...ambassadorForm, links: e.target.value })}
                            className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-montenegro-red focus:ring-2 focus:ring-montenegro-red/20 outline-none"
                            placeholder="Instagram, blog, maps list"
                          />
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-slate-700">
                          Availability
                          <select
                            value={ambassadorForm.availability}
                            onChange={(e) => setAmbassadorForm({ ...ambassadorForm, availability: e.target.value })}
                            className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-montenegro-red focus:ring-2 focus:ring-montenegro-red/20 outline-none"
                          >
                            <option>1-2 hrs / week</option>
                            <option>3-5 hrs / week</option>
                            <option>Weekend drops</option>
                            <option>Seasonal (summer/winter)</option>
                          </select>
                        </label>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">What we look for</p>
                        <ul className="space-y-2 text-sm text-slate-600">
                          <li className="flex items-start gap-2"><span className="text-montenegro-red text-lg leading-5">•</span> Lives in or frequently visits the town they cover</li>
                          <li className="flex items-start gap-2"><span className="text-montenegro-red text-lg leading-5">•</span> Verifies places in person and talks to owners</li>
                          <li className="flex items-start gap-2"><span className="text-montenegro-red text-lg leading-5">•</span> Can share 1-2 photos per spot and concise notes</li>
                          <li className="flex items-start gap-2"><span className="text-montenegro-red text-lg leading-5">•</span> Keeps lists tight — we only publish a Top 5</li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-[1fr_auto] items-center gap-3 mt-auto pt-4">
                      {ambassadorStatus === 'success' ? (
                        <p className="text-green-600 font-bold flex items-center gap-2">
                          <Sparkles size={16} /> Application sent! We'll be in touch.
                        </p>
                      ) : ambassadorStatus === 'error' ? (
                        <p className="text-red-500 font-bold flex items-center gap-2">
                          <AlertTriangle size={16} /> Error sending application. Check console.
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500">We never sell data. Your submission goes directly to the curation team.</p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmittingAmbassador || ambassadorStatus === 'success'}
                        className={`px-5 py-2.5 font-bold rounded-lg transition-colors shadow-lg shadow-red-500/30 whitespace-nowrap ${ambassadorStatus === 'success'
                          ? 'bg-green-600 text-white cursor-default'
                          : 'bg-montenegro-red text-white hover:bg-red-700'
                          } ${isSubmittingAmbassador ? 'opacity-70 cursor-wait' : ''}`}
                      >
                        {isSubmittingAmbassador ? 'Sending...' : ambassadorStatus === 'success' ? 'Applied!' : 'Submit application'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Blog Section */}
            <div id="blog" className="bg-slate-900 text-white py-24 border-t border-slate-800">
              <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between flex-col md:flex-row md:items-end gap-6 mb-10">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-montenegro-gold mb-2">Ambassador Blog</p>
                    <h2 className="text-4xl font-display font-bold leading-tight">Stories from the Top 5 frontlines</h2>
                    <p className="text-slate-300 mt-3 max-w-2xl">Field notes, photo drops, and why certain spots made the cut. Updated by the locals who walk these streets every day.</p>
                  </div>
                  <a
                    className="inline-flex items-center gap-2 text-sm font-bold text-montenegro-gold hover:text-white transition-colors"
                    href="#ambassadors"
                  >
                    Become a contributor <ArrowLeft className="rotate-180" size={18} />
                  </a>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {sortedBlogPosts.map((post, index) => (
                    <article
                      key={post.title}
                      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-800/70 via-slate-900 to-slate-900 shadow-2xl shadow-black/40 cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-all" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url(${post.hero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                      <div className="relative p-6 flex flex-col h-full backdrop-blur-[1px]">
                        <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-montenegro-gold mb-3">
                          <span className="flex items-center gap-2"><Sparkles size={14} /> {post.category}</span>
                          <span className="ml-auto text-white/80 pl-4 text-right">{post.date}</span>
                        </div>
                        <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-montenegro-gold transition-colors">{post.title}</h3>
                        <p className="text-slate-200/90 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                        <div className="mt-auto flex items-center justify-between text-sm text-white/80">
                          <span className="font-semibold">{post.author} • {post.authorTitle}</span>
                          <span className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full"><Clock size={12} /> {post.readingTime}</span>
                        </div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-montenegro-red/30 via-transparent to-transparent"></div>
                        <div className="mt-4 inline-flex items-center gap-2 text-montenegro-gold font-semibold text-xs uppercase tracking-[0.2em]">Read story <ArrowLeft className="rotate-180" size={16} /></div>
                      </div>
                      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-montenegro-red/30 blur-3xl group-hover:blur-2xl transition-all"></div>
                      <div className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-montenegro-gold/20 blur-3xl group-hover:blur-2xl transition-all"></div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Town Detail Page
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {/* Town Header */}
            <div className="relative h-[50vh] min-h-[400px] w-full bg-slate-900 overflow-hidden">
              <img
                src={selectedTown.imageUrl}
                alt={selectedTown.name}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

              <div className="absolute top-0 left-0 p-6">
                <button
                  onClick={handleBackToMap}
                  className="flex items-center text-white/90 hover:text-white transition-colors text-sm font-bold bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full hover:bg-white/20 border border-white/10"
                >
                  <ArrowLeft size={16} className="mr-2" /> All Cities
                </button>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between">
                  <div className="animate-in slide-in-from-left duration-700">
                    <span className="text-montenegro-gold font-bold tracking-[0.2em] uppercase text-xs mb-3 block">{selectedTown.region} Region</span>
                    <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-4">{selectedTown.name}</h1>
                    <p className="text-2xl text-slate-200 font-light max-w-xl">{selectedTown.tagline}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation & Content */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <div className="bg-slate-50 min-h-[600px] pt-12">
              <ContentList town={selectedTown} category={selectedCategory} language={language} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
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
              <li><a href="#" className="hover:text-white transition-colors">Hidden Gems</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Local Activities</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Traditional Food</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cultural Heritage</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Community</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Apply as Ambassador</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Submit a Location</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Vote & Verify</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Settings</a></li>
            </ul>
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
