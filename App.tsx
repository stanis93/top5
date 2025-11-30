
import React, { useState } from 'react';
import { TownSelector } from './components/TownSelector';
import { CategoryNav } from './components/CategoryNav';
import { ContentList } from './components/ContentList';
import { Logo } from './components/Logo';
import { Town, Category } from './types';
import { CITY_OF_THE_MONTH, TOWNS } from './constants';
import { ArrowLeft, Star, Users, MapPin, Instagram, Calendar } from 'lucide-react';

const App: React.FC = () => {
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.HIDDEN_GEMS);
  const [language, setLanguage] = useState<'en' | 'mn'>('en');

  const handleBackToMap = () => {
    setSelectedTown(null);
    setSelectedCategory(Category.HIDDEN_GEMS);
    window.scrollTo(0,0);
  };

  const cityOfMonth = TOWNS.find(t => t.id === CITY_OF_THE_MONTH.townId);

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
        {!selectedTown ? (
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
                       {CITY_OF_THE_MONTH.month.substring(0,3).toUpperCase()}
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
            <TownSelector onSelectTown={setSelectedTown} />

            {/* Ambassador Program Section */}
            <div id="ambassadors" className="bg-white py-24 border-t border-slate-100 mt-12">
              <div className="max-w-5xl mx-auto px-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-6">
                  <Users size={32} className="text-slate-400" />
                </div>
                <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Built by Locals, Not Algorithms</h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
                  Our lists are limited because quality matters. Don't see your town? Or think a list is wrong?
                  Join our network of local ambassadors and help us show the real Montenegro.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <button className="px-8 py-3 bg-montenegro-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30">
                    Become an Ambassador
                  </button>
                  <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    Report an Issue
                  </button>
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
              The anti-algorithm guide. <br/>
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
          <span className="flex items-center gap-1"><MapPin size={12}/> Made in Montenegro</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
