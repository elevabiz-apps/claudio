export type NewsTopic = "research" | "business" | "tools";

export interface RSSSource {
  id: string;
  name: string;
  feedUrl: string;
  topic: NewsTopic;
  siteUrl: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  sourceId: string;
  topic: NewsTopic;
  publishedAt: string; // ISO date string
  imageUrl?: string;
}

export const TOPIC_CONFIG: Record<NewsTopic, { label: string; color: string; bgColor: string; borderColor: string }> = {
  research: { label: "Research", color: "text-violet-400", bgColor: "bg-violet-500/15", borderColor: "border-violet-500/30" },
  business: { label: "Business", color: "text-amber-400", bgColor: "bg-amber-500/15", borderColor: "border-amber-500/30" },
  tools: { label: "Tools", color: "text-teal-400", bgColor: "bg-teal-500/15", borderColor: "border-teal-500/30" },
};

export const RSS_SOURCES: RSSSource[] = [
  {
    id: "sciencedaily",
    name: "ScienceDaily",
    feedUrl: "https://www.sciencedaily.com/rss/health_medicine/nutrition.xml",
    topic: "research",
    siteUrl: "https://www.sciencedaily.com",
  },
  {
    id: "nutritionfacts",
    name: "NutritionFacts.org",
    feedUrl: "https://nutritionfacts.org/feed/",
    topic: "research",
    siteUrl: "https://nutritionfacts.org",
  },
  {
    id: "ejcn",
    name: "European J. Clinical Nutrition",
    feedUrl: "https://www.nature.com/ejcn.rss",
    topic: "research",
    siteUrl: "https://www.nature.com/ejcn",
  },
  {
    id: "nutraingredients",
    name: "NutraIngredients",
    feedUrl: "https://www.nutraingredients.com/rss/",
    topic: "business",
    siteUrl: "https://www.nutraingredients.com",
  },
  {
    id: "foodbusinessnews",
    name: "Food Business News",
    feedUrl: "https://www.foodbusinessnews.net/rss",
    topic: "business",
    siteUrl: "https://www.foodbusinessnews.net",
  },
  {
    id: "fooddive",
    name: "Food Dive",
    feedUrl: "https://www.fooddive.com/feeds/news/",
    topic: "business",
    siteUrl: "https://www.fooddive.com",
  },
  {
    id: "precisionnutrition",
    name: "Precision Nutrition",
    feedUrl: "https://www.precisionnutrition.com/feed",
    topic: "tools",
    siteUrl: "https://www.precisionnutrition.com",
  },
];

