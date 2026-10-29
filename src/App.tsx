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
import { NotFoundView } from './components/NotFoundView';
import { Search, Sparkles, SlidersHorizontal, Calculator } from 'lucide-react';
import heroImage from './assets/images/hero_vital_journal_1791175996139.webp';
import { generateSchemaGraph } from './utils/schemaGenerator';

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

const HOMEPAGE_TITLE = 'Fitness and Health Tips: Evidence-Based Longevity Journal';
const HOMEPAGE_META_DESCRIPTION =
  'Explore science-backed fitness and health tips on training, cellular recovery, and longevity. Discover practical protocols designed for sustainable wellness.';

interface PageMetadataOptions {
  title: string;
  description: string;
  canonicalPath: string;
  imageUrl?: string;
  type?: 'website' | 'article';
  robots?: string;
  pageType?: 'home' | 'article' | 'category' | 'calculators' | 'saved' | 'not_found';
  article?: Article | null;
  categoryName?: string;
  categorySlug?: string;
}

export const CANONICAL_SITE_ORIGIN = 'https://fitness-and-health-blog-ten.vercel.app';

/**
 * Resolves a reliable absolute canonical URL for any route path.
 * Canonical URLs must always point to the production canonical domain
 * (https://fitness-and-health-blog-ten.vercel.app) to prevent SEO duplicate content
 * and broken link errors caused by ephemeral preview environments (*.run.app or localhost).
 */
export const getCanonicalUrl = (canonicalPath: string): string => {
  const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const normalizedPath = cleanPath === '//' ? '/' : cleanPath;

  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin;
    const isInternalPreviewOrDev =
      origin.includes('run.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('webcontainer') ||
      origin.includes('ai.google') ||
      origin.includes('google.com') ||
      !origin.startsWith('http');

    if (!isInternalPreviewOrDev) {
      return `${origin}${normalizedPath}`;
    }
  }

  return `${CANONICAL_SITE_ORIGIN}${normalizedPath}`;
};

const updatePageMetadata = ({
  title,
  description,
  canonicalPath,
  imageUrl,
  type = 'website',
  robots,
  pageType = 'home',
  article = null,
  categoryName,
  categorySlug,
}: PageMetadataOptions) => {
  // 1. Document Title
  document.title = title;

  // 2. Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // 3. Canonical Link (Dynamic Absolute Canonical URL Resolution)
  const fullCanonicalUrl = getCanonicalUrl(canonicalPath);
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', fullCanonicalUrl);

  // 4. Open Graph: Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);

  // 5. Open Graph: Description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', description);

  // 6. Open Graph: URL
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', fullCanonicalUrl);

  // 7. Open Graph: Type
  let ogType = document.querySelector('meta[property="og:type"]');
  if (!ogType) {
    ogType = document.createElement('meta');
    ogType.setAttribute('property', 'og:type');
    document.head.appendChild(ogType);
  }
  ogType.setAttribute('content', type);

  // 8. Open Graph & Twitter: Image
  const resolvedImg = imageUrl || heroImage;
  if (resolvedImg) {
    const origin =
      typeof window !== 'undefined' &&
      window.location?.origin &&
      !window.location.origin.includes('run.app') &&
      !window.location.origin.includes('localhost') &&
      !window.location.origin.includes('127.0.0.1') &&
      !window.location.origin.includes('webcontainer') &&
      window.location.origin.startsWith('http')
        ? window.location.origin
        : CANONICAL_SITE_ORIGIN;
    const fullImageUrl = resolvedImg.startsWith('http')
      ? resolvedImg
      : `${origin}${resolvedImg.startsWith('/') ? '' : '/'}${resolvedImg}`;

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', fullImageUrl);

    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.setAttribute('name', 'twitter:image');
      document.head.appendChild(twitterImage);
    }
    twitterImage.setAttribute('content', fullImageUrl);
  }

  // 9. Twitter Card: Title & Description
  let twTitle = document.querySelector('meta[name="twitter:title"]');
  if (!twTitle) {
    twTitle = document.createElement('meta');
    twTitle.setAttribute('name', 'twitter:title');
    document.head.appendChild(twTitle);
  }
  twTitle.setAttribute('content', title);

  let twDesc = document.querySelector('meta[name="twitter:description"]');
  if (!twDesc) {
    twDesc = document.createElement('meta');
    twDesc.setAttribute('name', 'twitter:description');
    document.head.appendChild(twDesc);
  }
  twDesc.setAttribute('content', description);

  // 10. Ensure Public Indexing Robots Directive is maintained
  const robotsDirective =
    robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    document.head.appendChild(robotsMeta);
  }
  robotsMeta.setAttribute('content', robotsDirective);

  // 11. Comprehensive Schema.org JSON-LD Structured Data with all website labels
  let ldJsonScript = document.querySelector('script[type="application/ld+json"]');
  if (!ldJsonScript) {
    ldJsonScript = document.createElement('script');
    ldJsonScript.setAttribute('type', 'application/ld+json');
    document.head.appendChild(ldJsonScript);
  }
  const structuredData = generateSchemaGraph({
    pageType,
    canonicalUrl: fullCanonicalUrl,
    title,
    description,
    article,
    categoryName,
    categorySlug,
    imageUrl: resolvedImg,
    articles: ARTICLES,
  });
  ldJsonScript.textContent = JSON.stringify(structuredData);
};

