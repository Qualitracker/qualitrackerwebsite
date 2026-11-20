import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
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
import { I18nProvider } from '@/lib/i18n';

function renderLanding() {
  return render(
    <I18nProvider>
      <Router>
        <LandingPage />
      </Router>
    </I18nProvider>,
  );
}

describe('language toggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = 'en';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults to English', () => {
    renderLanding();
    expect(screen.getByRole('heading', { name: /quality that works for every lab/i })).toBeInTheDocument();
  });

  it('switches the hero and html lang to Swahili, and remembers the choice', async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.click(screen.getAllByTestId('button-lang-toggle')[0]);

    expect(screen.getByRole('heading', { name: /ubora unaofanya kazi kwa kila maabara/i })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('sw');
    expect(window.localStorage.getItem('qt-lang')).toBe('sw');
  });

  it('switches the shared interactive sections to Swahili too', async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.click(screen.getAllByTestId('button-lang-toggle')[0]);

    expect(screen.getByText('Quality Operations Command Center')).toBeInTheDocument();
    expect(screen.getByText('Hifadhi ya pamoja / karatasi')).toBeInTheDocument();
    expect(screen.getByText('Beta ya faragha ya eQMS inaanza')).toBeInTheDocument();
    expect(screen.getByText('Uliza QualiBOT')).toBeInTheDocument();
    expect(screen.getByText('Weka kielekezi, lenga, au gusa nodi kuona muhtasari. Ichague ili mahusiano yake yaendelee kuonekana.')).toBeInTheDocument();
  });

  // Value: protects=the RAG demo selects its response from stable UI state, not English copy;
  // fails_when=the Swahili out-of-scope question is parsed with an English-only keyword;
  // why_new=route localization tests do not exercise the demo's asynchronous response choice;
  // seam=the illustrative demo remains deterministic and does not call a live AI service.
  it('keeps the Swahili out-of-scope demo response when the question is sent', async () => {
    const user = userEvent.setup();
    renderLanding();
    await user.click(screen.getAllByTestId('button-lang-toggle')[0]);
    await user.click(screen.getByText('Nje ya wigo'));

    await waitFor(() => expect(screen.getByText(/Sikuweza kupata rekodi inayohusika/i)).toBeInTheDocument());
    await user.click(screen.getByTestId('button-send-ask'));

    await waitFor(() => expect(screen.getByText(/Sikuweza kupata rekodi inayohusika/i)).toBeInTheDocument());
    expect(within(screen.getByTestId('ask-qualitracker-demo')).queryByText(/CAPA-014/)).not.toBeInTheDocument();
  });

  // Value: protects=a saved Swahili choice is applied on the first render;
  // fails_when=provider initialization stops reading qt-lang or paints English first;
  // why_new=the toggle test only checks the write, not a new provider reading it;
  // seam=none; no_claim=translation accuracy still requires fluent human review.
  it('starts in the saved language without an English-first render', () => {
    window.localStorage.setItem('qt-lang', 'sw');

    renderLanding();

    expect(screen.getByRole('heading', { name: /ubora unaofanya kazi kwa kila maabara/i })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('sw');
  });

  // Value: protects=every public route renders its localized primary heading;
  // fails_when=a page bypasses I18nProvider helpers or a localized value is rendered as an object;
  // why_new=the existing route smoke test renders only the English context fallback;
  // seam=none; no_claim=translation accuracy and browser layout remain human-review work.
  it('renders every public route in Swahili', () => {
    window.localStorage.setItem('qt-lang', 'sw');

    const pages: Array<{ Component: () => React.JSX.Element; heading: RegExp }> = [
      { Component: LandingPage, heading: /ubora unaofanya kazi kwa kila maabara/i },
      { Component: ProductPage, heading: /jukwaa, moduli kwa moduli/i },
      { Component: SolutionsPage, heading: /imejengwa kwa kazi za maabara zinazohitaji ubora wa hali ya juu/i },
      { Component: DocsPage, heading: /utangulizi/i },
      { Component: CompanyPage, heading: /imejengwa afrika mashariki, kwa ajili ya afrika mashariki/i },
      { Component: SecurityPage, heading: /mipaka ya usalama ni sehemu ya beta/i },
      { Component: WaitlistPage, heading: /tuambie kuhusu maabara yako/i },
      { Component: TalkToTeamPage, heading: /ongea na timu/i },
      { Component: PrivacyPage, heading: /taarifa ya faragha/i },
      { Component: NotFound, heading: /ukurasa haujapatikana/i },
    ];

    for (const { Component, heading } of pages) {
      const view = render(
        <I18nProvider>
          <Router>
            <Component />
          </Router>
        </I18nProvider>,
      );
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
      view.unmount();
    }
  });

  // Value: protects=blocked browser storage falls back to a usable English site;
  // fails_when=the storage read exception escapes provider initialization;
  // why_new=no existing test exercises the provider's getItem catch branch;
  // seam=none; no_claim=behavior in a specific browser privacy mode is simulated.
  it('falls back to English when reading browser storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
      throw new DOMException('Storage blocked');
    });

    renderLanding();

    expect(screen.getByRole('heading', { name: /quality that works for every lab/i })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en');
  });

  // Value: protects=language switching still works when the preference cannot be persisted;
  // fails_when=the storage write exception prevents the state and html language update;
  // why_new=no existing test exercises the provider's setItem catch branch;
  // seam=none; no_claim=behavior in a specific browser privacy mode is simulated.
  it('switches language even when writing browser storage is blocked', async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('Storage blocked');
    });
    renderLanding();

    await user.click(screen.getAllByTestId('button-lang-toggle')[0]);

    expect(screen.getByRole('heading', { name: /ubora unaofanya kazi kwa kila maabara/i })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('sw');
  });
});
