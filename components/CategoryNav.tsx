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
    case Category.TRADITIONAL_FOOD: return <Utensils {...props} />;
    case Category.STREET_FOOD: return <Sandwich {...props} />;
    case Category.CULTURAL_HERITAGE: return <Landmark {...props} />;
    default: return null;
  }
};

export const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 mb-8 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto no-scrollbar py-3 px-4 md:px-6 md:justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as Category)}
                className={`group flex items-center whitespace-nowrap space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-slate-50 border-slate-200 text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
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