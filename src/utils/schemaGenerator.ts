import { Article } from '../types/blog';

export const CANONICAL_SITE_ORIGIN = 'https://fitness-and-health-blog-ten.vercel.app';

export interface DepartmentLabel {
  name: string;
  slug: string;
  description: string;
  keywords: string[];
}

export const DEPARTMENT_LABELS: DepartmentLabel[] = [
  {
    name: 'Strength & Training',
    slug: 'strength',
    description: 'Evidence-based protocols for progressive overload, muscle hypertrophy mechanics, and joint resilience.',
    keywords: ['Strength', 'Hypertrophy', 'Biomechanics', 'Resistance Training', 'Mobility'],
  },
  {
    name: 'Cardio & Endurance',
    slug: 'cardio',
    description: 'Physiological frameworks for Zone 2 aerobic base building, mitochondrial biogenesis, and VO₂ max.',
    keywords: ['Cardio', 'Zone 2', 'Mitochondria', 'Endurance', 'VO2 Max', 'Aerobic Base'],
  },
  {
    name: 'Recovery & Sleep',
    slug: 'recovery',
    description: 'Neurobiological research on circadian rhythm alignment, sleep architecture, and autonomic recovery.',
    keywords: ['Sleep', 'Circadian Biology', 'Recovery', 'Cold Plunge', 'Hormesis', 'Dopamine'],
  },
  {
    name: 'Nutrition & Fuel',
    slug: 'nutrition',
    description: 'Nutritional biochemistry covering protein pacing, leucine thresholds, and gut microbiome biodiversity.',
    keywords: ['Nutrition', 'Protein', 'Muscle Protein Synthesis', 'Microbiome', 'Gut Health', 'Dietary Science'],
  },
  {
    name: 'Longevity & Science',
    slug: 'longevity',
    description: 'Clinical insights on cellular autophagy, metabolic flexibility, and cardiorespiratory healthspan prediction.',
    keywords: ['Longevity', 'Autophagy', 'Fasting', 'Metabolism', 'VO2 Max', 'Clinical Science'],
  },
  {
    name: 'Mental Resilience',
    slug: 'resilience',
    description: 'Autonomic nervous regulation, cortisol downregulation protocols, and heart rate variability (HRV).',
    keywords: ['Mental Resilience', 'Stress', 'Cortisol', 'HRV', 'Breathwork', 'Vagus Nerve'],
  },
];

export const UTILITY_LABELS = [
  {
    name: 'Bioenergetics & Protein Calculator',
    slug: 'calculators',
    description: 'Interactive clinical tools to calculate personalized Zone 2 heart rate zones and daily optimal protein distribution.',
  },
  {
    name: 'Saved Investigations Archive',
    slug: 'saved',
    description: 'Personal reader archive of saved peer-reviewed health and fitness dispatches.',
  },
];

export interface SchemaGeneratorOptions {
  pageType: 'home' | 'article' | 'category' | 'calculators' | 'saved' | 'not_found';
  canonicalUrl: string;
  title: string;
  description: string;
  article?: Article | null;
  categoryName?: string;
  categorySlug?: string;
  imageUrl?: string;
  articles?: Article[];
}

/**
 * Builds comprehensive Schema.org JSON-LD structured data graph incorporating:
 * 1. WebSite entity with site metadata & SearchAction
 * 2. Organization entity representing Aura & Iron
 * 3. SiteNavigationElement entities representing all navigation and department labels
 * 4. DefinedTermSet capturing all editorial topic & department taxonomy labels
 * 5. BreadcrumbList showing the hierarchical label trail
 * 6. Page-specific entities (Article with articleSection, keywords, and about labels; CollectionPage; or WebApplication)
 */
