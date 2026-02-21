import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCategoryById, isCategoryId } from "@/lib/newsletter-categories";
import { NewsletterContent } from "./NewsletterContent";
import { SubscribeForm } from "@/components/subscribe-form";

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

const sharedLayout = (
  <>
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
  </>
);

type Props = { params: Promise<{ id: string }> };

export default async function NewsletterReadPage({ params }: Props) {
  const { id } = await params;

  // Category landing page (Abstract [Category] – subscription style)
  if (isCategoryId(id)) {
    const category = getCategoryById(id);
    if (!category) notFound();

    return (
      <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
        {sharedLayout}
        <main className="relative flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mx-auto flex max-w-md flex-col items-center gap-6">
            <span
              className="text-3xl opacity-90"
              aria-hidden
            >
              {category.icon}
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Abstract {category.title}
            </h1>
            <p className="text-lg text-neutral-300">
              {category.tagline}
            </p>
            <p className="text-sm leading-relaxed text-neutral-400">
              {category.description}
            </p>
            <div className="mt-2">
              <SubscribeForm
                category={id}
                placeholder="Email Address"
                buttonText="Sign Up"
                caption="Join thousands of readers for one daily email"
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Newsletter document (existing read view)
  const newsletter = await prisma.newsletter.findUnique({
    where: { id },
  });

  if (!newsletter) notFound();

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      {sharedLayout}

      <main className="relative mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">
            {capitalize(newsletter.category)} · {formatDate(newsletter.createdAt)}
          </p>
          <h1 className="mt-1 text-xl font-semibold text-white">
            {capitalize(newsletter.category)} Newsletter
          </h1>
        </div>
        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 px-4 py-6 ring-1 ring-white/10">
          <NewsletterContent content={newsletter.content} />
        </div>
      </main>
    </div>
  );
}
