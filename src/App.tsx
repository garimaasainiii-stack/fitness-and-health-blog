/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ARTICLES } from './data/articles';
import { Article } from './types/blog';
import { Navbar } from './components/Navbar';
import { HeroFeatured } from './components/HeroFeatured';
import { CategoryFilter } from './components/CategoryFilter';
import { ArticleCard } from './components/ArticleCard';
import { ArticleView } from './components/ArticleView';
import { FitnessCalculatorModal } from './components/FitnessCalculatorModal';
import { SavedArticlesDrawer } from './components/SavedArticlesDrawer';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { Search, Sparkles, SlidersHorizontal, Calculator } from 'lucide-react';

const CATEGORY_SLUG_MAP: Record<string, string> = {
  strength: 'Strength & Training',
  cardio: 'Cardio & Endurance',
  recovery: 'Recovery & Sleep',
  nutrition: 'Nutrition & Fuel',
  longevity: 'Longevity & Science',
  resilience: 'Mental Resilience',
};

const CATEGORY_TO_SLUG_MAP: Record<string, string> = {
  'Strength & Training': 'strength',
  'Cardio & Endurance': 'cardio',
  'Recovery & Sleep': 'recovery',
  'Nutrition & Fuel': 'nutrition',
  'Longevity & Science': 'longevity',
  'Mental Resilience': 'resilience',
};

