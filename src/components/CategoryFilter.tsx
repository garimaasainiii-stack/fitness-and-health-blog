import React from 'react';
import { CATEGORIES } from '../data/articles';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  activeCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  activeCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      {/* Segmented Category Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-stone-50 shadow-2xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Active Count indicator */}
      <div className="text-xs text-stone-500 font-mono tabular-nums shrink-0">
        Showing {activeCount} of 10 investigations
      </div>
    </div>
  );
};
