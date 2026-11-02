import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';

import { submitLead } from '@/lib/leads';
import PrivacyPage from '@/pages/privacy-page';
import { SiteFooter } from '@/components/site/site-footer';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('form delivery on a static site', () => {
  it('sends Talk to the team through EmailJS and never to a relative /api URL', async () => {
    const calls: string[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
      calls.push(url);
      const body = JSON.parse(String(init?.body));
      expect(body.template_params.organization_type).toBe('Talk to the team inquiry');
      expect(body.template_params.expectations).toContain('Inquiry: Technical integration');
      return new Response('OK');
    }));

    await submitLead({
      kind: 'talk_to_team',
      email: 'jane@example.org',
      firstName: 'Jane',
      message: 'Inquiry: Technical integration\n\nHow would it fit our LIS?',
      source: 'talk-to-team-page',
      consent: true,
    });

    expect(calls).toEqual(['https://api.emailjs.com/api/v1.0/email/send']);
  });

  it('surfaces a failed email send instead of reporting success', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('error', { status: 400 })));
    await expect(
      submitLead({ kind: 'talk_to_team', email: 'jane@example.org', firstName: 'Jane', message: 'Hi', source: 'x', consent: true }),
    ).rejects.toThrow('SUBMIT_FAILED');
  });

  it('refuses kinds the static site cannot deliver, without any network call', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(
      submitLead({ kind: 'newsletter', email: 'jane@example.org', source: 'x', consent: true }),
    ).rejects.toThrow('UNSUPPORTED_NEWSLETTER');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('privacy notice', () => {
  it('describes the two forms and EmailJS, and is linked from the footer', () => {
    render(<Router><PrivacyPage /></Router>);
    expect(screen.getByRole('heading', { name: /privacy notice/i })).toBeInTheDocument();
    expect(screen.getByText(/only what you type into the two forms/i)).toBeInTheDocument();
    expect(screen.getAllByText(/emailjs/i).length).toBeGreaterThan(0);
  });

  it('has a footer link', () => {
    render(<Router><SiteFooter /></Router>);
    expect(screen.getByTestId('link-footer-privacy')).toHaveAttribute('href', '/privacy');
  });
});
