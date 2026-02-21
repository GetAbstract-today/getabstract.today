"use client";

import { Streamdown } from "streamdown";

export function NewsletterContent({ content }: { content: string }) {
  return (
    <Streamdown className="prose prose-invert max-w-none dark:prose-invert">
      {content}
    </Streamdown>
  );
}
