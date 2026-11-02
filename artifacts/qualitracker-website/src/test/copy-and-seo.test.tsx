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
    expect(link.getAttribute('href')).toBe('https://qualitracker.com/security/');
    link.remove();
  });
});

describe('dashboard role switcher', () => {
  it('shows different numbers for each role', async () => {
    const user = userEvent.setup();
    render(<QualityCommandCenter />);
    expect(screen.getByText('Laboratories')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /technologist/i }));
    expect(screen.getByText('Records to complete today')).toBeInTheDocument();
    expect(screen.queryByText('Laboratories')).not.toBeInTheDocument();
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
