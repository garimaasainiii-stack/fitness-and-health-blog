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
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome();
              }}
              className="text-left group cursor-pointer"
            >
              <span className="font-serif text-2xl lg:text-3xl font-semibold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
                Aura &amp; Iron
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-stone-500 font-sans font-medium -mt-0.5">
                Health &amp; Performance Journal
              </span>
            </a>
          </div>

          {/* Zone 2: Navigation Links (4-6 text links) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome();
              }}
              className={`hover:text-stone-950 transition-colors cursor-pointer py-1 ${
                currentView === 'home' && !searchQuery ? 'text-stone-950 font-semibold' : ''
              }`}
            >
              Latest Dispatch
            </a>
            <a
              href="/strength"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('Strength & Training');
              }}
              className="hover:text-stone-950 transition-colors cursor-pointer py-1"
            >
              Strength
            </a>
            <a
              href="/cardio"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('Cardio & Endurance');
              }}
              className="hover:text-stone-950 transition-colors cursor-pointer py-1"
            >
              Cardio
            </a>
            <a
              href="/recovery"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('Recovery & Sleep');
              }}
              className="hover:text-stone-950 transition-colors cursor-pointer py-1"
            >
              Recovery
            </a>
            <a
              href="/nutrition"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('Nutrition & Fuel');
              }}
              className="hover:text-stone-950 transition-colors cursor-pointer py-1"
            >
              Nutrition
            </a>
            <a
              href="/longevity"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('Longevity & Science');
              }}
              className="hover:text-stone-950 transition-colors cursor-pointer py-1"
            >
              Longevity
            </a>
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
            <a
              href="/calculators"
              onClick={(e) => {
                e.preventDefault();
                onOpenCalculator();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Interactive Physiological Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-stone-600" />
              <span>Bio-Calculators</span>
            </a>

            {/* Saved Articles Drawer Trigger */}
            <a
              href="/saved"
              onClick={(e) => {
                e.preventDefault();
                onOpenSaved();
              }}
              className="relative p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
              title="Saved Articles"
              aria-label="View saved articles"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-900 text-stone-100 text-[10px] font-mono font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </a>

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
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome();
                onSelectCategory('All Articles');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-stone-100/60 rounded-md hover:bg-stone-100 block"
            >
              All Articles
            </a>
            <a
              href="/strength"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('Strength & Training');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-stone-100/60 rounded-md hover:bg-stone-100 block"
            >
              Strength &amp; Training
            </a>
            <a
              href="/cardio"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('Cardio & Endurance');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-stone-100/60 rounded-md hover:bg-stone-100 block"
            >
              Cardio &amp; Endurance
            </a>
            <a
              href="/recovery"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('Recovery & Sleep');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-stone-100/60 rounded-md hover:bg-stone-100 block"
            >
              Recovery &amp; Sleep
            </a>
            <a
              href="/nutrition"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('Nutrition & Fuel');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-stone-100/60 rounded-md hover:bg-stone-100 block"
            >
              Nutrition &amp; Fuel
            </a>
            <a
              href="/longevity"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('Longevity & Science');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 bg-stone-100/60 rounded-md hover:bg-stone-100 block"
            >
              Longevity &amp; Science
            </a>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <a
              href="/calculators"
              onClick={(e) => {
                e.preventDefault();
                onOpenCalculator();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-medium text-center bg-stone-900 text-white rounded-lg block"
            >
              Bio-Calculators Tool
            </a>
            <a
              href="/saved"
              onClick={(e) => {
                e.preventDefault();
                onOpenSaved();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-4 text-xs font-medium border border-stone-300 rounded-lg text-stone-800 text-center block"
            >
              Saved ({savedCount})
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
