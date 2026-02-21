/**
 * Fetches a URL's HTML and extracts the Open Graph image (og:image) or
 * Twitter card image (twitter:image). This is the "banner" / link preview
 * image sites set for social sharing.
 */
const FETCH_TIMEOUT_MS = 2500;

export async function getOpenGraphImageUrl(pageUrl: string): Promise<string | null> {
  let html: string;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(pageUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AbstractBot/1.0; +https://getabstract.today)",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    return null;
  }

  const baseUrl = new URL(pageUrl);
  const ogImage = parseMetaImage(html, baseUrl);
  return ogImage;
}

function parseMetaImage(html: string, baseUrl: URL): string | null {
  // og:image: <meta property="og:image" content="...">
  const ogMatch = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
  );
  if (ogMatch?.[1]) return resolveUrl(ogMatch[1].trim(), baseUrl);

  // content before property (some sites order differently)
  const ogMatch2 = html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
  );
  if (ogMatch2?.[1]) return resolveUrl(ogMatch2[1].trim(), baseUrl);

  // twitter:image: <meta name="twitter:image" content="...">
  const twMatch = html.match(
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
  );
  if (twMatch?.[1]) return resolveUrl(twMatch[1].trim(), baseUrl);

  const twMatch2 = html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
  );
  if (twMatch2?.[1]) return resolveUrl(twMatch2[1].trim(), baseUrl);

  return null;
}

function resolveUrl(href: string, base: URL): string {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}
