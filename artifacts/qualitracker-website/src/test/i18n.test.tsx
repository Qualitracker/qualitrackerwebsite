import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'wouter';

import LandingPage from '@/pages/landing-page';
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
});
