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
    <div className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
      <div className="max-w-[1820px] mx-auto px-4 md:px-12">
        <div className="flex overflow-x-auto no-scrollbar py-6 gap-6 md:justify-start">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as Category)}
                className={`group flex items-center whitespace-nowrap space-x-3 px-2 py-1.5 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative ${isActive
                  ? 'text-slate-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-montenegro-red'
                  : 'text-slate-400 hover:text-slate-900'
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