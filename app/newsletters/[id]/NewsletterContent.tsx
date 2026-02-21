"use client";

import { Streamdown } from "streamdown";

export function NewsletterContent({
  content,
  variant = "dark",
}: {
  content: string;
  variant?: "dark" | "light";
}) {
  const proseClass =
    variant === "light"
      ? "prose prose-neutral max-w-none"
      : "prose prose-invert max-w-none dark:prose-invert";
  return <Streamdown className={proseClass}>{content}</Streamdown>;
}
