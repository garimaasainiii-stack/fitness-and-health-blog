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
  Sparkles,
  ArrowRight,
  ArrowUpRight
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

  // Curated internal links between scientifically related articles
  const RELATED_ARTICLES_MAP: Record<string, string[]> = {
    'zone-2-cardio': ['vo2-max', 'sleep-architecture', 'intermittent-fasting'],
    'hypertrophy-science': ['protein-pacing', 'functional-mobility', 'cold-plunge-protocol'],
    'sleep-architecture': ['cortisol-stress-relief', 'cold-plunge-protocol', 'intermittent-fasting'],
    'protein-pacing': ['hypertrophy-science', 'gut-microbiome', 'intermittent-fasting'],
    'cold-plunge-protocol': ['sleep-architecture', 'cortisol-stress-relief', 'hypertrophy-science'],
    'gut-microbiome': ['protein-pacing', 'cortisol-stress-relief', 'intermittent-fasting'],
    'functional-mobility': ['hypertrophy-science', 'zone-2-cardio', 'cold-plunge-protocol'],
    'cortisol-stress-relief': ['sleep-architecture', 'cold-plunge-protocol', 'gut-microbiome'],
    'intermittent-fasting': ['protein-pacing', 'zone-2-cardio', 'gut-microbiome'],
    'vo2-max': ['zone-2-cardio', 'hypertrophy-science', 'sleep-architecture'],
  };

  // Get curated related articles with fallback to same or adjacent categories
  const relatedArticles = React.useMemo(() => {
    const relatedIds = RELATED_ARTICLES_MAP[article.id] || RELATED_ARTICLES_MAP[article.slug] || [];
    const matched = relatedIds
      .map((id) => allArticles.find((a) => a.id === id || a.slug === id))
      .filter((a): a is Article => Boolean(a));
    if (matched.length >= 3) return matched.slice(0, 3);
    const fallbacks = allArticles.filter(
      (a) => a.id !== article.id && !matched.some((m) => m.id === a.id)
    );
    return [...matched, ...fallbacks].slice(0, 3);
  }, [article.id, article.slug, allArticles]);

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
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
            aria-label="Return to Journal Index"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Journal Index</span>
          </a>

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
              alt={`Portrait of ${article.author.name}`}
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
              alt={article.coverImageAlt || article.title}
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
                <nav className="space-y-2 text-xs" aria-label="Table of contents">
                  <a
                    href="#introduction"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('introduction');
                    }}
                    className="block w-full text-left text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                  >
                    01. Introduction
                  </a>
                  {article.sections.map((sec, idx) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(sec.id);
                      }}
                      className="block w-full text-left text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                    >
                      {String(idx + 2).padStart(2, '0')}. {sec.heading}
                    </a>
                  ))}
                  <a
                    href="#protocol-checklist"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('protocol-checklist');
                    }}
                    className="block w-full text-left text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                  >
                    {String(article.sections.length + 2).padStart(2, '0')}. Protocol Checklist
                  </a>
                  <a
                    href="#conclusion"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('conclusion');
                    }}
                    className="block w-full text-left text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                  >
                    {String(article.sections.length + 3).padStart(2, '0')}. Conclusion
                  </a>
                </nav>
              </div>

              {/* Related Internal Dispatches */}
              <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-2xs">
                <p className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">
                  Related Dispatches
                </p>
                <nav className="space-y-3" aria-label="Related internal articles">
                  {relatedArticles.map((rel) => (
                    <a
                      key={rel.id}
                      href={`/${rel.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectArticle(rel);
                      }}
                      aria-label={`Read related dispatch: ${rel.title}`}
                      className="group block text-xs"
                    >
                      <span className="text-[10px] font-mono text-amber-800 uppercase font-semibold block mb-0.5">
                        {rel.category}
                      </span>
                      <span className="font-serif font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </span>
                    </a>
                  ))}
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
                        <div className="text-[11px] font-mono text-stone-400 italic flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                          <span>Reference: {section.callout.source}</span>
                          <a
                            href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(section.callout.source)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View indexed peer-reviewed source for ${section.callout.title} on PubMed`}
                            className="text-amber-800 hover:text-amber-950 font-sans font-medium text-[11px] inline-flex items-center gap-1 transition-colors not-italic"
                          >
                            <span>PubMed Citation</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
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

            {/* Contextual Internal Article Cross-References */}
            <div className="my-10 bg-stone-50 border border-stone-200 rounded-xl p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                <span>Cross-Referenced Physiological Investigations</span>
              </div>
              <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                Deepen your understanding of these mechanisms with closely related dispatches from our research compendium:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedArticles.slice(0, 2).map((rel) => (
                  <a
                    key={rel.id}
                    href={`/${rel.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectArticle(rel);
                    }}
                    aria-label={`Read cross-referenced companion dispatch: ${rel.title}`}
                    className="p-3 bg-white border border-stone-200/80 rounded-lg hover:border-stone-400 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-amber-800 uppercase font-semibold block mb-1">
                        {rel.category} · {rel.readTime}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 group-hover:text-amber-800 transition-colors mt-2">
                      <span>Read companion dispatch</span>
                      <span className="sr-only">: {rel.title}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Conclusion */}
            <section id="conclusion" className="scroll-mt-28 border-t border-stone-200 pt-8 mb-12">
              <span className="font-mono text-xs text-stone-400 font-medium block mb-1">
                SUMMARY
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-4">
                What Is the Core Takeaway for Long-Term Healthspan?
              </h2>
              <p className={`${getFontSizeClass()} text-stone-700 leading-relaxed font-sans`}>
                {article.conclusion}
              </p>
            </section>

            {/* Author Extended Profile */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 mb-12 flex flex-col sm:flex-row items-start gap-4">
              <img
                src={article.author.avatar}
                alt={`Portrait of ${article.author.name}`}
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
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
              aria-label="Browse all 10 published investigations"
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            >
              Browse all 10 dispatches →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <a
                key={rel.id}
                href={`/${rel.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectArticle(rel);
                }}
                aria-label={`Read related investigation: ${rel.title}`}
                className="group bg-white border border-stone-200 rounded-lg p-4 cursor-pointer hover:border-stone-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/10 rounded-md overflow-hidden bg-stone-100 mb-3">
                    <img
                      src={rel.coverImage}
                      alt={rel.coverImageAlt || rel.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
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
                <div className="text-xs text-stone-500 mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span>By {rel.author.name}</span>
                  <span className="font-semibold text-stone-800 group-hover:text-amber-800 transition-colors inline-flex items-center gap-1 text-[11px]">
                    <span>Read Article</span>
                    <span className="sr-only">: {rel.title}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
