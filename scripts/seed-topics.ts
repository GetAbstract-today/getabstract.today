/**
 * Seed script: inserts all non-AI newsletter categories as TopicProfiles.
 * Run: npx tsx scripts/seed-topics.ts
 *
 * Safe to run multiple times — skips slugs that already exist.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { DEFAULT_SECTION_PRESETS } from "../lib/prompt-composer";

// Inline Prisma setup to avoid ESM/CJS issues with the custom output path
async function getDb() {
  const { PrismaClient } = await import("../lib/generated/prisma/client");
  const connectionString = `${process.env.DATABASE_URL}`;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

interface TopicSeed {
  slug: string;
  name: string;
  icon: string;
  description: string;
  tagline: string;
  role: string;
  topicScope: string;
  titlePrefix: string;
  prioritySources: string[];
  toneNotes: string;
  exampleSubjects: string[];
}

const TOPICS: TopicSeed[] = [
  {
    slug: "startups",
    name: "Startups, Tech & Programming",
    icon: "👥",
    description: "The most interesting stories in tech, startups, and programming",
    tagline: "Keep up with startups & tech in 5 minutes",
    role: "expert Tech and Startup News Curator and Business Writer",
    topicScope: "tech startups, venture capital, and programming",
    titlePrefix: "Startup Radar",
    prioritySources: ["TechCrunch", "The Verge", "Hacker News", "Bloomberg"],
    toneNotes: "Business-savvy but accessible. Assume the reader is a founder or early-stage employee.",
    exampleSubjects: [
      "Stripe raises $6.5B at $65B valuation",
      "Y Combinator's latest batch breaks records — here's what stood out",
    ],
  },
  {
    slug: "dev",
    name: "Dev",
    icon: "☁️",
    description: "Curated deep dives, tools, and trends in frontend, backend, and full stack web development",
    tagline: "Keep up with dev in 5 minutes",
    role: "expert Software Engineering Curator and Technical Writer",
    topicScope: "software development, programming languages, frameworks, and developer tools",
    titlePrefix: "Dev Digest",
    prioritySources: ["Hacker News", "Dev.to", "GitHub Blog", "InfoQ", "The New Stack"],
    toneNotes: "Technical and to-the-point. Assume the reader is a professional developer.",
    exampleSubjects: [
      "Bun 2.0 drops — native Windows support and 3x faster builds",
      "React Server Components hit stable — what changes for your codebase",
    ],
  },
  {
    slug: "infosec",
    name: "Information Security",
    icon: "🔒",
    description: "News, research, and tools for information security professionals",
    tagline: "Keep up with infosec in 5 minutes",
    role: "expert Cybersecurity and Information Security Analyst",
    topicScope: "cybersecurity, information security, vulnerabilities, and threat intelligence",
    titlePrefix: "InfoSec Brief",
    prioritySources: ["Krebs on Security", "BleepingComputer", "The Record", "CISA", "Dark Reading"],
    toneNotes: "Precise and urgent where needed. Assume the reader is a security professional or CISO.",
    exampleSubjects: [
      "Critical zero-day in Palo Alto firewalls — patch now",
      "Ransomware group leaks data from 3 Fortune 500 companies",
    ],
  },
  {
    slug: "product",
    name: "Product Management",
    icon: "📦",
    description: "Deep dives, trends, and resources for product managers",
    tagline: "Keep up with product in 5 minutes",
    role: "expert Product Management Curator and Strategy Writer",
    topicScope: "product management, product strategy, user research, and growth",
    titlePrefix: "Product Pulse",
    prioritySources: ["Lenny's Newsletter", "ProductHunt", "Mind the Product", "First Round Review"],
    toneNotes: "Strategic and actionable. Assume the reader is a PM at a growth-stage company.",
    exampleSubjects: [
      "Notion's PM shares the framework behind their AI rollout",
      "Why the best PMs are shipping less and learning more",
    ],
  },
  {
    slug: "devops",
    name: "DevOps",
    icon: "☁️",
    description: "Tools, trends, and insights for DevOps engineers",
    tagline: "Keep up with DevOps in 5 minutes",
    role: "expert DevOps and Infrastructure Curator",
    topicScope: "DevOps, CI/CD, cloud infrastructure, containers, and SRE",
    titlePrefix: "DevOps Dispatch",
    prioritySources: ["The New Stack", "DevOps.com", "CNCF Blog", "HashiCorp Blog", "AWS Blog"],
    toneNotes: "Technical and infrastructure-focused. Assume the reader manages production systems.",
    exampleSubjects: [
      "Kubernetes 1.32 lands with sidecar containers GA",
      "Terraform vs Pulumi in 2026 — the definitive comparison",
    ],
  },
  {
    slug: "founders",
    name: "Founders",
    icon: "👑",
    description: "Tactics, trends, and tools for startup founders and entrepreneurs",
    tagline: "Keep up with startups in 5 minutes",
    role: "expert Startup Founder Advisor and Business Strategist",
    topicScope: "entrepreneurship, fundraising, company building, and founder tactics",
    titlePrefix: "Founder Playbook",
    prioritySources: ["Y Combinator Blog", "First Round Review", "Paul Graham Essays", "TechCrunch Startups"],
    toneNotes: "Direct, no-nonsense, founder-to-founder. Focus on actionable takeaways.",
    exampleSubjects: [
      "How this solo founder bootstrapped to $10M ARR in 18 months",
      "The fundraising market just shifted — what seed-stage founders need to know",
    ],
  },
  {
    slug: "design",
    name: "Design",
    icon: "🎨",
    description: "Tools, trends, and inspiration for designers",
    tagline: "Keep up with design in 5 minutes",
    role: "expert Design Curator and Visual Communication Writer",
    topicScope: "UI/UX design, design systems, typography, and visual communication",
    titlePrefix: "Design Brief",
    prioritySources: ["Dribbble", "Figma Blog", "Smashing Magazine", "Nielsen Norman Group", "Sidebar.io"],
    toneNotes: "Visual and inspiring. Assume the reader is a product or brand designer.",
    exampleSubjects: [
      "Figma ships AI-powered auto-layout — designers react",
      "Apple's visionOS design language is reshaping spatial UI",
    ],
  },
  {
    slug: "marketing",
    name: "Marketing",
    icon: "📈",
    description: "Tactics, trends, and tools for cutting edge marketers",
    tagline: "Keep up with marketing in 5 minutes",
    role: "expert Marketing Strategist and Growth Analyst",
    topicScope: "digital marketing, growth strategies, SEO, content marketing, and advertising",
    titlePrefix: "Marketing Signals",
    prioritySources: ["Marketing Brew", "Search Engine Journal", "HubSpot Blog", "Moz", "AdWeek"],
    toneNotes: "Data-driven and tactical. Assume the reader is a marketing lead or CMO.",
    exampleSubjects: [
      "Google kills third-party cookies for real this time — what it means for your ads",
      "TikTok's new ad format is outperforming Instagram Reels by 2x",
    ],
  },
  {
    slug: "crypto",
    name: "Crypto",
    icon: "🌐",
    description: "The latest launches, innovations, and market moves in crypto & Web3",
    tagline: "Keep up with crypto in 5 minutes",
    role: "expert Cryptocurrency and Web3 Analyst",
    topicScope: "cryptocurrency, blockchain, DeFi, NFTs, and Web3",
    titlePrefix: "Crypto Signal",
    prioritySources: ["CoinDesk", "The Block", "Decrypt", "Messari", "DeFi Llama"],
    toneNotes: "Market-aware and factual. No shilling. Assume the reader is a crypto-savvy investor or builder.",
    exampleSubjects: [
      "Bitcoin breaks $150K as ETF inflows hit record $2.1B in a day",
      "Ethereum's Pectra upgrade goes live — gas fees drop 40%",
    ],
  },
  {
    slug: "fintech",
    name: "Fintech",
    icon: "💰",
    description: "Innovations and trends in financial markets and technology",
    tagline: "Keep up with fintech in 5 minutes",
    role: "expert Fintech Analyst and Financial Technology Writer",
    topicScope: "fintech, neobanks, payments, lending, and financial technology",
    titlePrefix: "Fintech Wire",
    prioritySources: ["Financial Times", "TechCrunch Fintech", "The Information", "PYMNTS", "American Banker"],
    toneNotes: "Professional and analytical. Assume the reader works in financial services or fintech.",
    exampleSubjects: [
      "Revolut quietly became Europe's most valuable private fintech",
      "Stripe launches banking-as-a-service — and it changes everything",
    ],
  },
  {
    slug: "it",
    name: "IT",
    icon: "💻",
    description: "News and trends in IT strategy, information security, and cloud computing",
    tagline: "Keep up with IT in 5 minutes",
    role: "expert IT Strategy Analyst and Enterprise Technology Writer",
    topicScope: "enterprise IT, cloud computing, IT strategy, and digital transformation",
    titlePrefix: "IT Briefing",
    prioritySources: ["CIO.com", "ZDNet", "Computerworld", "Gartner Blog", "TechTarget"],
    toneNotes: "Strategic and enterprise-focused. Assume the reader is a CTO, CIO, or IT director.",
    exampleSubjects: [
      "Gartner: 60% of enterprises will adopt AI agents by 2027",
      "Microsoft Azure outage exposes single-cloud risk — lessons for IT leaders",
    ],
  },
  {
    slug: "data",
    name: "Data",
    icon: "📊",
    description: "Big data, data science and data engineering",
    tagline: "Keep up with data in 5 minutes",
    role: "expert Data Science and Data Engineering Curator",
    topicScope: "data science, data engineering, analytics, and machine learning infrastructure",
    titlePrefix: "Data Pipeline",
    prioritySources: ["Towards Data Science", "dbt Blog", "Snowflake Blog", "DataEng Weekly", "KDnuggets"],
    toneNotes: "Technical and data-literate. Assume the reader is a data engineer, analyst, or scientist.",
    exampleSubjects: [
      "Snowflake vs Databricks in 2026 — the benchmark nobody talked about",
      "dbt Cloud adds native Python models — SQL purists weigh in",
    ],
  },
  {
    slug: "hardware",
    name: "Hardware",
    icon: "⚙️",
    description: "The latest in robotics, semiconductors and hardware engineering",
    tagline: "Keep up with hardware in 5 minutes",
    role: "expert Hardware and Semiconductor Industry Analyst",
    topicScope: "semiconductors, robotics, hardware engineering, and chip manufacturing",
    titlePrefix: "Hardware Weekly",
    prioritySources: ["IEEE Spectrum", "AnandTech", "Tom's Hardware", "SemiAnalysis", "Reuters Tech"],
    toneNotes: "Technical and industry-aware. Assume the reader is a hardware engineer or industry analyst.",
    exampleSubjects: [
      "TSMC's 2nm process enters mass production — what it means for chips",
      "Boston Dynamics' new humanoid robot walks, runs, and opens doors",
    ],
  },
];

async function seed() {
  const db = await getDb();
  const sections = JSON.stringify(DEFAULT_SECTION_PRESETS.general);

  try {
    for (const topic of TOPICS) {
      const existing = await db.topicProfile.findUnique({
        where: { slug: topic.slug },
      });
      if (existing) {
        console.log(`  ↳ Skipped "${topic.slug}" (already exists)`);
        continue;
      }
      await db.topicProfile.create({
        data: { ...topic, sections },
      });
      console.log(`  ✓ Created "${topic.slug}"`);
    }

    console.log("\nDone.");
  } finally {
    await db.$disconnect();
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