// Fallback sample data used when RSS fetches fail or during initial render
export const SAMPLE_NEWS: NewsItem[] = [
  {
    id: "s1",
    title: "High-protein diets linked to improved metabolic health markers in new meta-analysis",
    summary: "A comprehensive review of 42 randomized controlled trials found that higher protein intake was consistently associated with improvements in HbA1c, fasting glucose, and insulin sensitivity across diverse populations.",
    url: "#",
    source: "ScienceDaily",
    sourceId: "sciencedaily",
    topic: "research",
    publishedAt: "2026-03-23T08:00:00Z",
  },
  {
    id: "s2",
    title: "Gut microbiome diversity may predict response to dietary interventions, study finds",
    summary: "Researchers at Stanford identified specific microbial signatures that could predict which patients would benefit most from Mediterranean diet interventions, opening the door to personalized nutrition plans.",
    url: "#",
    source: "NutritionFacts.org",
    sourceId: "nutritionfacts",
    topic: "research",
    publishedAt: "2026-03-22T14:30:00Z",
  },
  {
    id: "s3",
    title: "Vitamin D supplementation during pregnancy reduces childhood allergy risk by 25%",
    summary: "A large-scale European trial following 3,200 mother-child pairs over 6 years found significant reductions in allergic rhinitis and eczema in children whose mothers supplemented with vitamin D during the third trimester.",
    url: "#",
    source: "European J. Clinical Nutrition",
    sourceId: "ejcn",
    topic: "research",
    publishedAt: "2026-03-22T10:00:00Z",
  },
  {
    id: "s4",
    title: "Functional food market projected to reach $390B by 2028 amid wellness boom",
    summary: "New market analysis shows the global functional food industry growing at 8.3% CAGR, driven by consumer demand for gut health products, adaptogens, and protein-fortified snacks.",
    url: "#",
    source: "NutraIngredients",
    sourceId: "nutraingredients",
    topic: "business",
    publishedAt: "2026-03-23T06:00:00Z",
  },
  {
    id: "s5",
    title: "Major food brands pivot to personalized nutrition offerings",
    summary: "Nestlé, Danone, and PepsiCo have all announced personalized nutrition platforms in Q1 2026, signaling a major industry shift toward AI-driven dietary recommendations at scale.",
    url: "#",
    source: "Food Business News",
    sourceId: "foodbusinessnews",
    topic: "business",
    publishedAt: "2026-03-21T15:00:00Z",
  },
  {
    id: "s6",
    title: "FDA proposes updated front-of-package nutrition labeling guidelines",
    summary: "The proposed rule would require simplified nutritional scoring on the front of all packaged foods, similar to systems already adopted in France and the UK, with implementation expected by 2027.",
    url: "#",
    source: "Food Dive",
    sourceId: "fooddive",
    topic: "business",
    publishedAt: "2026-03-21T09:00:00Z",
  },
  {
    id: "s7",
    title: "AI-powered meal planning tools see 300% adoption growth among dietitians",
    summary: "A survey of 1,200 registered dietitians found that AI-assisted meal planning software is now used by 67% of practitioners, up from 22% in 2024, with Precision Nutrition and Nutrium leading adoption.",
    url: "#",
    source: "Precision Nutrition",
    sourceId: "precisionnutrition",
    topic: "tools",
    publishedAt: "2026-03-22T12:00:00Z",
  },
  {
    id: "s8",
    title: "New wearable tracks real-time glucose response to individual foods",
    summary: "BioSense Labs launched a continuous metabolic monitor that pairs with a nutrition app to score foods based on personal glycemic response, offering a new tool for nutritionists managing pre-diabetic clients.",
    url: "#",
    source: "Precision Nutrition",
    sourceId: "precisionnutrition",
    topic: "tools",
    publishedAt: "2026-03-20T11:00:00Z",
  },
  {
    id: "s9",
    title: "Ultra-processed food consumption linked to accelerated cognitive decline",
    summary: "A 10-year longitudinal study of 8,400 adults found that those consuming more than 4 servings of ultra-processed food daily showed significantly faster decline in memory and executive function tests.",
    url: "#",
    source: "ScienceDaily",
    sourceId: "sciencedaily",
    topic: "research",
    publishedAt: "2026-03-20T08:00:00Z",
  },
  {
    id: "s10",
    title: "Plant-based protein startup raises $120M to scale fermentation technology",
    summary: "New Culture closed its Series C to expand precision fermentation facilities producing animal-free casein protein, targeting the sports nutrition and clinical nutrition markets.",
    url: "#",
    source: "Food Business News",
    sourceId: "foodbusinessnews",
    topic: "business",
    publishedAt: "2026-03-19T13:00:00Z",
  },
  {
    id: "s11",
    title: "Omega-3 index testing becomes standard in preventive nutrition practice",
    summary: "New clinical guidelines recommend omega-3 index blood testing as a routine component of nutritional assessment, following evidence that optimizing levels reduces cardiovascular event risk by 30%.",
    url: "#",
    source: "European J. Clinical Nutrition",
    sourceId: "ejcn",
    topic: "research",
    publishedAt: "2026-03-19T10:00:00Z",
  },
  {
    id: "s12",
    title: "Telehealth nutrition counseling now covered by 85% of US insurers",
    summary: "A milestone report shows near-universal insurance coverage for virtual nutrition consultations, driving a 40% increase in registered dietitian caseloads since 2024.",
    url: "#",
    source: "NutraIngredients",
    sourceId: "nutraingredients",
    topic: "business",
    publishedAt: "2026-03-18T07:00:00Z",
  },
];
