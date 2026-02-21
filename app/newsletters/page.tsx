import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { newsletterCategories } from "@/lib/newsletter-categories";

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
          {newsletterCategories.map((cat) => (
            <Link key={cat.id} href={`/newsletters/${cat.id}`}>
              <Card
                className="group relative overflow-hidden border-white/6 bg-white/3 shadow-none ring-1 ring-white/6 transition duration-200 hover:bg-white/6 hover:ring-white/10 data-[coming-soon=true]:opacity-95 cursor-pointer"
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
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