export function generateSchemaGraph(options: SchemaGeneratorOptions) {
  const {
    pageType,
    canonicalUrl,
    title,
    description,
    article,
    categoryName,
    categorySlug,
    imageUrl,
    articles = [],
  } = options;

  const baseUrl = CANONICAL_SITE_ORIGIN;
  const resolvedImage = imageUrl || `${baseUrl}/assets/hero_vital_journal_1791175996139.webp`;

  // 1. Organization Schema
  const organizationSchema = {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Aura & Iron — Health & Fitness Journal',
    url: `${baseUrl}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/favicon.svg`,
      width: 64,
      height: 64,
    },
    description:
      'Independent digital publication delivering peer-reviewed research on human physiology, exercise science, and longevity protocols.',
    publishingPrinciples: `${baseUrl}/`,
    knowsAbout: DEPARTMENT_LABELS.map((d) => d.name),
  };

  // 2. WebSite Schema
  const webSiteSchema = {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: `${baseUrl}/`,
    name: 'Aura & Iron — Health & Fitness Journal',
    alternateName: ['Aura & Iron', 'Aura and Iron Journal'],
    description:
      'Explore science-backed fitness and health tips on training, cellular recovery, and longevity. Discover practical protocols designed for sustainable wellness.',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: 'en-US',
  };

  // 3. Department Taxonomy DefinedTermSet (Exposes all 6 department labels formally)
  const taxonomySchema = {
    '@type': 'DefinedTermSet',
    '@id': `${baseUrl}/#taxonomy`,
    name: 'Aura & Iron Journal Department Labels',
    description: 'Core editorial departments and scientific taxonomy labels for sports physiology, nutrition, and longevity.',
    hasDefinedTerm: DEPARTMENT_LABELS.map((dept) => ({
      '@type': 'DefinedTerm',
      '@id': `${baseUrl}/${dept.slug}#term`,
      name: dept.name,
      termCode: dept.slug,
      description: dept.description,
      url: `${baseUrl}/${dept.slug}`,
      inDefinedTermSet: `${baseUrl}/#taxonomy`,
    })),
  };

  // 4. SiteNavigationElement (Exposes all navigation and category labels for Google Sitelinks)
  const navigationItems = [
    {
      '@type': 'SiteNavigationElement',
      position: 1,
      name: 'Latest Dispatches',
      description: 'Front-page index of latest peer-reviewed health and performance investigations.',
      url: `${baseUrl}/`,
    },
    ...DEPARTMENT_LABELS.map((dept, idx) => ({
      '@type': 'SiteNavigationElement',
      position: idx + 2,
      name: dept.name,
      description: dept.description,
      url: `${baseUrl}/${dept.slug}`,
    })),
    {
      '@type': 'SiteNavigationElement',
      position: DEPARTMENT_LABELS.length + 2,
      name: 'Bioenergetics & Protein Calculator',
      description: 'Interactive calculator for Zone 2 heart rate threshold and daily protein distribution.',
      url: `${baseUrl}/calculators`,
    },
    {
      '@type': 'SiteNavigationElement',
      position: DEPARTMENT_LABELS.length + 3,
      name: 'Saved Investigations Archive',
      description: 'Reader bookmark repository for evidence-based performance guides.',
      url: `${baseUrl}/saved`,
    },
  ];

  // 5. BreadcrumbList based on page hierarchy
  let breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${baseUrl}/`,
    },
  ];

  if (pageType === 'article' && article) {
    const matchedDept = DEPARTMENT_LABELS.find((d) => d.name === article.category);
    if (matchedDept) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: matchedDept.name,
        item: `${baseUrl}/${matchedDept.slug}`,
      });
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl,
      });
    } else {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: article.title,
        item: canonicalUrl,
      });
    }
  } else if (pageType === 'category' && categoryName && categorySlug) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: categoryName,
      item: canonicalUrl,
    });
  } else if (pageType === 'calculators') {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Bioenergetics & Protein Calculator',
      item: canonicalUrl,
    });
  } else if (pageType === 'saved') {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Saved Investigations',
      item: canonicalUrl,
    });
  } else if (pageType === 'not_found') {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Error 404 (Not Found)',
      item: canonicalUrl,
    });
  }

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbItems,
  };

  // 6. Page-Specific Primary Entity
  const graph: any[] = [
    webSiteSchema,
    organizationSchema,
    taxonomySchema,
    ...navigationItems,
    breadcrumbSchema,
  ];

  if (pageType === 'article' && article) {
    const matchedDept = DEPARTMENT_LABELS.find((d) => d.name === article.category);
    // Combine department label with individual topic tags
    const allLabels = [article.category, ...(article.tags || [])];
    const uniqueLabels = Array.from(new Set(allLabels));

    const articleSchema = {
      '@type': ['Article', 'MedicalWebPage'],
      '@id': `${canonicalUrl}#article`,
      isPartOf: {
        '@id': `${baseUrl}/#website`,
      },
      headline: article.seoTitle || article.title,
      name: article.title,
      description: article.metaDescription || article.subtitle || description,
      url: canonicalUrl,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
      image: {
        '@type': 'ImageObject',
        url: resolvedImage,
        width: 1200,
        height: 896,
      },
      articleSection: article.category, // Primary department label
      keywords: uniqueLabels.join(', '), // Exposes all topic and category labels
      about: uniqueLabels.map((lbl) => ({
        '@type': 'Thing',
        name: lbl,
      })),
      datePublished: '2026-09-15T00:00:00Z',
      dateModified: '2026-10-28T00:00:00Z',
      inLanguage: 'en-US',
      wordCount: article.wordCount,
      timeRequired: article.readTime ? `PT${parseInt(article.readTime, 10) || 7}M` : 'PT7M',
      author: {
        '@type': 'Person',
        name: article.author.name,
        jobTitle: article.author.role,
        description: article.author.bio,
        image: article.author.avatar,
      },
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
      breadcrumbs: {
        '@id': `${canonicalUrl}#breadcrumb`,
      },
      hasPart: article.sections?.map((sec) => ({
        '@type': 'WebPageElement',
        name: sec.heading,
      })),
    };

    graph.push(articleSchema);
  } else if (pageType === 'category' && categoryName) {
    const matchedDept = DEPARTMENT_LABELS.find((d) => d.name === categoryName);
    const categoryArticles = articles.filter((a) => a.category === categoryName);

    const collectionSchema = {
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl}#collection`,
      isPartOf: {
        '@id': `${baseUrl}/#website`,
      },
      name: `${categoryName} — Aura & Iron Journal`,
      description: matchedDept?.description || description,
      url: canonicalUrl,
      about: {
        '@type': 'DefinedTerm',
        '@id': `${baseUrl}/${categorySlug}#term`,
        name: categoryName,
        description: matchedDept?.description,
      },
      keywords: matchedDept ? [matchedDept.name, ...matchedDept.keywords].join(', ') : categoryName,
      mainEntity: {
        '@type': 'ItemList',
        name: `${categoryName} Investigations`,
        numberOfItems: categoryArticles.length,
        itemListElement: categoryArticles.map((art, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: art.title,
          url: `${baseUrl}/${art.slug}`,
          description: art.metaDescription || art.subtitle,
        })),
      },
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
    };

    graph.push(collectionSchema);
  } else if (pageType === 'calculators') {
    const appSchema = {
      '@type': 'WebApplication',
      '@id': `${canonicalUrl}#app`,
      name: 'Aura & Iron Bioenergetics & Protein Calculator',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'All',
      url: canonicalUrl,
      description: description,
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      about: [
        { '@type': 'Thing', name: 'Zone 2 Heart Rate' },
        { '@type': 'Thing', name: 'Protein Pacing' },
        { '@type': 'Thing', name: 'Exercise Physiology' },
        { '@type': 'Thing', name: 'Muscle Protein Synthesis' },
      ],
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
    };

    graph.push(appSchema);
  } else {
    // Homepage or general WebPage
    const homeWebPageSchema = {
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl}#webpage`,
      isPartOf: {
        '@id': `${baseUrl}/#website`,
      },
      name: title,
      url: canonicalUrl,
      description: description,
      about: DEPARTMENT_LABELS.map((dept) => ({
        '@type': 'DefinedTerm',
        name: dept.name,
        url: `${baseUrl}/${dept.slug}`,
      })),
      keywords: [
        ...DEPARTMENT_LABELS.map((d) => d.name),
        'Exercise Physiology',
        'Human Longevity',
        'Zone 2 Cardio',
        'Hypertrophy',
        'Circadian Biology',
        'Protein Pacing',
        'Gut Microbiome',
        'VO2 Max',
      ].join(', '),
      mainEntity: {
        '@type': 'ItemList',
        name: 'Peer-Reviewed Longevity & Fitness Investigations',
        numberOfItems: articles.length,
        itemListElement: articles.map((art, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: art.title,
          url: `${baseUrl}/${art.slug}`,
          category: art.category,
        })),
      },
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
    };

    graph.push(homeWebPageSchema);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
