import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'wouter';

import LandingPage from '@/pages/landing-page';
import ProductPage from '@/pages/product-page';
import SolutionsPage from '@/pages/solutions-page';
import DocsPage from '@/pages/docs-page';
import CompanyPage from '@/pages/company-page';
import SecurityPage from '@/pages/security-page';
import WaitlistPage from '@/pages/waitlist-page';
import TalkToTeamPage from '@/pages/talk-to-team-page';
import PrivacyPage from '@/pages/privacy-page';
import NotFound from '@/pages/not-found';
import { QualityCommandCenter } from '@/components/product/quality-command-center';
import { LifecycleTimeline } from '@/components/product/lifecycle-timeline';
import { CAPA_STAGES } from '@/lib/lifecycles';

const PAGES: Array<[string, () => React.JSX.Element]> = [
  ['home', LandingPage],
  ['product', ProductPage],
  ['solutions', SolutionsPage],
  ['docs', DocsPage],
  ['company', CompanyPage],
  ['security', SecurityPage],
  ['waitlist', WaitlistPage],
  ['talk to the team', TalkToTeamPage],
  ['privacy', PrivacyPage],
  ['not found', NotFound],
];

describe('copy style', () => {
  it.each(PAGES)('%s page has no em dashes in its visible text', (_name, Page) => {
    render(<Router><Page /></Router>);
    expect(document.body.textContent ?? '').not.toContain('—');
  });
});

describe('canonical URLs', () => {
  it('use the trailing-slash form Firebase serves', () => {
    const link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
    render(<Router><SecurityPage /></Router>);
    expect(link.getAttribute('href')).toBe('https://www.qualitracker.com/security/');
    link.remove();
  });

  it('publishes a complete large-image social preview for every route', () => {
    render(<Router><SecurityPage /></Router>);

    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Security | QualiTracker');
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute('content', 'https://www.qualitracker.com/security/');
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute('content', 'https://www.qualitracker.com/og-default.png');
    expect(document.querySelector('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
    expect(document.querySelector('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
    expect(document.querySelector('meta[property="og:image:alt"]')).toHaveAttribute('content', expect.stringMatching(/QualiTracker eQMS/i));
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    expect(document.querySelector('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://www.qualitracker.com/og-default.png');
  });

  it('marks unknown routes as noindex while keeping useful navigation', () => {
    render(<Router><NotFound /></Router>);

    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });
});

describe('accessibility landmarks', () => {
  it('offers a keyboard-visible skip link to the main content', () => {
    render(<Router><LandingPage /></Router>);

    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main-content');
    expect(document.querySelector('main')).toHaveAttribute('id', 'main-content');
  });
});

describe('Figma-aligned product screen switcher', () => {
  it('moves between command center, documents, and non-conformance screens', async () => {
    const user = userEvent.setup();
    render(<QualityCommandCenter />);
    expect(screen.getByText('Quality Operations Command Center')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /^documents$/i }));
    expect(screen.getByRole('heading', { name: /controlled documents/i })).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /^non-conformance$/i }));
    expect(screen.getByRole('heading', { name: /non-conformances & capa/i })).toBeInTheDocument();
  });
});

describe('lifecycle stepper', () => {
  it('moves with Next and Back and shows every stage without scrolling', async () => {
    const user = userEvent.setup();
    render(<LifecycleTimeline stages={CAPA_STAGES} />);
    expect(screen.getByText(/step 1 of 7/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText(/step 2 of 7/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText(/step 1 of 7/i)).toBeInTheDocument();
    expect(screen.getByTestId('lifecycle-stage-6')).toHaveTextContent('Closed');
  });
});
