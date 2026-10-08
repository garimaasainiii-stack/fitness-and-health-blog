import React from 'react';
import { Article } from '../types/blog';
import { ArrowRight, Bookmark } from 'lucide-react';

interface HeroFeaturedProps {
  article: Article;
  onReadArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  article,
  onReadArticle,
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <section className="mb-14 lg:mb-18 border-b border-stone-200 pb-12 lg:pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Visual Asset (7 cols) */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div
            onClick={() => onReadArticle(article)}
            className="group relative aspect-16/10 sm:aspect-16/9 overflow-hidden rounded-xl bg-stone-100 cursor-pointer border border-stone-200/80 shadow-xs"
          >
            <img
              src={article.coverImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
              onError={(e) => {
                // Zero broken image fallback: replace with fallback style container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Ambient image vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-stone-200">
              <span className="font-sans font-light tracking-wide text-[11px] drop-shadow-xs">
                Featured Lead Investigation
              </span>
              <span className="font-mono text-[11px] tabular-nums drop-shadow-xs">
                {article.wordCount} words
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Lead Editorial Content (5 cols) */}
        <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-center">
          {/* Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-3 tracking-wide">
            <span className="text-amber-800 uppercase tracking-widest text-[11px] font-semibold">
              {article.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>

          {/* Balanced Display Headline */}
          <h1
            className="font-serif text-3xl sm:text-4xl xl:text-[2.65rem] font-bold text-stone-900 leading-[1.18] tracking-tight mb-4"
            style={{ textWrap: 'balance' }}
          >
            <a
              href={`/${article.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onReadArticle(article);
              }}
              className="hover:text-stone-700 transition-colors"
            >
              {article.title}
            </a>
          </h1>

          {/* Deck / Excerpt */}
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
            {article.leadParagraph}
          </p>

          {/* Author Byline & Action */}
          <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-10 h-10 rounded-full object-cover border border-stone-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <p className="text-xs font-semibold text-stone-900">
                  {article.author.name}
                </p>
                <p className="text-[11px] text-stone-500 truncate max-w-44 sm:max-w-64">
                  {article.author.credentials}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(article.id);
                }}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark for later'}
                aria-label="Bookmark article"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <a
                href={`/${article.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onReadArticle(article);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
