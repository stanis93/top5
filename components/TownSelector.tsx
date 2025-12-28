import React, { useState } from 'react';
import { Town } from '../types';
import { MapPin, ArrowLeft } from 'lucide-react';

interface TownSelectorProps {
  towns: Town[];
  onSelectTown: (town: Town) => void;
}

export const TownSelector: React.FC<TownSelectorProps> = ({ towns, onSelectTown }) => {
  const [filterRegion, setFilterRegion] = useState<string>('All');

  const filteredTowns = filterRegion === 'All'
    ? towns
    : towns.filter(t => t.region === filterRegion);

  return (
    <div className="w-full max-w-[1820px] mx-auto px-4 md:px-12 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-200 pb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-montenegro-red mb-2">Regional Guide</p>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 tracking-tighter">Explore Montenegro</h2>
        </div>
        <div className="flex bg-white p-1 rounded-none border border-slate-200 shadow-sm mt-8 md:mt-0 overflow-x-auto">
          {['All', 'Coastal', 'Central', 'Northern'].map(region => (
            <button
              key={region}
              onClick={() => setFilterRegion(region)}
              className={`px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterRegion === region
                ? 'bg-slate-900 text-white shadow-xl'
                : 'text-slate-400 hover:text-slate-900'
                }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 w-full">
        {filteredTowns.map((town) => (
          <button
            key={town.id}
            onClick={() => onSelectTown(town)}
            className="group relative h-[500px] w-full rounded-none overflow-hidden transition-all duration-700 text-left focus:outline-none bg-slate-200"
          >
            <div className="absolute inset-0 z-0">
              <img
                src={town.imageUrl}
                alt={town.name}
                className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors opacity-50 group-hover:opacity-0" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />

            <div className="absolute bottom-0 left-0 p-10 w-full z-20">
              <div className="overflow-hidden mb-4">
                <span className="inline-block py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white border-b border-montenegro-red transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  {town.region} Selection
                </span>
              </div>
              <h3 className="text-5xl font-display font-bold text-white mb-4 tracking-tighter hover:text-montenegro-gold transition-colors">
                {town.name}
              </h3>
              <p className="text-slate-200 text-xs font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 tracking-wide font-sans italic">
                {town.tagline}
              </p>
            </div>

            <div className="absolute top-8 right-8 w-12 h-12 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform scale-50 group-hover:scale-100">
              <ArrowLeft size={20} className="text-white rotate-180" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};