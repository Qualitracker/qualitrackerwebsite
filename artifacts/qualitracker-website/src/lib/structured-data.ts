/**
 * Shared JSON-LD fragments, used with useStructuredData (use-document-meta.ts)
 * on whichever pages actually describe the product. Real facts only: no
 * offers/price (none exists — pricing was deliberately removed sitewide)
 * and no aggregateRating (no reviews exist to report).
 */
export const SOFTWARE_APPLICATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'QualiTracker eQMS',
  url: 'https://www.qualitracker.com/product/',
  image: 'https://www.qualitracker.com/og-default.png',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  inLanguage: ['en', 'sw'],
  description: 'A digital quality-management system for laboratories: document control, quality records, and QualiBOT, an AI assistant grounded in a lab’s own documents.',
  publisher: { '@id': 'https://www.qualitracker.com/#organization' },
};
