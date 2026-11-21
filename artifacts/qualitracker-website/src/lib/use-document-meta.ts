import { useEffect } from 'react';
import { withPageSlash } from '@/lib/page-url';

const SITE_ORIGIN = 'https://www.qualitracker.com';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-default.png`;
const DEFAULT_IMAGE_ALT = 'QualiTracker eQMS: quality that works for every laboratory';

interface DocumentMetaOptions {
  image?: string;
  imageAlt?: string;
  locale?: 'en_TZ' | 'sw_TZ';
  robots?: 'index, follow' | 'noindex, follow';
  type?: 'website' | 'article';
}

function absoluteUrl(value: string) {
  return value.startsWith('http://') || value.startsWith('https://')
    ? value
    : `${SITE_ORIGIN}${value.startsWith('/') ? value : `/${value}`}`;
}

/**
 * Per-route <title>, meta description, canonical link, and Open Graph tags
 * for this SPA. index.html only ships one static set (fine for a single-page
 * site, a real SEO gap once the site became 8 routes) — this sets all of
 * them on mount without adding a head-management dependency the existing
 * stack doesn't need.
 *
 * `path` is the route's own absolute path (e.g. "/security") — used to build
 * a correct per-route canonical URL and og:url instead of every route
 * pointing back at the homepage, which is what index.html's static tags do
 * before this hook runs.
 */
export function useDocumentMeta(
  title: string,
  description: string,
  path: string = '/',
  options: DocumentMetaOptions = {},
) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    // Firebase Hosting serves every route with a trailing slash (firebase.json
    // trailingSlash: true) and redirects the bare form, so the canonical must
    // be the slash form or search engines see a redirect and a duplicate.
    const canonicalUrl = `${SITE_ORIGIN}${withPageSlash(path)}`;
    const imageUrl = absoluteUrl(options.image ?? DEFAULT_IMAGE);
    const imageAlt = options.imageAlt ?? DEFAULT_IMAGE_ALT;
    const previousValues: Array<{ element: Element; attribute: string; value: string | null; created: boolean }> = [];

    function setHeadValue(selector: string, tagName: 'meta' | 'link', attribute: string, value: string) {
      let element = document.head.querySelector(selector);
      const created = !element;
      if (!element) {
        element = document.createElement(tagName);
        if (tagName === 'meta') {
          const propertyMatch = selector.match(/meta\[property="([^"]+)"\]/);
          const nameMatch = selector.match(/meta\[name="([^"]+)"\]/);
          if (propertyMatch) element.setAttribute('property', propertyMatch[1]);
          if (nameMatch) element.setAttribute('name', nameMatch[1]);
        } else {
          element.setAttribute('rel', 'canonical');
        }
        document.head.appendChild(element);
      }
      previousValues.push({ element, attribute, value: element.getAttribute(attribute), created });
      element.setAttribute(attribute, value);
    }

    setHeadValue('meta[name="description"]', 'meta', 'content', description);
    setHeadValue('meta[name="robots"]', 'meta', 'content', options.robots ?? 'index, follow');
    setHeadValue('link[rel="canonical"]', 'link', 'href', canonicalUrl);
    setHeadValue('meta[property="og:title"]', 'meta', 'content', title);
    setHeadValue('meta[property="og:description"]', 'meta', 'content', description);
    setHeadValue('meta[property="og:type"]', 'meta', 'content', options.type ?? 'website');
    setHeadValue('meta[property="og:url"]', 'meta', 'content', canonicalUrl);
    setHeadValue('meta[property="og:site_name"]', 'meta', 'content', 'QualiTracker');
    setHeadValue('meta[property="og:locale"]', 'meta', 'content', options.locale ?? 'en_TZ');
    setHeadValue('meta[property="og:image"]', 'meta', 'content', imageUrl);
    setHeadValue('meta[property="og:image:secure_url"]', 'meta', 'content', imageUrl);
    setHeadValue('meta[property="og:image:type"]', 'meta', 'content', 'image/png');
    setHeadValue('meta[property="og:image:width"]', 'meta', 'content', '1200');
    setHeadValue('meta[property="og:image:height"]', 'meta', 'content', '630');
    setHeadValue('meta[property="og:image:alt"]', 'meta', 'content', imageAlt);
    setHeadValue('meta[name="twitter:card"]', 'meta', 'content', 'summary_large_image');
    setHeadValue('meta[name="twitter:title"]', 'meta', 'content', title);
    setHeadValue('meta[name="twitter:description"]', 'meta', 'content', description);
    setHeadValue('meta[name="twitter:image"]', 'meta', 'content', imageUrl);
    setHeadValue('meta[name="twitter:image:alt"]', 'meta', 'content', imageAlt);

    return () => {
      document.title = previousTitle;
      for (const { element, attribute, value, created } of previousValues.reverse()) {
        if (created) element.remove();
        else if (value === null) element.removeAttribute(attribute);
        else element.setAttribute(attribute, value);
      }
    };
  }, [title, description, path, options.image, options.imageAlt, options.locale, options.robots, options.type]);
}

/**
 * Injects a page-specific JSON-LD structured-data block, removed on
 * unmount. Every field passed in must already be a real, established fact
 * elsewhere on the site — this hook doesn't validate that, the caller must.
 * The site-wide Organization schema lives statically in index.html since it
 * doesn't change per route; this is only for schemas specific to one page.
 */
export function useStructuredData(data: Record<string, unknown>) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-route-schema', '');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
}
