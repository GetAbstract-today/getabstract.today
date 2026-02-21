import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Users,
  Cloud,
  Lock,
  Box,
  CloudCog,
  Crown,
  Palette,
  TrendingUp,
  Globe,
  CircleDollarSign,
  Laptop,
  BarChart2,
  Cpu,
} from "lucide-react";

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

export const newsletterCategories: Array<{
  id: NewsletterCategoryId;
  icon: string;
  Icon: LucideIcon;
  title: string;
  description: string;
  tagline: string;
  comingSoon: boolean;
}> = [
  {
    id: "ai",
    icon: "🧠",
    Icon: Brain,
    title: "AI",
    description:
      "Launches, innovations, and research for AI, machine learning, and data science professionals",
    tagline: "Keep up with AI in 5 minutes",
    comingSoon: false,
  },
  {
    id: "startups",
    icon: "👥",
    Icon: Users,
    title: "Startups, Tech & Programming",
    description:
      "The most interesting stories in tech, startups, and programming",
    tagline: "Keep up with startups & tech in 5 minutes",
    comingSoon: true,
  },
  {
    id: "dev",
    icon: "☁️",
    Icon: Cloud,
    title: "Dev",
    description:
      "Curated deep dives, tools, and trends in frontend, backend, and full stack web development",
    tagline: "Keep up with dev in 5 minutes",
    comingSoon: true,
  },
  {
    id: "infosec",
    icon: "🔒",
    Icon: Lock,
    title: "Information Security",
    description:
      "News, research, and tools for information security professionals",
    tagline: "Keep up with infosec in 5 minutes",
    comingSoon: true,
  },
  {
    id: "product",
    icon: "👥",
    Icon: Box,
    title: "Product Management",
    description: "Deep dives, trends, and resources for product managers",
    tagline: "Keep up with product in 5 minutes",
    comingSoon: true,
  },
  {
    id: "devops",
    icon: "☁️",
    Icon: CloudCog,
    title: "DevOps",
    description: "Tools, trends, and insights for DevOps engineers",
    tagline: "Keep up with DevOps in 5 minutes",
    comingSoon: true,
  },
  {
    id: "founders",
    icon: "👑",
    Icon: Crown,
    title: "Founders",
    description:
      "Tactics, trends, and tools for startup founders and entrepreneurs",
    tagline: "Keep up with startups in 5 minutes",
    comingSoon: true,
  },
  {
    id: "design",
    icon: "🎨",
    Icon: Palette,
    title: "Design",
    description: "Tools, trends, and inspiration for designers",
    tagline: "Keep up with design in 5 minutes",
    comingSoon: true,
  },
  {
    id: "marketing",
    icon: "📈",
    Icon: TrendingUp,
    title: "Marketing",
    description: "Tactics, trends, and tools for cutting edge marketers",
    tagline: "Keep up with marketing in 5 minutes",
    comingSoon: true,
  },
  {
    id: "crypto",
    icon: "🌐",
    Icon: Globe,
    title: "Crypto",
    description:
      "The latest launches, innovations, and market moves in crypto & Web3",
    tagline: "Keep up with crypto in 5 minutes",
    comingSoon: true,
  },
  {
    id: "fintech",
    icon: "💰",
    Icon: CircleDollarSign,
    title: "Fintech",
    description: "Innovations and trends in financial markets and technology",
    tagline: "Keep up with fintech in 5 minutes",
    comingSoon: true,
  },
  {
    id: "it",
    icon: "💻",
    Icon: Laptop,
    title: "IT",
    description:
      "News and trends in IT strategy, information security, and cloud computing",
    tagline: "Keep up with IT in 5 minutes",
    comingSoon: true,
  },
  {
    id: "data",
    icon: "📊",
    Icon: BarChart2,
    title: "Data",
    description: "Big data, data science and data engineering",
    tagline: "Keep up with data in 5 minutes",
    comingSoon: true,
  },
  {
    id: "hardware",
    icon: "⚙️",
    Icon: Cpu,
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
