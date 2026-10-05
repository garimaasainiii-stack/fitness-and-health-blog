import React from 'react';
import { Article } from '../types/blog';
import { X, Bookmark, ArrowRight, Trash2 } from 'lucide-react';

interface SavedArticlesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (id: string) => void;
}

export const SavedArticlesDrawer: React.FC<SavedArticlesDrawerProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/40 backdrop-blur-2xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FAF8F5] border-l border-stone-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-stone-900" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Saved Investigations ({savedArticles.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedArticles.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-4">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-semibold text-stone-800 mb-1">
                No Bookmarked Articles
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Click the bookmark icon on any dispatch to curate your reading archive for offline reference.
              </p>
            </div>
          ) : (
            savedArticles.map((article) => (
              <div
                key={article.id}
                className="group bg-white border border-stone-200 rounded-xl p-4 transition-all hover:border-stone-400 hover:shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="cursor-pointer flex-1"
                  >
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-800 block mb-1">
                      {article.category} · {article.readTime}
                    </span>
                    <h5 className="font-serif text-sm font-bold text-stone-900 group-hover:text-amber-900 leading-snug line-clamp-2">
                      {article.title}
                    </h5>
                    <p className="text-xs text-stone-500 mt-2 font-mono">
                      By {article.author.name}
                    </p>
                  </div>

                  <button
                    onClick={() => onRemoveBookmark(article.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 flex justify-end">
                  <button
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedArticles.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-white text-center">
            <p className="text-[11px] text-stone-400">
              Saved articles are preserved locally in your browser storage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
