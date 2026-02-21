import Link from "next/link";
import { prisma } from "@/lib/db";
import { getOpenGraphImageUrl } from "@/lib/og-image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscribeForm } from "@/components/subscribe-form";

const URL_LIMIT = 50;
const CATEGORY_ORDER = [
  "ai",
  "startups",
  "tech",
  "dev",
  "product",
  "infosec",
  "devops",
  "founders",
  "design",
  "marketing",
  "crypto",
  "fintech",
  "it",
  "data",
  "hardware",
];

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getUrlLabel(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url.length > 40 ? `${url.slice(0, 40)}…` : url;
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default async function Page() {
  const urls = await prisma.url.findMany({
    orderBy: { date: "desc" },
    take: URL_LIMIT,
  });

  const byCategory = urls.reduce<Record<string, typeof urls>>(
    (acc, u) => {
      const c = u.category.toLowerCase();
      if (!acc[c]) acc[c] = [];
      acc[c].push(u);
      return acc;
    },
    {}
  );

  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => byCategory[c]?.length),
    ...Object.keys(byCategory).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  // Fetch Open Graph (og:image) / link preview image for each URL in parallel
  const imageResults = await Promise.allSettled(
    urls.map((u) => getOpenGraphImageUrl(u.url))
  );
  const imageByIndex = new Map<number, string | null>(
    imageResults.map((r, i) => [i, r.status === "fulfilled" ? r.value : null])
  );
  const getImageUrl = (url: (typeof urls)[0]) => {
    const idx = urls.findIndex((u) => u.id === url.id);
    return idx >= 0 ? imageByIndex.get(idx) ?? null : null;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
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

      <main className="relative mx-auto max-w-6xl px-6 py-10">
        {/* Hero */}
        <section className="mb-12">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Keep up with tech in 5 minutes.
          </h1>
          <p className="mb-6 text-lg text-neutral-400">
            Get the free daily email with summaries of the most interesting
            stories in startups, tech, and programming.
          </p>
          <SubscribeForm
            mode="landing"
            placeholder="Email Address"
            buttonText="Subscribe"
            caption="Join readers for one daily email."
            className="mt-0"
            inputClassName="max-w-md bg-white/5 border-white/10"
            buttonClassName="bg-violet-600 hover:bg-violet-500"
          />
        </section>
        {/* More Stories: one horizontal-scroll row per category, 4 columns */}
        {orderedCategories.length > 0 && (
          <section>
            <h2 className="mb-6 text-xl font-semibold text-white">
              More Stories
            </h2>
            <div className="space-y-8">
              {orderedCategories.map((cat) => (
                <div key={cat}>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-violet-400">
                    {capitalize(cat)}
                  </h3>
                  <div
                    className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
                    style={{ scrollbarGutter: "stable" }}
                  >
                    {byCategory[cat].map((item) => {
                      const imageUrl = getImageUrl(item);
                      return (
                        <Card
                          key={item.id}
                          className="min-w-[280px] max-w-[280px] shrink-0 border-white/10 bg-white/5 ring-1 ring-white/10 overflow-hidden"
                        >
                          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-neutral-900">
                            {imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imageUrl}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div
                                className="flex h-full w-full items-center justify-center text-neutral-600"
                                aria-hidden
                              >
                                <span className="text-xs">
                                  {getUrlLabel(item.url)}
                                </span>
                              </div>
                            )}
                          </div>
                          <CardHeader className="gap-1 py-3">
                          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                            {formatDate(item.date)} | {capitalize(item.category)}
                          </p>
                          <CardTitle className="text-sm font-semibold">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white hover:text-violet-300 underline-offset-4 hover:underline line-clamp-2"
                            >
                              {getUrlLabel(item.url)}
                            </a>
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {urls.length === 0 && (
          <p className="text-center text-neutral-500 py-12">
            No stories yet. Generate a newsletter to populate URLs.
          </p>
        )}
      </main>
    </div>
  );
}