export default function App() {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Articles');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('aura_iron_bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Sync saved bookmarks with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_iron_bookmarks', JSON.stringify(savedArticleIds));
    } catch {
      // Ignore storage errors
    }
  }, [savedArticleIds]);

  // Resolve pathname without hash or random IDs
  const resolveRoute = useCallback((path: string) => {
    const clean = path.split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '').toLowerCase();

    if (!clean) {
      return { type: 'home' as const };
    }
    if (clean === 'calculators') {
      return { type: 'calculators' as const };
    }
    if (clean === 'saved') {
      return { type: 'saved' as const };
    }
    if (CATEGORY_SLUG_MAP[clean]) {
      return { type: 'category' as const, category: CATEGORY_SLUG_MAP[clean] };
    }

    const slug = clean.startsWith('article/') ? clean.replace('article/', '') : clean;
    const found = ARTICLES.find((a) => a.slug === slug || a.id === slug);
    if (found) {
      return { type: 'article' as const, article: found };
    }

    return { type: 'home' as const };
  }, []);

  // Sync state from current URL path
  const applyCurrentRoute = useCallback(() => {
    const route = resolveRoute(window.location.pathname);

    if (route.type === 'article' && route.article) {
      setActiveArticleId(route.article.id);
      setIsCalculatorOpen(false);
      setIsSavedDrawerOpen(false);
      document.title = `${route.article.title} — Aura & Iron`;
    } else if (route.type === 'category' && route.category) {
      setActiveArticleId(null);
      setSelectedCategory(route.category);
      setIsCalculatorOpen(false);
      setIsSavedDrawerOpen(false);
      document.title = `${route.category} — Aura & Iron`;
    } else if (route.type === 'calculators') {
      setIsCalculatorOpen(true);
      setIsSavedDrawerOpen(false);
      document.title = `Bioenergetics & Protein Calculator — Aura & Iron`;
    } else if (route.type === 'saved') {
      setIsSavedDrawerOpen(true);
      setIsCalculatorOpen(false);
      document.title = `Saved Investigations Archive — Aura & Iron`;
    } else {
      setActiveArticleId(null);
      setSelectedCategory('All Articles');
      setIsCalculatorOpen(false);
      setIsSavedDrawerOpen(false);
      document.title = `Aura & Iron — Health & Fitness Journal`;
    }
  }, [resolveRoute]);

  // Listen to browser Back/Forward navigation and cleanse any lingering # from address bar
  useEffect(() => {
    // If URL contains a hash, strip it immediately to keep clean URLs
    if (window.location.hash) {
      const h = window.location.hash.replace(/^#\/?/, '').replace(/^article\//, '').trim();
      const target = h ? `/${h}` : (window.location.pathname || '/');
      window.history.replaceState({}, '', target);
    }

    applyCurrentRoute();

    const onPop = () => {
      if (window.location.hash) {
        const h = window.location.hash.replace(/^#\/?/, '').replace(/^article\//, '').trim();
        const target = h ? `/${h}` : (window.location.pathname || '/');
        window.history.replaceState({}, '', target);
      }
      applyCurrentRoute();
    };

    const onHash = (e: HashChangeEvent) => {
      e.preventDefault();
      if (window.location.hash) {
        const h = window.location.hash.replace(/^#\/?/, '').replace(/^article\//, '').trim();
        const target = h ? `/${h}` : (window.location.pathname || '/');
        window.history.replaceState({}, '', target);
      }
      applyCurrentRoute();
    };

    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onHash);
    };
  }, [applyCurrentRoute]);

  const toggleBookmark = (id: string) => {
    setSavedArticleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectArticle = (article: Article) => {
    const newPath = `/${article.slug}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
    setActiveArticleId(article.id);
    setIsCalculatorOpen(false);
    setIsSavedDrawerOpen(false);
    document.title = `${article.title} — Aura & Iron`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setActiveArticleId(null);
    setSelectedCategory('All Articles');
    setSearchQuery('');
    setIsCalculatorOpen(false);
    setIsSavedDrawerOpen(false);
    document.title = `Aura & Iron — Health & Fitness Journal`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (category: string) => {
    const slug = CATEGORY_TO_SLUG_MAP[category];
    const newPath = slug ? `/${slug}` : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
    setActiveArticleId(null);
    setSelectedCategory(category);
    setIsCalculatorOpen(false);
    setIsSavedDrawerOpen(false);
    document.title = `${category} — Aura & Iron`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCalculator = () => {
    if (window.location.pathname !== '/calculators') {
      window.history.pushState({}, '', '/calculators');
    }
    setIsCalculatorOpen(true);
    setIsSavedDrawerOpen(false);
    document.title = `Bioenergetics & Protein Calculator — Aura & Iron`;
  };

  const handleCloseCalculator = () => {
    setIsCalculatorOpen(false);
    if (window.location.pathname === '/calculators') {
      if (activeArticleId) {
        const art = ARTICLES.find((a) => a.id === activeArticleId);
        window.history.pushState({}, '', art ? `/${art.slug}` : '/');
      } else if (selectedCategory !== 'All Articles') {
        const slug = CATEGORY_TO_SLUG_MAP[selectedCategory];
        window.history.pushState({}, '', slug ? `/${slug}` : '/');
      } else {
        window.history.pushState({}, '', '/');
      }
    }
  };

  const handleOpenSaved = () => {
    if (window.location.pathname !== '/saved') {
      window.history.pushState({}, '', '/saved');
    }
    setIsSavedDrawerOpen(true);
    setIsCalculatorOpen(false);
    document.title = `Saved Investigations Archive — Aura & Iron`;
  };

  const handleCloseSaved = () => {
    setIsSavedDrawerOpen(false);
    if (window.location.pathname === '/saved') {
      if (activeArticleId) {
        const art = ARTICLES.find((a) => a.id === activeArticleId);
        window.history.pushState({}, '', art ? `/${art.slug}` : '/');
      } else if (selectedCategory !== 'All Articles') {
        const slug = CATEGORY_TO_SLUG_MAP[selectedCategory];
        window.history.pushState({}, '', slug ? `/${slug}` : '/');
      } else {
        window.history.pushState({}, '', '/');
      }
    }
  };

  const activeArticle = useMemo(() => {
    if (!activeArticleId) return null;
    return ARTICLES.find((a) => a.id === activeArticleId) || null;
  }, [activeArticleId]);

  const featuredArticle = useMemo(() => {
    return ARTICLES.find((a) => a.isFeatured) || ARTICLES[0];
  }, []);

  // Filtered articles for homepage card grid
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All Articles' || article.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.subtitle.toLowerCase().includes(q) ||
        article.author.name.toLowerCase().includes(q) ||
        article.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const savedArticlesList = useMemo(() => {
    return ARTICLES.filter((a) => savedArticleIds.includes(a.id));
  }, [savedArticleIds]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans">
      {/* Editorial Announcement Banner */}
      <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-stone-300">
              Volume IV · Issue 10 · 10 Complete Peer-Reviewed Investigations
            </span>
          </div>
          <a
            href="/calculators"
            onClick={(e) => {
              e.preventDefault();
              handleOpenCalculator();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors cursor-pointer text-[11px]"
          >
            <Calculator className="w-3 h-3 text-amber-400" />
            <span>Open Bioenergetics &amp; Protein Calculator</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <Navbar
        currentView={activeArticle ? 'article' : 'home'}
        onNavigateHome={handleNavigateHome}
        onOpenCalculator={handleOpenCalculator}
        onSelectCategory={handleSelectCategory}
        savedCount={savedArticleIds.length}
        onOpenSaved={handleOpenSaved}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (activeArticle && q) handleNavigateHome();
        }}
      />

      {/* Main Body: Article View OR Homepage View */}
      <main className="flex-1">
        {activeArticle ? (
          <div className="pt-6">
            <ArticleView
              article={activeArticle}
              allArticles={ARTICLES}
              onBack={handleNavigateHome}
              onSelectArticle={handleSelectArticle}
              isBookmarked={savedArticleIds.includes(activeArticle.id)}
              onToggleBookmark={toggleBookmark}
            />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
            {/* If searching or filtering, show clear status header */}
            {searchQuery ? (
              <div className="mb-8 p-4 bg-white border border-stone-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-stone-700">
                  <Search className="w-4 h-4 text-stone-400" />
                  <span>
                    Search results for &ldquo;<strong>{searchQuery}</strong>&rdquo;
                  </span>
                  <span className="text-stone-400 font-mono text-xs">
                    ({filteredArticles.length} matches)
                  </span>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : selectedCategory === 'All Articles' ? (
              /* Hero Lead Article only on default homepage */
              <HeroFeatured
                article={featuredArticle}
                onReadArticle={handleSelectArticle}
                isBookmarked={savedArticleIds.includes(featuredArticle.id)}
                onToggleBookmark={toggleBookmark}
              />
            ) : null}

            {/* Department Filter Strip */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                    {selectedCategory === 'All Articles'
                      ? 'The Complete Compendium'
                      : `${selectedCategory}`}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    {selectedCategory === 'All Articles'
                      ? 'All 10 investigations covering cellular bioenergetics, progressive resistance, and restorative biology.'
                      : `Curated investigations under the ${selectedCategory} department.`}
                  </p>
                </div>
              </div>

              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                activeCount={filteredArticles.length}
              />

              {/* 10-Article Grid */}
              {filteredArticles.length === 0 ? (
                <div className="text-center py-20 bg-white border border-stone-200 rounded-xl">
                  <SlidersHorizontal className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                  <h3 className="font-serif text-lg font-bold text-stone-800">
                    No articles found matching your criteria
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Try searching for terms like &ldquo;Zone 2&rdquo;, &ldquo;protein&rdquo;, or &ldquo;hypertrophy&rdquo;.
                  </p>
                  <button
                    onClick={() => {
                      handleSelectCategory('All Articles');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredArticles.map((article, idx) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      index={idx}
                      onReadArticle={handleSelectArticle}
                      isBookmarked={savedArticleIds.includes(article.id)}
                      onToggleBookmark={toggleBookmark}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Interactive Calculator Spotlight Callout */}
            <section className="my-14 bg-gradient-to-r from-stone-100 to-amber-50/60 border border-stone-200/90 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-900 font-semibold flex items-center justify-center md:justify-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                  Interactive Physiological Protocol Tool
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Calculate Your Personal Zone 2 Floor &amp; Protein Requirements
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
                  Apply the formulas discussed in our dispatches. Calculate your exact heart rate bounds via the Tanaka/Karvonen equation and optimize your leucine distribution.
                </p>
              </div>

              <a
                href="/calculators"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenCalculator();
                }}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Launch Calculator</span>
              </a>
            </section>

            {/* Newsletter Section */}
            <NewsletterSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenCalculator={handleOpenCalculator}
      />

      {/* Fitness Tool Calculator Modal */}
      <FitnessCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={handleCloseCalculator}
      />

      {/* Saved Bookmarks Drawer */}
      <SavedArticlesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={handleCloseSaved}
        savedArticles={savedArticlesList}
        onSelectArticle={handleSelectArticle}
        onRemoveBookmark={toggleBookmark}
      />
    </div>
  );
}