export default function App() {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Articles');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNotFound, setIsNotFound] = useState(false);
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

    // 301 Permanent Redirect handling: /old-home -> /
    if (clean === 'old-home') {
      window.history.replaceState({}, '', '/');
      return { type: 'home' as const };
    }

    if (!clean) {
      return { type: 'home' as const };
    }
    if (clean === 'calculators') {
      return { type: 'calculators' as const };
    }
    if (clean === 'saved') {
      return { type: 'saved' as const };
    }
    if (clean === '404') {
      return { type: 'not_found' as const };
    }
    if (CATEGORY_SLUG_MAP[clean]) {
      return { type: 'category' as const, category: CATEGORY_SLUG_MAP[clean] };
    }

    const slug = clean.startsWith('article/') ? clean.replace('article/', '') : clean;
    const found = ARTICLES.find((a) => a.slug === slug || a.id === slug);
    if (found) {
      return { type: 'article' as const, article: found };
    }

    return { type: 'not_found' as const };
  }, []);

  // Sync state from current URL path
  const applyCurrentRoute = useCallback(() => {
    const route = resolveRoute(window.location.pathname);

    if (route.type === 'not_found') {
      setIsNotFound(true);
      setActiveArticleId(null);
      setIsCalculatorOpen(false);
      setIsSavedDrawerOpen(false);
      updatePageMetadata({
        title: 'Page Not Found (404) — Aura & Iron',
        description:
          'The requested investigation could not be located in our publication archives. Explore our latest evidence-based dispatches, categories, and bioenergetics calculators.',
        canonicalPath: '/404',
        imageUrl: heroImage,
        type: 'website',
        pageType: 'not_found',
        robots: 'noindex, follow',
      });
    } else if (route.type === 'article' && route.article) {
      setIsNotFound(false);
      setActiveArticleId(route.article.id);
      setIsCalculatorOpen(false);
      setIsSavedDrawerOpen(false);
      updatePageMetadata({
        title: route.article.seoTitle || `${route.article.title} — Aura & Iron`,
        description: route.article.metaDescription || HOMEPAGE_META_DESCRIPTION,
        canonicalPath: `/${route.article.slug}`,
        imageUrl: route.article.coverImage,
        type: 'article',
        pageType: 'article',
        article: route.article,
      });
    } else if (route.type === 'category' && route.category) {
      setIsNotFound(false);
      setActiveArticleId(null);
      setSelectedCategory(route.category);
      setIsCalculatorOpen(false);
      setIsSavedDrawerOpen(false);
      const catSlug = CATEGORY_TO_SLUG_MAP[route.category] || '';
      updatePageMetadata({
        title: `${route.category} — Aura & Iron`,
        description: HOMEPAGE_META_DESCRIPTION,
        canonicalPath: catSlug ? `/${catSlug}` : '/',
        imageUrl: heroImage,
        type: 'website',
        pageType: 'category',
        categoryName: route.category,
        categorySlug: catSlug,
      });
    } else if (route.type === 'calculators') {
      setIsNotFound(false);
      setIsCalculatorOpen(true);
      setIsSavedDrawerOpen(false);
      updatePageMetadata({
        title: `Bioenergetics & Protein Calculator — Aura & Iron`,
        description: HOMEPAGE_META_DESCRIPTION,
        canonicalPath: '/calculators',
        imageUrl: heroImage,
        type: 'website',
        pageType: 'calculators',
      });
    } else if (route.type === 'saved') {
      setIsNotFound(false);
      setIsSavedDrawerOpen(true);
      setIsCalculatorOpen(false);
      updatePageMetadata({
        title: `Saved Investigations Archive — Aura & Iron`,
        description: HOMEPAGE_META_DESCRIPTION,
        canonicalPath: '/saved',
        imageUrl: heroImage,
        type: 'website',
        pageType: 'saved',
      });
    } else {
      setIsNotFound(false);
      setActiveArticleId(null);
      setSelectedCategory('All Articles');
      setIsCalculatorOpen(false);
      setIsSavedDrawerOpen(false);
      updatePageMetadata({
        title: HOMEPAGE_TITLE,
        description: HOMEPAGE_META_DESCRIPTION,
        canonicalPath: '/',
        imageUrl: heroImage,
        type: 'website',
        pageType: 'home',
      });
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
    setIsNotFound(false);
    setActiveArticleId(article.id);
    setIsCalculatorOpen(false);
    setIsSavedDrawerOpen(false);
    updatePageMetadata({
      title: article.seoTitle || `${article.title} — Aura & Iron`,
      description: article.metaDescription || HOMEPAGE_META_DESCRIPTION,
      canonicalPath: `/${article.slug}`,
      imageUrl: article.coverImage,
      type: 'article',
      pageType: 'article',
      article,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setIsNotFound(false);
    setActiveArticleId(null);
    setSelectedCategory('All Articles');
    setSearchQuery('');
    setIsCalculatorOpen(false);
    setIsSavedDrawerOpen(false);
    updatePageMetadata({
      title: HOMEPAGE_TITLE,
      description: HOMEPAGE_META_DESCRIPTION,
      canonicalPath: '/',
      imageUrl: heroImage,
      type: 'website',
      pageType: 'home',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (category: string) => {
    const slug = CATEGORY_TO_SLUG_MAP[category];
    const newPath = slug ? `/${slug}` : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
    setIsNotFound(false);
    setActiveArticleId(null);
    setSelectedCategory(category);
    setIsCalculatorOpen(false);
    setIsSavedDrawerOpen(false);
    updatePageMetadata({
      title: `${category} — Aura & Iron`,
      description: HOMEPAGE_META_DESCRIPTION,
      canonicalPath: slug ? `/${slug}` : '/',
      imageUrl: heroImage,
      type: 'website',
      pageType: 'category',
      categoryName: category,
      categorySlug: slug,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCalculator = () => {
    if (window.location.pathname !== '/calculators') {
      window.history.pushState({}, '', '/calculators');
    }
    setIsNotFound(false);
    setIsCalculatorOpen(true);
    setIsSavedDrawerOpen(false);
    updatePageMetadata({
      title: `Bioenergetics & Protein Calculator — Aura & Iron`,
      description: HOMEPAGE_META_DESCRIPTION,
      canonicalPath: '/calculators',
      imageUrl: heroImage,
      type: 'website',
      pageType: 'calculators',
    });
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
      applyCurrentRoute();
    }
  };

  const handleOpenSaved = () => {
    if (window.location.pathname !== '/saved') {
      window.history.pushState({}, '', '/saved');
    }
    setIsNotFound(false);
    setIsSavedDrawerOpen(true);
    setIsCalculatorOpen(false);
    updatePageMetadata({
      title: `Saved Investigations Archive — Aura & Iron`,
      description: HOMEPAGE_META_DESCRIPTION,
      canonicalPath: '/saved',
      imageUrl: heroImage,
      type: 'website',
      pageType: 'saved',
    });
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
      applyCurrentRoute();
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

      {/* Main Body: 404 View OR Article View OR Homepage View */}
      <main className="flex-1">
        {isNotFound ? (
          <NotFoundView
            onNavigateHome={handleNavigateHome}
            onSelectCategory={handleSelectCategory}
            onOpenCalculator={handleOpenCalculator}
            onReadArticle={handleSelectArticle}
            popularArticles={ARTICLES}
          />
        ) : activeArticle ? (
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
                      ? 'What Are the Evidence-Based Foundations of Human Longevity & Fitness?'
                      : `What Science-Backed Protocols Define ${selectedCategory}?`}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    {selectedCategory === 'All Articles'
                      ? 'To sustain lifelong functional capacity, peer-reviewed clinical research demonstrates that integrating low-intensity Zone 2 endurance, progressive resistance training, circadian photic entrainment, and targeted protein pacing maximizes mitochondrial biogenesis, preserves lean skeletal muscle, and mitigates all-cause mortality risk.'
                      : `Under the ${selectedCategory} department, clinical trials and biomechanical studies demonstrate that targeted stimulus progression, adequate physiological volume, and disciplined recovery optimize long-term healthspan and athletic performance.`}
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
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  How Do You Calculate Your Target Zone 2 Heart Rate and Daily Protein Needs?
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
                  You can calculate your ideal Zone 2 aerobic threshold by combining the Tanaka formula (208 − 0.7 × age) with your resting heart rate via the Karvonen heart rate reserve method to identify your peak lipid-oxidation zone, while targeting 1.6 to 2.2 grams of protein per kilogram of body weight distributed across three to four daily meals to stimulate muscle protein synthesis.
                </p>
              </div>

              <a
                href="/calculators"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenCalculator();
                }}
                aria-label="Launch interactive Zone 2 heart rate and protein intake calculator"
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Launch Bioenergetics Calculator</span>
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
