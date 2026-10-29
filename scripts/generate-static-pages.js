import fs from 'fs';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.log('dist/index.html not found, skipping static page generation.');
  process.exit(0);
}

const template = fs.readFileSync(indexHtmlPath, 'utf-8');
const BASE_URL = 'https://fitness-and-health-blog-ten.vercel.app';

// 6 Department Taxonomy Labels
const departments = [
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

// 10 Articles configuration
const articles = [
  {
    slug: 'zone-2-cardio',
    title: 'Zone 2 Cardio Training: Meaning, Physiology & Longevity',
    description: 'Master zone 2 cardio training to build mitochondrial density, boost fat oxidation, and improve cardiovascular health with our evidence-based endurance guide.',
    category: 'Cardio & Endurance',
    tags: ['Cardio', 'Zone 2', 'Mitochondria', 'Endurance', 'Longevity'],
  },
  {
    slug: 'hypertrophy-science',
    title: 'Muscle Hypertrophy Science: Hypertrophy & Protein Guide',
    description: 'Unlock optimal muscle hypertrophy through progressive overload, mechanical tension, and smart nutrition strategies verified by exercise physiology science.',
    category: 'Strength & Training',
    tags: ['Strength', 'Hypertrophy', 'Biomechanics', 'Resistance Training'],
  },
  {
    slug: 'sleep-architecture',
    title: 'Circadian Rhythm in Sleep: Optimizing Deep Rest & Cycles',
    description: 'Optimize your circadian rhythm in sleep to maximize deep restorative cycles, accelerate athletic recovery, and align your master biological clock naturally.',
    category: 'Recovery & Sleep',
    tags: ['Sleep', 'Circadian Biology', 'Recovery', 'Neuroscience'],
  },
  {
    slug: 'protein-pacing',
    title: 'Recommended Protein Intake for Muscle Growth & Calculator',
    description: 'Calculate the recommended protein intake for muscle growth, leucine triggers, and meal distribution to preserve lean mass and accelerate muscle repair today.',
    category: 'Nutrition & Fuel',
    tags: ['Nutrition', 'Protein', 'Muscle Protein Synthesis', 'Dietary Science'],
  },
  {
    slug: 'cold-plunge-protocol',
    title: 'Cold Plunge Benefits: Hormesis, Tub Protocols & Recovery',
    description: 'Discover proven cold plunge benefits, thermal hormesis protocols, and tub immersion routines to enhance dopamine, reduce soreness, and speed systemic recovery.',
    category: 'Recovery & Sleep',
    tags: ['Cold Plunge', 'Hormesis', 'Biohacking', 'Dopamine', 'Recovery'],
  },
  {
    slug: 'gut-microbiome',
    title: 'Gut Microbiome Health: Biodiversity & Gut-Brain Science',
    description: 'Support gut microbiome health through prebiotic fiber diversity, short-chain fatty acids, and gut-brain signaling to enhance metabolic wellness and mood.',
    category: 'Nutrition & Fuel',
    tags: ['Microbiome', 'Gut Health', 'Nutrition', 'Metabolism'],
  },
  {
    slug: 'functional-mobility',
    title: 'Hip Mobility Exercises: Joint Health & Functional Motion',
    description: 'Bulletproof your hips using targeted hip mobility exercises, active end-range control, and pelvic alignment drills to eliminate tightness and move freely.',
    category: 'Strength & Training',
    tags: ['Mobility', 'Joint Health', 'Physical Therapy', 'Movement'],
  },
  {
    slug: 'cortisol-stress-relief',
    title: 'How to Reduce Cortisol Naturally: Downregulate Stress',
    description: 'Learn how to reduce cortisol naturally with physiological sigh breathing, HRV tracking, and nervous system regulation to mitigate chronic stress effectively.',
    category: 'Mental Resilience',
    tags: ['Stress', 'Cortisol', 'HRV', 'Mental Resilience', 'Breathwork'],
  },
  {
    slug: 'intermittent-fasting',
    title: 'Intermittent Fasting Benefits: Fasting & Weight Loss',
    description: 'Explore real intermittent fasting benefits, cellular autophagy mechanisms, and structured feeding windows to optimize metabolic flexibility and weight loss.',
    category: 'Longevity & Science',
    tags: ['Fasting', 'Autophagy', 'Nutrition', 'Metabolism', 'Longevity'],
  },
  {
    slug: 'vo2-max',
    title: 'VO2 Max Check: Cardiorespiratory Fitness & Healthspan',
    description: 'Perform an accurate VO2 max check, evaluate cardiorespiratory fitness benchmarks by age, and apply high-intensity protocols to extend your active healthspan.',
    category: 'Longevity & Science',
    tags: ['VO2 Max', 'Cardio', 'Longevity', 'Clinical Science'],
  },
];

// Helper to generate full Schema.org graph for static HTML
function generateStaticSchema({ pageType, canonicalUrl, title, description, article, category }) {
  const organization = {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Aura & Iron — Health & Fitness Journal',
    url: `${BASE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/favicon.svg`,
      width: 64,
      height: 64,
    },
    publishingPrinciples: `${BASE_URL}/`,
    knowsAbout: departments.map((d) => d.name),
  };

  const webSite = {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: `${BASE_URL}/`,
    name: 'Aura & Iron — Health & Fitness Journal',
    description: 'Explore science-backed fitness and health tips on training, cellular recovery, and longevity.',
    publisher: { '@id': `${BASE_URL}/#organization` },
  };

  const taxonomy = {
    '@type': 'DefinedTermSet',
    '@id': `${BASE_URL}/#taxonomy`,
    name: 'Aura & Iron Journal Department Labels',
    description: 'Core editorial departments and scientific taxonomy labels for sports physiology, nutrition, and longevity.',
    hasDefinedTerm: departments.map((dept) => ({
      '@type': 'DefinedTerm',
      '@id': `${BASE_URL}/${dept.slug}#term`,
      name: dept.name,
      termCode: dept.slug,
      description: dept.description,
      url: `${BASE_URL}/${dept.slug}`,
      inDefinedTermSet: `${BASE_URL}/#taxonomy`,
    })),
  };

  const navigationItems = [
    {
      '@type': 'SiteNavigationElement',
      position: 1,
      name: 'Latest Dispatches',
      url: `${BASE_URL}/`,
    },
    ...departments.map((dept, idx) => ({
      '@type': 'SiteNavigationElement',
      position: idx + 2,
      name: dept.name,
      description: dept.description,
      url: `${BASE_URL}/${dept.slug}`,
    })),
    {
      '@type': 'SiteNavigationElement',
      position: departments.length + 2,
      name: 'Bioenergetics & Protein Calculator',
      url: `${BASE_URL}/calculators`,
    },
    {
      '@type': 'SiteNavigationElement',
      position: departments.length + 3,
      name: 'Saved Investigations Archive',
      url: `${BASE_URL}/saved`,
    },
  ];

  let breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
  ];

  if (pageType === 'article' && article) {
    const matchedDept = departments.find((d) => d.name === article.category);
    if (matchedDept) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: matchedDept.name,
        item: `${BASE_URL}/${matchedDept.slug}`,
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
  } else if (pageType === 'category' && category) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: category.name,
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
      name: 'Saved Investigations Archive',
      item: canonicalUrl,
    });
  }

  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbItems,
  };

  const graph = [webSite, organization, taxonomy, ...navigationItems, breadcrumbs];

  if (pageType === 'article' && article) {
    const uniqueLabels = Array.from(new Set([article.category, ...(article.tags || [])]));
    graph.push({
      '@type': ['Article', 'MedicalWebPage'],
      '@id': `${canonicalUrl}#article`,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      headline: title,
      name: article.title,
      description: description,
      url: canonicalUrl,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      articleSection: article.category,
      keywords: uniqueLabels.join(', '),
      about: uniqueLabels.map((lbl) => ({ '@type': 'Thing', name: lbl })),
      publisher: { '@id': `${BASE_URL}/#organization` },
    });
  } else if (pageType === 'category' && category) {
    const categoryArticles = articles.filter((a) => a.category === category.name);
    graph.push({
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl}#collection`,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      name: `${category.name} — Aura & Iron Journal`,
      description: category.description,
      url: canonicalUrl,
      about: {
        '@type': 'DefinedTerm',
        name: category.name,
        description: category.description,
      },
      keywords: [category.name, ...category.keywords].join(', '),
      mainEntity: {
        '@type': 'ItemList',
        name: `${category.name} Investigations`,
        numberOfItems: categoryArticles.length,
        itemListElement: categoryArticles.map((art, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: art.title,
          url: `${BASE_URL}/${art.slug}`,
        })),
      },
      publisher: { '@id': `${BASE_URL}/#organization` },
    });
  } else if (pageType === 'calculators') {
    graph.push({
      '@type': 'WebApplication',
      '@id': `${canonicalUrl}#app`,
      name: 'Aura & Iron Bioenergetics & Protein Calculator',
      applicationCategory: 'HealthApplication',
      url: canonicalUrl,
      description: description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      about: [
        { '@type': 'Thing', name: 'Zone 2 Heart Rate' },
        { '@type': 'Thing', name: 'Protein Pacing' },
      ],
      publisher: { '@id': `${BASE_URL}/#organization` },
    });
  } else {
    // Default homepage / WebPage
    graph.push({
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl}#webpage`,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      name: title,
      url: canonicalUrl,
      description: description,
      about: departments.map((dept) => ({
        '@type': 'DefinedTerm',
        name: dept.name,
        url: `${BASE_URL}/${dept.slug}`,
      })),
      keywords: departments.map((d) => d.name).join(', '),
      publisher: { '@id': `${BASE_URL}/#organization` },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

function createPage(routePath, canonicalUrl, title, description, schemaOptions = {}) {
  let html = template;

  // Replace Canonical Link
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Replace Open Graph URL
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );

  // Replace Title
  if (title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
    html = html.replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${title}" />`
    );
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${title}" />`
    );
  }

  // Replace Description
  if (description) {
    html = html.replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${description}" />`
    );
    html = html.replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${description}" />`
    );
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${description}" />`
    );
  }

  // Generate comprehensive Schema.org JSON-LD with all labels
  const schemaGraph = generateStaticSchema({
    pageType: schemaOptions.pageType || 'home',
    canonicalUrl,
    title,
    description,
    article: schemaOptions.article,
    category: schemaOptions.category,
  });

  const scriptTag = `<script type="application/ld+json">${JSON.stringify(schemaGraph)}</script>`;
  if (html.includes('application/ld+json')) {
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, scriptTag);
  } else {
    html = html.replace('</head>', `  ${scriptTag}\n  </head>`);
  }

  const targetDir = path.join(distDir, routePath);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');
  console.log(`Generated canonical static HTML with rich label schema: ${routePath}/index.html -> ${canonicalUrl}`);
}

