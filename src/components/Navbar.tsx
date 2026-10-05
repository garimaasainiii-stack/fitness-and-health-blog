import React, { useState } from 'react';
import { Bookmark, Search, Calculator, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigateHome: () => void;
  onOpenCalculator: () => void;
  onSelectCategory: (cat: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateHome,
  onOpenCalculator,
  onSelectCategory,
  savedCount,
  onOpenSaved,
  searchQuery,
  setSearchQuery,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="text-left group cursor-pointer"
            >
              <span className="font-serif text-2xl lg:text-3xl font-semibold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
                Aura &amp; Iron
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-stone-500 font-sans font-medium -mt-0.5">
                Health &amp; Performance Journal
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (4-6 text links) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <button
              onClick={onNavigateHome}
              className={`hover:text-stone-950 transition-colors cursor-pointer py-1 ${
                currentView === 'home' && !searchQuery ? 'text-stone-950 font-semibold' : ''
              }`}
            >
              Latest Dispatch
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory('Strength & Training');
              }}
              className="hover:text-stone-950 transition-colors cursor-pointer py-1"
            >
              Strength
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory('Cardio & Endurance');
              }}
              className="hover:text-stone-950 transition-colors cursor-pointer py-1"
            >
              Cardio
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory('Recovery & Sleep');
              }}
              className="hover:text-stone-950 transition-colors cursor-pointer py-1"
            >
              Recovery
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory('Nutrition & Fuel');
              }}
              className="hover:text-stone-950 transition-colors cursor-pointer py-1"
            >
              Nutrition
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory('Longevity & Science');
              }}
              className="hover:text-stone-950 transition-colors cursor-pointer py-1"
            >
              Longevity
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            {/* Search Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 shadow-xs w-48 sm:w-64 transition-all">
                  <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, topics..."
                    autoFocus
                    className="w-full text-xs text-stone-900 bg-transparent focus:outline-hidden"
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-stone-400 hover:text-stone-700 ml-1"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Open search"
                  className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Health Tools Modal Button */}
            <button
              onClick={onOpenCalculator}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Interactive Physiological Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-stone-600" />
              <span>Bio-Calculators</span>
            </button>

            {/* Saved Articles Drawer Trigger */}
            <button
              onClick={onOpenSaved}
              className="relative p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Saved Articles"
              aria-label="View saved articles"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-900 text-stone-100 text-[10px] font-mono font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-950 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FAF8F5] px-4 pt-3 pb-5 space-y-2">
          <div className="mb-3">
            <div className="flex items-center bg-white border border-stone-300 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across 10 articles..."
                className="w-full text-xs text-stone-900 bg-transparent focus:outline-hidden"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-stone-700">
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory('All Articles');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-stone-100/60 rounded-md hover:bg-stone-100"
            >
              All Articles
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory('Strength & Training');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-stone-100/60 rounded-md hover:bg-stone-100"
            >
              Strength &amp; Training
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory('Cardio & Endurance');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-stone-100/60 rounded-md hover:bg-stone-100"
            >
              Cardio &amp; Endurance
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory('Recovery & Sleep');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-stone-100/60 rounded-md hover:bg-stone-100"
            >
              Recovery &amp; Sleep
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory('Nutrition & Fuel');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-stone-100/60 rounded-md hover:bg-stone-100"
            >
              Nutrition &amp; Fuel
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory('Longevity & Science');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-stone-100/60 rounded-md hover:bg-stone-100"
            >
              Longevity &amp; Science
            </button>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                onOpenCalculator();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-medium text-center bg-stone-900 text-white rounded-lg"
            >
              Bio-Calculators Tool
            </button>
            <button
              onClick={() => {
                onOpenSaved();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-4 text-xs font-medium border border-stone-300 rounded-lg text-stone-800"
            >
              Saved ({savedCount})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
