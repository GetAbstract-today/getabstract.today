import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCategoryById, isCategoryId } from "@/lib/newsletter-categories";
import { NewsletterContent } from "./NewsletterContent";
import { SubscribeForm } from "@/components/subscribe-form";
import { NoiseOverlay } from "@/components/landing-website";

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

type Props = { params: Promise<{ id: string }> };

export default async function NewsletterReadPage({ params }: Props) {
  const { id } = await params;

  // Category landing page – subscription with landing design
  if (isCategoryId(id)) {
    const category = getCategoryById(id);
    if (!category) notFound();

    return (
      <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
        <NoiseOverlay />
        <main className="flex-1 w-full border-beam-b bg-[#E6E6E6] flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-xl relative z-10 bg-white border-beam p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-6 border-beam-b pb-4">
              <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center bg-white shrink-0">
                <category.Icon
                  strokeWidth={1.5}
                  className="text-3xl text-[#FF3300] w-8 h-8"
                />
              </div>
              <h1 className="text-3xl font-extrabold uppercase tracking-tight-custom">
                {category.title}
              </h1>
            </div>
            <p className="font-tech text-xs uppercase mb-2 text-[#FF3300] tracking-widest">
              {category.tagline}
            </p>
            <p className="font-medium text-[#1A1A1A] leading-relaxed mb-8">
              {category.description}
            </p>
            <div className="border-beam-t pt-6">
              <SubscribeForm
                mode="single"
                category={id}
                placeholder="AUTHORIZATION [EMAIL]"
                buttonText="Subscribe"
                caption="Join thousands of readers for one daily email."
                className="flex flex-col gap-3 w-full"
                formClassName="flex flex-col sm:flex-row gap-3 w-full border-2 border-black"
                inputClassName="bg-[#E6E6E6] p-4 font-tech text-sm text-black outline-none placeholder:text-gray-500 focus:bg-white border-0 rounded-none min-h-12 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                buttonClassName="bg-black text-white font-bold uppercase px-8 py-4 hover:bg-[#FF3300] transition-colors duration-0 border-2 border-black rounded-none min-h-12 shrink-0"
                successClassName="text-[#1A1A1A] font-medium"
                errorClassName="text-[#FF3300] font-tech text-xs uppercase"
              />
            </div>
            <Link
              href="/newsletters"
              className="mt-6 inline-block font-tech text-xs uppercase text-gray-500 hover:text-black transition-colors"
            >
              ← Back to directory
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Newsletter document (read view) – same landing shell, brutalist content box
  const newsletter = await prisma.newsletter.findUnique({
    where: { id },
  });

  if (!newsletter) notFound();

  return (
    <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <main className="flex-1 w-full border-beam-b bg-[#E6E6E6] px-6 lg:px-12 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 font-tech text-xs uppercase tracking-widest text-gray-500">
            {capitalize(newsletter.category)} ·{" "}
            {formatDate(newsletter.createdAt)}
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold uppercase tracking-tight-custom mb-8">
            {capitalize(newsletter.category)} Newsletter
          </h1>
          <div className="bg-white border-beam p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <NewsletterContent content={newsletter.content} variant="light" />
          </div>
          <Link
            href="/newsletters"
            className="mt-6 inline-block font-tech text-xs uppercase text-gray-500 hover:text-black transition-colors"
          >
            ← Back to newsletters
          </Link>
        </div>
      </main>
    </div>
  );
}