// 1. Generate Articles (both /:slug and /article/:slug canonicalized to /:slug)
articles.forEach((art) => {
  const canonicalUrl = `${BASE_URL}/${art.slug}`;
  createPage(art.slug, canonicalUrl, art.title, art.description, {
    pageType: 'article',
    article: art,
  });
  createPage(`article/${art.slug}`, canonicalUrl, art.title, art.description, {
    pageType: 'article',
    article: art,
  });
});

// 2. Generate Categories
departments.forEach((dept) => {
  const canonicalUrl = `${BASE_URL}/${dept.slug}`;
  const title = `${dept.name} — Aura & Iron`;
  const desc = dept.description;
  createPage(dept.slug, canonicalUrl, title, desc, {
    pageType: 'category',
    category: dept,
  });
});

// 3. Generate Utilities
createPage(
  'calculators',
  `${BASE_URL}/calculators`,
  'Bioenergetics & Protein Calculator — Aura & Iron',
  'Evidence-based interactive calculators for Zone 2 heart rate zones and daily optimal protein distribution.',
  { pageType: 'calculators' }
);

createPage(
  'saved',
  `${BASE_URL}/saved`,
  'Saved Investigations Archive — Aura & Iron',
  'Your private saved collection of evidence-based health and fitness investigations.',
  { pageType: 'saved' }
);

createPage(
  '404',
  `${BASE_URL}/404`,
  'Page Not Found (404) — Aura & Iron',
  'The requested investigation could not be located in our publication archives. Explore our latest evidence-based dispatches, categories, and bioenergetics calculators.',
  { pageType: 'not_found' }
);

// Copy standalone public/404.html to dist/404.html for static server fallbacks
const public404Path = path.resolve(process.cwd(), 'public', '404.html');
if (fs.existsSync(public404Path)) {
  fs.copyFileSync(public404Path, path.join(distDir, '404.html'));
}

console.log('Successfully generated canonical static HTML files with comprehensive label schema!');
