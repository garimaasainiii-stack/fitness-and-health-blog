export interface Author {
  name: string;
  role: string;
  avatar: string;
  credentials: string;
  bio: string;
}

export interface SectionCallout {
  title: string;
  text: string;
  source?: string;
}

export interface DataMetric {
  label: string;
  value: string;
  context: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
  callout?: SectionCallout;
  metric?: DataMetric;
  bulletPoints?: string[];
}

export interface PullQuote {
  quote: string;
  author: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Strength & Training' | 'Cardio & Endurance' | 'Recovery & Sleep' | 'Nutrition & Fuel' | 'Longevity & Science' | 'Mental Resilience';
  author: Author;
  publishedAt: string;
  readTime: string;
  wordCount: number;
  coverImage: string;
  fallbackGradient: string;
  isFeatured?: boolean;
  leadParagraph: string;
  takeaways: string[];
  sections: ArticleSection[];
  pullQuote: PullQuote;
  conclusion: string;
  actionChecklist: string[];
  tags: string[];
  initialLikes: number;
}
