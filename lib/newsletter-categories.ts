export const NEWSLETTER_CATEGORY_IDS = [
  "ai",
  "startups",
  "dev",
  "infosec",
  "product",
  "devops",
  "founders",
  "design",
  "marketing",
  "crypto",
  "fintech",
  "it",
  "data",
  "hardware",
] as const;

export type NewsletterCategoryId = (typeof NEWSLETTER_CATEGORY_IDS)[number];

export const newsletterCategories = [
  {
    id: "ai" as const,
    icon: "🧠",
    title: "AI",
    description:
      "Launches, innovations, and research for AI, machine learning, and data science professionals",
    tagline: "Keep up with AI in 5 minutes",
    comingSoon: false,
  },
  {
    id: "startups" as const,
    icon: "👥",
    title: "Startups, Tech & Programming",
    description:
      "The most interesting stories in tech, startups, and programming",
    tagline: "Keep up with startups & tech in 5 minutes",
    comingSoon: true,
  },
  {
    id: "dev" as const,
    icon: "☁️",
    title: "Dev",
    description:
      "Curated deep dives, tools, and trends in frontend, backend, and full stack web development",
    tagline: "Keep up with dev in 5 minutes",
    comingSoon: true,
  },
  {
    id: "infosec" as const,
    icon: "🔒",
    title: "Information Security",
    description:
      "News, research, and tools for information security professionals",
    tagline: "Keep up with infosec in 5 minutes",
    comingSoon: true,
  },
  {
    id: "product" as const,
    icon: "👥",
    title: "Product Management",
    description: "Deep dives, trends, and resources for product managers",
    tagline: "Keep up with product in 5 minutes",
    comingSoon: true,
  },
  {
    id: "devops" as const,
    icon: "☁️",
    title: "DevOps",
    description: "Tools, trends, and insights for DevOps engineers",
    tagline: "Keep up with DevOps in 5 minutes",
    comingSoon: true,
  },
  {
    id: "founders" as const,
    icon: "👑",
    title: "Founders",
    description:
      "Tactics, trends, and tools for startup founders and entrepreneurs",
    tagline: "Keep up with startups in 5 minutes",
    comingSoon: true,
  },
  {
    id: "design" as const,
    icon: "🎨",
    title: "Design",
    description: "Tools, trends, and inspiration for designers",
    tagline: "Keep up with design in 5 minutes",
    comingSoon: true,
  },
  {
    id: "marketing" as const,
    icon: "📈",
    title: "Marketing",
    description: "Tactics, trends, and tools for cutting edge marketers",
    tagline: "Keep up with marketing in 5 minutes",
    comingSoon: true,
  },
  {
    id: "crypto" as const,
    icon: "🌐",
    title: "Crypto",
    description:
      "The latest launches, innovations, and market moves in crypto & Web3",
    tagline: "Keep up with crypto in 5 minutes",
    comingSoon: true,
  },
  {
    id: "fintech" as const,
    icon: "💰",
    title: "Fintech",
    description: "Innovations and trends in financial markets and technology",
    tagline: "Keep up with fintech in 5 minutes",
    comingSoon: true,
  },
  {
    id: "it" as const,
    icon: "💻",
    title: "IT",
    description:
      "News and trends in IT strategy, information security, and cloud computing",
    tagline: "Keep up with IT in 5 minutes",
    comingSoon: true,
  },
  {
    id: "data" as const,
    icon: "📊",
    title: "Data",
    description: "Big data, data science and data engineering",
    tagline: "Keep up with data in 5 minutes",
    comingSoon: true,
  },
  {
    id: "hardware" as const,
    icon: "⚙️",
    title: "Hardware",
    description:
      "The latest in robotics, semiconductors and hardware engineering",
    tagline: "Keep up with hardware in 5 minutes",
    comingSoon: true,
  },
];

export function getCategoryById(id: string) {
  return newsletterCategories.find((c) => c.id === id);
}

export function isCategoryId(id: string): id is NewsletterCategoryId {
  return NEWSLETTER_CATEGORY_IDS.includes(id as NewsletterCategoryId);
}
