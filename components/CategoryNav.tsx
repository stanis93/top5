import React from 'react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';
import { Sparkles, Compass, Utensils, Sandwich, Landmark } from 'lucide-react';

interface CategoryNavProps {
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
}

const CategoryIcon: React.FC<{ id: Category; active: boolean }> = ({ id, active }) => {
  const props = {
    size: 16,
    className: `transition-colors ${active ? 'text-montenegro-red' : 'text-slate-400 group-hover:text-slate-600'}`
  };

  switch (id) {
    case Category.HIDDEN_GEMS: return <Sparkles {...props} />;
    case Category.ACTIVITIES: return <Compass {...props} />;
    case Category.FOOD_DRINKS: return <Utensils {...props} />;
    case Category.STREET_FOOD: return <Sandwich {...props} />;
    case Category.CULTURAL_HERITAGE: return <Landmark {...props} />;
    default: return null;
  }
};

export const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-y border-white/20 shadow-sm overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto no-scrollbar py-4 px-4 md:px-6 md:justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as Category)}
                className={`group flex items-center whitespace-nowrap space-x-2 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isActive
                  ? 'bg-slate-900 text-white shadow-lg scale-105'
                  : 'bg-white/40 border border-white/60 text-slate-500 hover:bg-white/80 hover:text-slate-900'
                  }`}
              >
                <CategoryIcon id={cat.id as Category} active={isActive} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};