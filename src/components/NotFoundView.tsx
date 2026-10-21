import React from 'react';
import { Home, Calculator, ArrowRight, Compass, BookOpen, Search } from 'lucide-react';
import { Article } from '../types/blog';

interface NotFoundViewProps {
  onNavigateHome: () => void;
  onSelectCategory: (category: string) => void;
  onOpenCalculator: () => void;
  onReadArticle: (article: Article) => void;
  popularArticles: Article[];
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  onNavigateHome,
  onSelectCategory,
  onOpenCalculator,
  onReadArticle,
  popularArticles,
}) => {
  const departments = [
    { name: 'Strength & Training', slug: 'strength', count: 'Progressive Overload' },
    { name: 'Cardio & Endurance', slug: 'cardio', count: 'Zone 2 & VO₂ Max' },
    { name: 'Recovery & Sleep', slug: 'recovery', count: 'Circadian Architecture' },
    { name: 'Nutrition & Fuel', slug: 'nutrition', count: 'Protein Pacing & Gut' },
    { name: 'Longevity & Science', slug: 'longevity', count: 'Autophagy & Fasting' },
    { name: 'Mental Resilience', slug: 'resilience', count: 'Cortisol & Cold Plunge' },
  ];

  return (
    <div className="min-h-[75vh] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* 404 Hero Section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-600/20 text-amber-900 text-xs font-mono font-medium tracking-wide uppercase mb-6">
          <Compass className="w-3.5 h-3.5 text-amber-800" />
          <span>Error 404 · Archival Miss</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight mb-4 leading-tight">
          Investigation Not Found
        </h1>

        <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-8">
          The requested dispatch may have been relocated, retitled, or the URL might contain a typo.
          Our clinical and physiological archives remain fully accessible through the departments below.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 text-white text-xs font-medium tracking-wide hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Latest Dispatches</span>
          </a>

          <a
            href="/calculators"
            onClick={(e) => {
              e.preventDefault();
              onOpenCalculator();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-stone-200 text-stone-800 text-xs font-medium tracking-wide hover:border-stone-400 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-amber-800" />
            <span>Bioenergetics Calculators</span>
          </a>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="mb-16">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3 mb-6">
          <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 font-semibold flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-stone-400" />
            <span>Browse Journal Departments</span>
          </h2>
          <span className="text-[11px] text-stone-400 font-mono">6 Disciplines</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {departments.map((dept) => (
            <a
              key={dept.slug}
              href={`/${dept.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory(dept.name);
              }}
              className="group p-4 bg-white border border-stone-200/90 rounded-xl hover:border-amber-700/50 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer"
            >
              <div>
                <h3 className="font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors text-sm">
                  {dept.name}
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">{dept.count}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all" />
            </a>
          ))}
        </div>
      </div>

      {/* Recommended Core Investigations */}
      {popularArticles.length > 0 && (
        <div>
          <div className="flex items-center justify-between border-b border-stone-200/80 pb-3 mb-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 font-semibold flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <span>Recommended Investigations</span>
            </h2>
            <span className="text-[11px] text-stone-400 font-mono">Peer-Reviewed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {popularArticles.slice(0, 3).map((art) => (
              <a
                key={art.id}
                href={`/${art.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onReadArticle(art);
                }}
                className="group bg-white border border-stone-200/90 rounded-xl p-4 flex flex-col justify-between hover:border-stone-400 hover:shadow-xs transition-all cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase font-semibold text-amber-800 block mb-1">
                    {art.category} · {art.readTime}
                  </span>
                  <h3 className="font-serif text-sm font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>{art.author.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
