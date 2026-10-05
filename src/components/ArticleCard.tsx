import React from 'react';
import { Article } from '../types/blog';
import { Bookmark, Clock, ArrowUpRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onReadArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  index: number;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onReadArticle,
  isBookmarked,
  onToggleBookmark,
  index,
}) => {
  return (
    <article className="group flex flex-col justify-between bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 transition-all duration-300 hover:border-stone-400 hover:shadow-xs">
      <div>
        {/* Cover Thumbnail with Zero Broken Image Fallback */}
        <div
          onClick={() => onReadArticle(article)}
          className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-stone-100 mb-5 cursor-pointer"
        >
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Subtle gradient fallback in case image is missing */}
          <div className="absolute inset-0 bg-stone-900/5 pointer-events-none" />

          {/* Editorial index marker */}
          <span className="absolute top-3 left-3 font-mono text-[11px] tabular-nums font-medium text-stone-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-sm border border-stone-200/60 shadow-2xs">
            {String(index + 1).padStart(2, '0')}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(article.id);
            }}
            className={`absolute top-3 right-3 p-1.5 rounded-md backdrop-blur-xs transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-stone-900 text-white'
                : 'bg-white/85 text-stone-600 hover:bg-white hover:text-stone-900'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            aria-label="Bookmark article"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Unboxed Metadata with Typographic Separators (Strict Zero-Pill) */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 font-medium">
          <span className="text-amber-800 uppercase tracking-wider text-[11px] font-semibold">
            {article.category}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>{article.readTime}</span>
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onReadArticle(article)}
          className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-snug tracking-tight group-hover:text-stone-700 transition-colors cursor-pointer mb-3"
          style={{ textWrap: 'balance' }}
        >
          {article.title}
        </h3>

        {/* Subtitle / Excerpt */}
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2 mb-6">
          {article.subtitle}
        </p>
      </div>

      {/* Footer: Author & Read CTA */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2.5">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-7 h-7 rounded-full object-cover border border-stone-200"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="leading-tight">
            <span className="block text-xs font-medium text-stone-800">
              {article.author.name}
            </span>
            <span className="block text-[10px] text-stone-400">
              {article.publishedAt}
            </span>
          </div>
        </div>

        <button
          onClick={() => onReadArticle(article)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 group-hover:text-amber-800 transition-colors cursor-pointer"
        >
          <span>Read</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </article>
  );
};
