import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const categories = [
  {
    id: "ai",
    icon: "🧠",
    title: "AI",
    description:
      "Launches, innovations, and research for AI, machine learning, and data science professionals",
    comingSoon: false,
  },
  {
    id: "startups",
    icon: "👥",
    title: "Startups, Tech & Programming",
    description:
      "The most interesting stories in tech, startups, and programming",
    comingSoon: true,
  },
  {
    id: "dev",
    icon: "☁️",
    title: "Dev",
    description:
      "Curated deep dives, tools, and trends in frontend, backend, and full stack web development",
    comingSoon: true,
  },
  {
    id: "infosec",
    icon: "🔒",
    title: "Information Security",
    description:
      "News, research, and tools for information security professionals",
    comingSoon: true,
  },
  {
    id: "product",
    icon: "👥",
    title: "Product Management",
    description: "Deep dives, trends, and resources for product managers",
    comingSoon: true,
  },
  {
    id: "devops",
    icon: "☁️",
    title: "DevOps",
    description: "Tools, trends, and insights for DevOps engineers",
    comingSoon: true,
  },
  {
    id: "founders",
    icon: "👑",
    title: "Founders",
    description:
      "Tactics, trends, and tools for startup founders and entrepreneurs",
    comingSoon: true,
  },
  {
    id: "design",
    icon: "🎨",
    title: "Design",
    description: "Tools, trends, and inspiration for designers",
    comingSoon: true,
  },
  {
    id: "marketing",
    icon: "📈",
    title: "Marketing",
    description: "Tactics, trends, and tools for cutting edge marketers",
    comingSoon: true,
  },
  {
    id: "crypto",
    icon: "🌐",
    title: "Crypto",
    description:
      "The latest launches, innovations, and market moves in crypto & Web3",
    comingSoon: true,
  },
  {
    id: "fintech",
    icon: "💰",
    title: "Fintech",
    description: "Innovations and trends in financial markets and technology",
    comingSoon: true,
  },
  {
    id: "it",
    icon: "💻",
    title: "IT",
    description:
      "News and trends in IT strategy, information security, and cloud computing",
    comingSoon: true,
  },
  {
    id: "data",
    icon: "📊",
    title: "Data",
    description: "Big data, data science and data engineering",
    comingSoon: true,
  },
  {
    id: "hardware",
    icon: "⚙️",
    title: "Hardware",
    description:
      "The latest in robotics, semiconductors and hardware engineering",
    comingSoon: true,
  },
];

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Subtle gradient mesh background */}
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,rgba(99,102,241,0.06),transparent)]"
        aria-hidden
      />

      <header className="relative border-b border-white/6 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-white transition hover:text-neutral-300"
          >
            abstract
          </Link>
          <Link
            href="/newsletters"
            className="text-sm font-medium text-neutral-400 transition hover:text-white"
          >
            Newsletters
          </Link>
        </nav>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className="group relative overflow-hidden border-white/6 bg-white/3 shadow-none ring-1 ring-white/6 transition duration-200 hover:bg-white/6 hover:ring-white/10 data-[coming-soon=true]:opacity-95"
              data-coming-soon={cat.comingSoon}
            >
              <CardHeader className="gap-3 pb-1">
                <span
                  className="text-2xl opacity-90 transition group-hover:scale-110"
                  aria-hidden
                >
                  {cat.icon}
                </span>
                <CardTitle className="flex flex-wrap items-start justify-between gap-2 text-[15px] font-semibold leading-snug text-white">
                  <span>{cat.title}</span>
                  {cat.comingSoon && (
                    <span className="inline-flex shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                      Coming soon
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-[13px] leading-relaxed text-neutral-500">
                  {cat.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
