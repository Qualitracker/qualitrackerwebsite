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
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'A digital quality-management system for laboratories: document control, quality records, and QualiBOT, an AI assistant grounded in a lab’s own documents.',
  publisher: { '@type': 'Organization', name: 'Qualitracker Limited' },
};
