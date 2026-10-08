import React, { useState, useEffect } from 'react';
import { Article } from '../types/blog';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Heart,
  Check,
  CheckCircle2,
  ListOrdered,
  BookOpen,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';

interface ArticleViewProps {
  article: Article;
  allArticles: Article[];
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  allArticles,
  onBack,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [likes, setLikes] = useState(article.initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const currentProgress = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on article change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLikes(article.initialLikes);
    setHasLiked(false);
  }, [article.id]);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '/' + article.slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  // Get related articles in same or adjacent categories
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg leading-relaxed';
      case 'xlarge':
        return 'text-xl leading-loose';
      default:
        return 'text-base sm:text-lg leading-relaxed';
    }
  };

  return (
    <article className="min-h-screen pb-20">
      {/* Reading Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-1 bg-amber-800 z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Article Utility Bar */}
      <div className="sticky top-18 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 py-3 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Journal Index</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center gap-1 border border-stone-200 bg-white rounded-lg p-1 text-xs text-stone-600">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  fontSize === 'normal' ? 'bg-stone-900 text-white font-medium' : 'hover:bg-stone-100'
                }`}
                title="Normal text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded text-sm cursor-pointer ${
                  fontSize === 'large' ? 'bg-stone-900 text-white font-medium' : 'hover:bg-stone-100'
                }`}
                title="Large text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-0.5 rounded text-base cursor-pointer ${
                  fontSize === 'xlarge' ? 'bg-stone-900 text-white font-medium' : 'hover:bg-stone-100'
                }`}
                title="Extra large text size"
              >
                A++
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Share article link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Reading Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Unboxed Metadata (Strict Zero-Pill) */}
        <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-4 tracking-wide">
          <span className="text-amber-800 uppercase tracking-widest text-[11px] font-semibold">
            {article.category}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-stone-400" />
            <span>{article.publishedAt}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>{article.readTime}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-stone-400 tabular-nums">
            {article.wordCount} words
          </span>
        </div>

        {/* Article Headline */}
        <h1
          className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-stone-900 leading-[1.14] tracking-tight mb-6"
          style={{ textWrap: 'balance' }}
        >
          {article.title}
        </h1>

        {/* Subtitle / Deck */}
        <p className="text-stone-600 text-lg sm:text-xl font-light leading-relaxed mb-8">
          {article.subtitle}
        </p>

        {/* Author Byline Box */}
        <div className="py-4 border-y border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover border border-stone-300"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <h4 className="text-sm font-semibold text-stone-900">
                {article.author.name}
              </h4>
              <p className="text-xs text-stone-500">
                {article.author.credentials}
              </p>
              <p className="text-[11px] text-stone-400">
                {article.author.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                hasLiked
                  ? 'border-rose-300 bg-rose-50 text-rose-700'
                  : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600 text-rose-600' : 'text-stone-400'}`} />
              <span className="font-mono tabular-nums">{likes} Resonances</span>
            </button>
          </div>
        </div>

        {/* Cover Image Presentation */}
        <figure className="mb-10">
          <div className="aspect-16/9 w-full overflow-hidden rounded-xl bg-stone-100 border border-stone-200">
            <img
              src={article.coverImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <figcaption className="text-xs font-serif text-stone-500 italic mt-2.5 text-center">
            Figure 1: Cellular and biomechanical dynamics of human performance adaptation.
          </figcaption>
        </figure>

        {/* Layout: Sidebar ToC (Desktop) + Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Table of Contents Column (3 cols on large) */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-32 space-y-6">
              {/* Navigation Anchors */}
              <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100">
                  <ListOrdered className="w-3.5 h-3.5 text-stone-500" />
                  <span>Contents</span>
                </div>
                <nav className="space-y-2 text-xs">
                  <button
                    onClick={() => scrollToSection('introduction')}
                    className="block w-full text-left text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                  >
                    01. Introduction
                  </button>
                  {article.sections.map((sec, idx) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className="block w-full text-left text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                    >
                      {String(idx + 2).padStart(2, '0')}. {sec.heading}
                    </button>
                  ))}
                  <button
                    onClick={() => scrollToSection('protocol-checklist')}
                    className="block w-full text-left text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                  >
                    {String(article.sections.length + 2).padStart(2, '0')}. Protocol Checklist
                  </button>
                  <button
                    onClick={() => scrollToSection('conclusion')}
                    className="block w-full text-left text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                  >
                    {String(article.sections.length + 3).padStart(2, '0')}. Conclusion
                  </button>
                </nav>
              </div>

              {/* Tags Cloud */}
              <div className="bg-white border border-stone-200/90 rounded-xl p-5">
                <p className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">
                  Index Keywords
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Body Prose (8 cols on large) */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            {/* Executive Key Takeaways Box */}
            <div className="bg-stone-100/70 border-l-3 border-amber-800 rounded-r-xl p-5 sm:p-6 mb-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                <span>Executive Summary &amp; Core Findings</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                {article.takeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="font-mono text-amber-800 font-semibold text-xs mt-0.5 shrink-0">
                      0{i + 1}.
                    </span>
                    <span className="leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Introduction with Drop Cap */}
            <div id="introduction" className="mb-10 scroll-mt-28">
              <p
                className={`${getFontSizeClass()} text-stone-800 font-sans first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-900 first-letter:leading-none`}
              >
                {article.leadParagraph}
              </p>
            </div>

            {/* Article Sections */}
            <div className="space-y-12">
              {article.sections.map((section, idx) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 border-t border-stone-200/80 pt-8"
                >
                  {/* Clean natural editorial numbering */}
                  <span className="font-mono text-xs text-stone-400 font-medium block mb-1">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-5">
                    {section.heading}
                  </h2>

                  <div className="space-y-5">
                    {section.paragraphs.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        className={`${getFontSizeClass()} text-stone-700 leading-relaxed font-sans`}
                      >
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Bullet points if present */}
                  {section.bulletPoints && (
                    <ul className="mt-5 space-y-2 text-stone-700 text-sm sm:text-base pl-2 border-l-2 border-stone-200">
                      {section.bulletPoints.map((bp, bpIdx) => (
                        <li key={bpIdx} className="flex items-start gap-2">
                          <span className="text-amber-800 font-bold shrink-0">·</span>
                          <span className="leading-relaxed">{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Scientific Callout Box if present */}
                  {section.callout && (
                    <aside className="my-7 bg-white border border-stone-200/90 rounded-lg p-5 shadow-2xs">
                      <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 uppercase tracking-wide mb-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-stone-600" />
                        <span>{section.callout.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-2 font-sans">
                        {section.callout.text}
                      </p>
                      {section.callout.source && (
                        <p className="text-[11px] font-mono text-stone-400 italic">
                          Reference: {section.callout.source}
                        </p>
                      )}
                    </aside>
                  )}

                  {/* Metric Box if present */}
                  {section.metric && (
                    <div className="my-6 bg-stone-50 border border-stone-200 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs uppercase font-medium text-stone-500 block">
                          {section.metric.label}
                        </span>
                        <span className="text-xs text-stone-600 block mt-0.5">
                          {section.metric.context}
                        </span>
                      </div>
                      <div className="font-mono text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                        {section.metric.value}
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Stylized Editorial Pull Quote */}
            <div className="my-14 py-8 border-y-2 border-stone-900/10 text-center">
              <blockquote className="font-serif italic text-2xl sm:text-3xl text-stone-900 leading-relaxed max-w-xl mx-auto mb-3">
                &ldquo;{article.pullQuote.quote}&rdquo;
              </blockquote>
              <cite className="block text-xs uppercase tracking-widest text-stone-500 font-sans not-italic">
                — {article.pullQuote.author}
              </cite>
            </div>

            {/* Practical Action Checklist */}
            <div id="protocol-checklist" className="scroll-mt-28 bg-white border border-stone-200 rounded-xl p-6 sm:p-7 mb-12 shadow-2xs">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Actionable Implementation Protocol</span>
              </div>
              <div className="space-y-3">
                {article.actionChecklist.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-medium flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conclusion */}
            <section id="conclusion" className="scroll-mt-28 border-t border-stone-200 pt-8 mb-12">
              <span className="font-mono text-xs text-stone-400 font-medium block mb-1">
                SUMMARY
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-4">
                Conclusion
              </h2>
              <p className={`${getFontSizeClass()} text-stone-700 leading-relaxed font-sans`}>
                {article.conclusion}
              </p>
            </section>

            {/* Author Extended Profile */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 mb-12 flex flex-col sm:flex-row items-start gap-4">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-14 h-14 rounded-full object-cover border border-stone-300 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <h4 className="text-base font-semibold text-stone-900">
                  Written by {article.author.name}
                </h4>
                <p className="text-xs text-stone-500 font-medium mb-2">
                  {article.author.credentials} · {article.author.role}
                </p>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {article.author.bio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles Strip */}
        <div className="mt-16 pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Related Investigations
            </h3>
            <button
              onClick={onBack}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            >
              Browse all 10 dispatches →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectArticle(rel)}
                className="group bg-white border border-stone-200 rounded-lg p-4 cursor-pointer hover:border-stone-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/10 rounded-md overflow-hidden bg-stone-100 mb-3">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium mb-1">
                    {rel.category} · {rel.readTime}
                  </div>
                  <h4 className="font-serif text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
                <p className="text-xs text-stone-500 mt-3 pt-3 border-t border-stone-100">
                  By {rel.author.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
