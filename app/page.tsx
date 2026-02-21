import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const categories = [
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
    id: "ai",
    icon: "🧠",
    title: "AI",
    description:
      "Launches, innovations, and research for AI, machine learning, and data science professionals",
    comingSoon: false,
  },
  {
    id: "infosec",
    icon: "🔒",
    title: "Information Security",
    description: "News, research, and tools for information security professionals",
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80">
        <nav className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white hover:text-zinc-300"
          >
            abstract
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/newsletters"
              className="text-sm text-zinc-400 hover:text-zinc-200"
            >
              Newsletters
            </Link>
            <Link
              href="/advertise"
              className="text-sm text-zinc-400 hover:text-zinc-200"
            >
              Advertise
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className="border-zinc-800 bg-zinc-900/50 ring-zinc-800 transition hover:border-zinc-700 hover:bg-zinc-900/80 data-[coming-soon=true]:opacity-90"
              data-coming-soon={cat.comingSoon}
            >
              <CardHeader className="gap-2">
                <span className="text-2xl" aria-hidden>
                  {cat.icon}
                </span>
                <CardTitle className="flex items-baseline justify-between gap-2 text-base font-semibold text-zinc-100">
                  {cat.title}
                  {cat.comingSoon && (
                    <span className="shrink-0 text-xs font-normal text-zinc-500">
                      (Coming Soon)
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-sm text-zinc-400">
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
