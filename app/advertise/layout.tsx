import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertise | Abstract",
  description:
    "Reach thousands of engaged tech professionals daily. Sponsor Abstract newsletters in AI, startups, cybersecurity, fintech, and more.",
};

export default function AdvertiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
