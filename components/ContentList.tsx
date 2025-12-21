import React, { useEffect, useState } from 'react';
import { fetchTop5List } from '../services/geminiService';
import { fetchListItems, urlFor } from '../services/sanityClient';
import { ListItem, Category, Town } from '../types';
import { CheckCircle2, AlertCircle, MapPin, RefreshCw, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';

interface ContentListProps {
  town: Town;
  category: Category;
  language: 'en' | 'mn';
}

// Helper to generate random local stats
const getRandomVotes = () => Math.floor(Math.random() * 200) + 40;

const LOADING_MESSAGES_EN = [
  "Opening city archives...",
  "Consulting local guides...",
  "Verifying with the mayor...",
  "Translating old manuscripts...",
  "Calling the best restaurants..."
];

const LOADING_MESSAGES_MN = [
  "Otvaramo gradske arhive...",
  "Konsultujemo lokalne vodiče...",
  "Provjeravamo sa gradonačelnikom...",
  "Prevodimo stare zapise...",
  "Zovemo najbolje restorane..."
];

interface ItemWithStats extends ListItem {
  id: number;
  likes: number;
  dislikes: number;
  userVote: 'like' | 'dislike' | null;
  imageUrl?: string;
}

export const ContentList: React.FC<ContentListProps> = ({ town, category, language }) => {
  const [displayItems, setDisplayItems] = useState<ItemWithStats[]>([]);
  const [reserveItem, setReserveItem] = useState<ItemWithStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMsg, setLoadingMsg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const messages = language === 'mn' ? LOADING_MESSAGES_MN : LOADING_MESSAGES_EN;
    setLoadingMsg(messages[0]);

    // Cycle loading messages
    const msgInterval = setInterval(() => {
      setLoadingMsg(messages[Math.floor(Math.random() * messages.length)]);
    }, 2000);

    const loadData = async () => {
      setLoading(true);
      setError(null);
      setDisplayItems([]);
      setReserveItem(null);

      try {
        // First, try to fetch from Sanity
        console.log(`🔍 Fetching from Sanity: town="${town.id}", category="${category}"`);
        const sanityItems = await fetchListItems(town.id, category);
        console.log(`📦 Sanity returned ${sanityItems?.length || 0} items:`, sanityItems);

        if (sanityItems && sanityItems.length > 0) {
          // Transform Sanity items to app format
          const processedItems: ItemWithStats[] = sanityItems.map((item, idx) => ({
            name: item.name,
            description: item.description,
            reason: item.reason,
            location: item.location?.address,
            verificationStatus: item.status === 'published' ? 'verified' : 'needs_verification',
            imageKeyword: item.name,
            imageUrl: item.images && item.images.length > 0
              ? urlFor(item.images[0]).width(600).height(800).url()
              : undefined,
            id: idx,
            likes: getRandomVotes(),
            dislikes: Math.floor(Math.random() * 5),
            userVote: null as 'like' | 'dislike' | null
          }));

          if (isMounted) {
            console.log('✅ Using Sanity data');
            setDisplayItems(processedItems.slice(0, 5));
            if (processedItems.length > 5) {
              setReserveItem(processedItems[5]);
            }
          }
        } else {
          // Fallback to Gemini service if no Sanity data
          console.log('⚠️ No Sanity data, falling back to Gemini');
          const data = await fetchTop5List(town.name, category, language);
          console.log(data);

          if (isMounted && data && data.items.length > 0) {
            // Process items with simulated stats
            const processedItems = data.items.map((item, idx) => ({
              ...item,
              id: idx,
              likes: getRandomVotes(),
              dislikes: Math.floor(Math.random() * 5),
              userVote: null as 'like' | 'dislike' | null
            }));

            // Take first 5 for display, 6th as reserve
            setDisplayItems(processedItems.slice(0, 5));
            if (processedItems.length > 5) {
              setReserveItem(processedItems[5]);
            }
          } else if (isMounted) {
            setError(language === 'mn' ? "Naše lokalne arhive su trenutno nedostupne." : "Our local archives are currently unavailable.");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(language === 'mn' ? "Nismo uspjeli kontaktirati lokalne ambasadore." : "Unable to contact local ambassadors. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          clearInterval(msgInterval);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      clearInterval(msgInterval);
    };
  }, [town.id, category, language]);

  const handleVote = (index: number, type: 'like' | 'dislike') => {
    setDisplayItems(current =>
      current.map((item, i) => {
        if (i !== index) return item;

        // If unvoting
        if (item.userVote === type) {
          return {
            ...item,
            userVote: null,
            [type === 'like' ? 'likes' : 'dislikes']: item[type === 'like' ? 'likes' : 'dislikes'] - 1
          };
        }

        // If changing vote
        const updates: any = { userVote: type };
        updates[type === 'like' ? 'likes' : 'dislikes'] = item[type === 'like' ? 'likes' : 'dislikes'] + 1;

        if (item.userVote) {
          const prevType = type === 'like' ? 'dislikes' : 'likes';
          updates[prevType] = item[prevType] - 1;
        }

        return { ...item, ...updates };
      })
    );
  };

  const handleSwapItem = (indexToRemove: number) => {
    if (!reserveItem) return;

    // Replace the item at index with reserve
    setDisplayItems(current => {
      const newList = [...current];
      newList[indexToRemove] = { ...reserveItem, id: Date.now() };
      return newList;
    });
    setReserveItem(null); // Used the reserve
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-pulse">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-montenegro-red border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-600 font-display font-medium text-lg tracking-wide">{loadingMsg}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-red-100 shadow-sm mx-4">
        <div className="text-red-500 mb-4 flex justify-center"><AlertCircle size={48} /></div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{language === 'mn' ? "Nedostupno" : "Unavailable"}</h3>
        <p className="text-slate-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw size={16} /> {language === 'mn' ? "Pokušaj ponovo" : "Try Again"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-3">
          Top 5 {category}
        </h2>
        <p className="text-slate-500 text-lg font-light tracking-wide">
          {language === 'mn' ? `u gradu ${town.name}, Crna Gora` : `in ${town.name}, Montenegro`}
        </p>
      </div>

      <div className="space-y-12">
        {displayItems.map((item, index) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-2xl p-0 md:p-0 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Rank Marker */}
              <div className="absolute left-0 top-0 bg-slate-900 text-white w-12 h-12 flex items-center justify-center font-display font-bold text-xl rounded-br-2xl z-20">
                {index + 1}
              </div>

              {/* Image Side */}
              <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                <img
                  src={item.imageUrl || `https://picsum.photos/600/800?random=${index + town.id.length + (item.userVote ? 100 : 0)}`}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
              </div>

              {/* Content Side */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative">

                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-3xl font-display font-bold text-slate-900 leading-tight">
                    {item.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  {item.verificationStatus === 'verified' ? (
                    <span title="Verified by Locals" className="text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-teal-100 flex items-center gap-1">
                      <CheckCircle2 size={10} /> {language === 'mn' ? "Potvrđeno" : "Verified Local Pick"}
                    </span>
                  ) : (
                    <span title="Needs Local Verification" className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-100 flex items-center gap-1">
                      <AlertCircle size={10} /> {language === 'mn' ? "Čeka potvrdu" : "Pending Verification"}
                    </span>
                  )}
                  {item.location && (
                    <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                      <MapPin size={10} /> {item.location}
                    </span>
                  )}
                </div>

                <p className="text-slate-600 mb-6 leading-relaxed text-base">
                  {item.description}
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-montenegro-red mb-6">
                  <p className="text-sm text-slate-800 italic">
                    "{item.reason}"
                  </p>
                </div>

                {/* Interaction Bar */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleVote(index, 'like')}
                      className={`flex items-center space-x-2 text-sm font-bold transition-colors ${item.userVote === 'like' ? 'text-green-600' : 'text-slate-400 hover:text-green-600'}`}
                    >
                      <ThumbsUp size={18} className={item.userVote === 'like' ? 'fill-current' : ''} />
                      <span>{item.likes}</span>
                    </button>

                    <button
                      onClick={() => handleVote(index, 'dislike')}
                      className={`flex items-center space-x-2 text-sm font-bold transition-colors ${item.userVote === 'dislike' ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                    >
                      <ThumbsDown size={18} className={item.userVote === 'dislike' ? 'fill-current' : ''} />
                    </button>
                  </div>

                  {item.userVote === 'dislike' && reserveItem ? (
                    <button
                      onClick={() => handleSwapItem(index)}
                      className="flex items-center space-x-2 text-xs text-white bg-montenegro-red hover:bg-red-700 px-3 py-1.5 rounded-lg font-medium animate-in slide-in-from-right-2 transition-colors shadow-sm"
                    >
                      <RotateCcw size={12} />
                      <span>{language === 'mn' ? "Zamijeni" : "Incorrect? Swap it"}</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-300 font-medium uppercase tracking-widest">
                      {language === 'mn' ? "Lokalni izbor" : "Community Curated"}
                    </span>
                  )}
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};