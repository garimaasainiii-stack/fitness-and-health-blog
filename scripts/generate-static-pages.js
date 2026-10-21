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

// 10 Articles configuration
const articles = [
  {
    slug: 'zone-2-cardio',
    title: 'Zone 2 Cardio Training: Meaning, Physiology & Longevity',
    description: 'Master zone 2 cardio training to build mitochondrial density, boost fat oxidation, and improve cardiovascular health with our evidence-based endurance guide.'
  },
  {
    slug: 'hypertrophy-science',
    title: 'Muscle Hypertrophy Science: Hypertrophy & Protein Guide',
    description: 'Unlock optimal muscle hypertrophy through progressive overload, mechanical tension, and smart nutrition strategies verified by exercise physiology science.'
  },
  {
    slug: 'sleep-architecture',
    title: 'Circadian Rhythm in Sleep: Optimizing Deep Rest & Cycles',
    description: 'Optimize your circadian rhythm in sleep to maximize deep restorative cycles, accelerate athletic recovery, and align your master biological clock naturally.'
  },
  {
    slug: 'protein-pacing',
    title: 'Recommended Protein Intake for Muscle Growth & Calculator',
    description: 'Calculate the recommended protein intake for muscle growth, leucine triggers, and meal distribution to preserve lean mass and accelerate muscle repair today.'
  },
  {
    slug: 'cold-plunge-protocol',
    title: 'Cold Plunge Benefits: Hormesis, Tub Protocols & Recovery',
    description: 'Discover proven cold plunge benefits, thermal hormesis protocols, and tub immersion routines to enhance dopamine, reduce soreness, and speed systemic recovery.'
  },
  {
    slug: 'gut-microbiome',
    title: 'Gut Microbiome Health: Biodiversity & Gut-Brain Science',
    description: 'Support gut microbiome health through prebiotic fiber diversity, short-chain fatty acids, and gut-brain signaling to enhance metabolic wellness and mood.'
  },
  {
    slug: 'functional-mobility',
    title: 'Hip Mobility Exercises: Joint Health & Functional Motion',
    description: 'Bulletproof your hips using targeted hip mobility exercises, active end-range control, and pelvic alignment drills to eliminate tightness and move freely.'
  },
  {
    slug: 'cortisol-stress-relief',
    title: 'How to Reduce Cortisol Naturally: Downregulate Stress',
    description: 'Learn how to reduce cortisol naturally with physiological sigh breathing, HRV tracking, and nervous system regulation to mitigate chronic stress effectively.'
  },
  {
    slug: 'intermittent-fasting',
    title: 'Intermittent Fasting Benefits: Fasting & Weight Loss',
    description: 'Explore real intermittent fasting benefits, cellular autophagy mechanisms, and structured feeding windows to optimize metabolic flexibility and weight loss.'
  },
  {
    slug: 'vo2-max',
    title: 'VO2 Max Check: Cardiorespiratory Fitness & Healthspan',
    description: 'Perform an accurate VO2 max check, evaluate cardiorespiratory fitness benchmarks by age, and apply high-intensity protocols to extend your active healthspan.'
  }
];

// Categories
const categories = [
  { slug: 'strength', name: 'Strength & Training' },
  { slug: 'cardio', name: 'Cardio & Endurance' },
  { slug: 'recovery', name: 'Recovery & Sleep' },
  { slug: 'nutrition', name: 'Nutrition & Fuel' },
  { slug: 'longevity', name: 'Longevity & Science' },
  { slug: 'resilience', name: 'Mental Resilience' }
];

function createPage(routePath, canonicalUrl, title, description) {
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

  // Replace or inject Schema.org structured data
  const structuredData = routePath.includes('article') || articles.some(a => a.slug === routePath)
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        url: canonicalUrl,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Aura & Iron — Health & Fitness Journal',
          url: BASE_URL,
        },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Aura & Iron — Health & Fitness Journal',
        url: canonicalUrl,
        description: description,
      };

  const scriptTag = `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`;
  if (html.includes('application/ld+json')) {
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, scriptTag);
  } else {
    html = html.replace('</head>', `  ${scriptTag}\n  </head>`);
  }

  const targetDir = path.join(distDir, routePath);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');
  console.log(`Generated canonical static HTML: ${routePath}/index.html -> ${canonicalUrl}`);
}

// 1. Generate Articles (both /:slug and /article/:slug canonicalized to /:slug)
articles.forEach((art) => {
  const canonicalUrl = `${BASE_URL}/${art.slug}`;
  createPage(art.slug, canonicalUrl, art.title, art.description);
  createPage(`article/${art.slug}`, canonicalUrl, art.title, art.description);
});

// 2. Generate Categories
categories.forEach((cat) => {
  const canonicalUrl = `${BASE_URL}/${cat.slug}`;
  const title = `${cat.name} — Aura & Iron`;
  const desc = `Explore evidence-based research and scientific dispatches in ${cat.name}.`;
  createPage(cat.slug, canonicalUrl, title, desc);
});

// 3. Generate Utilities
createPage(
  'calculators',
  `${BASE_URL}/calculators`,
  'Bioenergetics & Protein Calculator — Aura & Iron',
  'Evidence-based interactive calculators for Zone 2 heart rate zones and daily optimal protein distribution.'
);

createPage(
  'saved',
  `${BASE_URL}/saved`,
  'Saved Investigations Archive — Aura & Iron',
  'Your private saved collection of evidence-based health and fitness investigations.'
);

createPage(
  '404',
  `${BASE_URL}/404`,
  'Page Not Found (404) — Aura & Iron',
  'The requested investigation could not be located in our publication archives. Explore our latest evidence-based dispatches, categories, and bioenergetics calculators.'
);

// Copy standalone public/404.html to dist/404.html for static server fallbacks
const public404Path = path.resolve(process.cwd(), 'public', '404.html');
if (fs.existsSync(public404Path)) {
  fs.copyFileSync(public404Path, path.join(distDir, '404.html'));
}

console.log('Successfully generated canonical static HTML files for all pages including 404!');
