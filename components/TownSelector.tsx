import React, { useState } from 'react';
import { Town } from '../types';
import { MapPin } from 'lucide-react';

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
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-4 md:mb-0">Explore by Region</h2>
        <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {['All', 'Coastal', 'Central', 'Northern'].map(region => (
            <button
              key={region}
              onClick={() => setFilterRegion(region)}
              className={`px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-colors ${filterRegion === region
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTowns.map((town) => (
          <button
            key={town.id}
            onClick={() => onSelectTown(town)}
            className="group relative h-96 w-full rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-700 text-left focus:outline-none"
          >
            <div className="absolute inset-0 bg-slate-900">
              <img
                src={town.imageUrl}
                alt={town.name}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="inline-block px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-widest text-white bg-montenegro-red rounded shadow-sm">
                {town.region}
              </span>
              <h3 className="text-4xl font-display font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
                {town.name}
              </h3>
              <p className="text-slate-300 text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                <MapPin size={14} className="text-montenegro-red font-bold" />
                {town.tagline}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};