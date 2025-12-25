import React, { useEffect, useState } from 'react';
import { fetchTop5List } from '../services/geminiService';
import { fetchListItems, urlFor } from '../services/sanityClient';
import { ListItem, Category, Town, SanityListItem } from '../types';
import { CheckCircle2, AlertCircle, MapPin, RefreshCw, ThumbsUp, ThumbsDown, RotateCcw, ArrowLeft } from 'lucide-react';

interface ContentListProps {
  town: Town;
  category: Category;
  language: 'en' | 'mn';
  hideTitle?: boolean;
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
  rawData?: SanityListItem; // Store original sanity data for detail view
}

export const ContentList: React.FC<ContentListProps> = ({ town, category, language, onSelectItem, hideTitle }) => {
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
            coordinates: item.location?.coordinates,
            verificationStatus: item.status === 'published' ? 'verified' : 'needs_verification',
            imageKeyword: item.name,
            imageUrl: item.images && item.images.length > 0
              ? urlFor(item.images[0]).width(600).height(800).url()
              : undefined,
            id: idx,
            likes: getRandomVotes(),
            dislikes: Math.floor(Math.random() * 5),
            userVote: null as 'like' | 'dislike' | null,
            rawData: item
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
            const processedItems: ItemWithStats[] = data.items.map((item, idx) => ({
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

  const handleVote = (e: React.MouseEvent, index: number, type: 'like' | 'dislike') => {
    e.stopPropagation(); // Don't trigger the detail view click
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

  const handleSwapItem = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();
    if (!reserveItem) return;

    // Replace the item at index with reserve
    setDisplayItems(current => {
      const newList = [...current];
      newList[indexToRemove] = { ...reserveItem, id: Date.now() };
      return newList;
    });
    setReserveItem(null); // Used the reserve
  };

  const handleItemClick = (item: ItemWithStats) => {
    if (onSelectItem && item.rawData) {
      onSelectItem(item.rawData);
    }
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
    <div className={`w-full ${hideTitle ? 'mt-0' : 'mt-16'} pb-24`}>
      {!hideTitle && (
        <div className="mb-20 text-center space-y-4">
          <p className="text-montenegro-red font-black uppercase tracking-[0.4em] text-[10px]">The Official Selection</p>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tight">
            Top 5 {category}
          </h2>
          <div className="flex items-center justify-center gap-4 text-slate-400">
            <div className="h-px w-12 bg-slate-200"></div>
            <p className="text-sm font-bold uppercase tracking-widest italic">
              {language === 'mn' ? `u gradu ${town.name}` : `in ${town.name}, Montenegro`}
            </p>
            <div className="h-px w-12 bg-slate-200"></div>
          </div>
        </div>
      )}

      <div className="space-y-12">
        {displayItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={`group flex flex-col md:flex-row gap-0 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${item.rawData ? 'cursor-pointer' : ''}`}
          >
            {/* Image Side - Fixed absolute width to 'keep as is' while card grows */}
            <div className="w-full md:w-[480px] lg:w-[580px] aspect-[16/9] md:aspect-[16/7] relative overflow-hidden flex-shrink-0 bg-slate-100 border-r border-slate-100">
              <div className="absolute top-4 left-4 z-20 w-10 h-10 bg-montenegro-red text-white flex items-center justify-center font-display font-black text-xl rounded-sm shadow-xl">
                {index + 1}
              </div>
              <img
                src={item.imageUrl || `https://picsum.photos/1200/800?random=${index + town.id.length + (item.userVote ? 100 : 0)}`}
                alt={item.name}
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {item.rawData && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm">
                  <span className="bg-white text-slate-900 px-7 py-2.5 rounded-sm font-black uppercase tracking-widest text-[9px] shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {language === 'mn' ? 'Vidi Priču' : 'Read Full Story'}
                  </span>
                </div>
              )}
            </div>

            {/* Content Side - flex-1 absorbs all the new width difference */}
            <div className="flex-1 flex flex-col p-8 lg:p-10">
              <div className="mb-4">
                <h3 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 leading-tight mb-4 group-hover:text-montenegro-red transition-colors">
                  {item.name}
                </h3>

                <div className="flex flex-wrap items-center gap-6">
                  {item.verificationStatus === 'verified' ? (
                    <div className="flex items-center gap-1.5 text-teal-600">
                      <CheckCircle2 size={13} strokeWidth={3} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{language === 'mn' ? "Provjereno" : "Verified"}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-amber-600">
                      <AlertCircle size={13} strokeWidth={3} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{language === 'mn' ? "U provjeri" : "Review"}</span>
                    </div>
                  )}

                  {item.location && (
                    <a
                      href={item.coordinates
                        ? `https://www.google.com/maps/search/?api=1&query=${item.coordinates.lat},${item.coordinates.lng}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location + ', ' + town.name + ', Montenegro')}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-400 hover:text-montenegro-red transition-colors inline-flex items-center gap-1.5"
                    >
                      <MapPin size={11} strokeWidth={3} />
                      <span className="text-[10px] font-black uppercase tracking-widest border-b border-transparent hover:border-montenegro-red line-clamp-1">{item.location}</span>
                    </a>
                  )}
                </div>
              </div>

              <p className="text-base text-slate-600 mb-6 leading-relaxed font-medium line-clamp-3">
                {item.description}
              </p>

              <div className="relative pl-6 border-l-2 border-slate-900 mb-6 py-1">
                <p className="text-sm lg:text-base font-bold text-slate-900 italic leading-relaxed">
                  "{item.reason}"
                </p>
              </div>

              {/* Interaction Bar */}
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-8">
                  <button
                    onClick={(e) => handleVote(e, index, 'like')}
                    className={`flex items-center gap-2 transition-all ${item.userVote === 'like' ? 'text-slate-900 scale-110' : 'text-slate-300 hover:text-slate-900'}`}
                  >
                    <ThumbsUp size={18} fill={item.userVote === 'like' ? 'currentColor' : 'none'} />
                    <span className="text-sm font-bold">{item.likes}</span>
                  </button>

                  <button
                    onClick={(e) => handleVote(e, index, 'dislike')}
                    className={`flex items-center gap-2 transition-all ${item.userVote === 'dislike' ? 'text-montenegro-red scale-110' : 'text-slate-300 hover:text-montenegro-red'}`}
                  >
                    <ThumbsDown size={18} fill={item.userVote === 'dislike' ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-[1px] bg-slate-100"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    {item.rawData ? (language === 'mn' ? "Priča" : "Story") : "Official Selection"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};