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
        <div className="flex space-x-2 bg-white p-1 rounded-full border border-slate-200 shadow-sm">
          {['All', 'Coastal', 'Central', 'Northern'].map(region => (
            <button
              key={region}
              onClick={() => setFilterRegion(region)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterRegion === region
                  ? 'bg-montenegro-red text-white'
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTowns.map((town) => (
          <button
            key={town.id}
            onClick={() => onSelectTown(town)}
            className="group relative h-64 w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-montenegro-red/20"
          >
            <div className="absolute inset-0 bg-slate-900">
              <img
                src={town.imageUrl}
                alt={town.name}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 w-full">
              <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold text-white bg-montenegro-red rounded-md shadow-sm">
                {town.region}
              </span>
              <h3 className="text-3xl font-display font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
                {town.name}
              </h3>
              <p className="text-slate-200 text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                <MapPin size={14} />
                {town.tagline}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};