import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/landing-website";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Daily Tech & AI Newsletter - 2-Min Reads | Abstract",
  description:
    "Get the free daily email with the most interesting stories in AI, startups, and tech — summarized in a quick 2-minute read. Join 12,000+ readers today.",

  metadataBase: new URL("https://getabstract.today"),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://getabstract.today",
    siteName: "Abstract",
    title: "Free Daily Tech & AI Newsletter — Abstract",
    description:
      "We read 100+ sources daily so you don't have to. Get top stories in AI, startups, and tech in a free 2-minute email. Join 12,000+ readers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Abstract - Free Daily Tech & AI Newsletter",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Free Daily Tech & AI Newsletter — Abstract",
    description:
      "Top stories in AI, startups, and tech — summarized in 2 minutes. Free daily email for 12,000+ readers.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },

  keywords: [
    "tech newsletter",
    "AI newsletter",
    "daily tech news",
    "startup newsletter",
    "free tech newsletter",
    "tech news summary",
    "AI news daily",
    "tech email digest",
    "best tech newsletters 2026",
  ],

  applicationName: "Abstract",
  category: "Technology",
  creator: "Abstract",
  publisher: "Abstract",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "Abstract",
                  alternateName: "Abstract Newsletter",
                  url: "https://getabstract.today",
                  description:
                    "Free daily newsletter summarizing the top stories in AI, startups, and tech in a 2-minute read.",
                  publisher: {
                    "@type": "Organization",
                    name: "Abstract",
                    url: "https://getabstract.today",
                    logo: {
                      "@type": "ImageObject",
                      url: "https://getabstract.today/logo.png",
                    },
                  },
                  potentialAction: {
                    "@type": "SubscribeAction",
                    target: "https://getabstract.today/#subscribe",
                    name: "Subscribe to Abstract Newsletter",
                  },
                },
                {
                  "@type": "NewsMediaOrganization",
                  name: "Abstract",
                  url: "https://getabstract.today",
                  description:
                    "A free daily tech newsletter summarizing stories in AI, startups, and tech.",
                  foundingDate: "2026",
                },
              ],
            }),
          }}
        />
        <meta name="theme-color" content="#FF3300" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <div className="h-20 lg:h-20 w-full" aria-hidden />
        {children}
        <Footer />
      </body>
    </html>
  );
}
