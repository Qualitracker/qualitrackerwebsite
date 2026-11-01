import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'wouter';

import DocsPage from '@/pages/docs-page';
import SecurityPage from '@/pages/security-page';

describe('Docs page', () => {
  it('shows the real document and CAPA lifecycles, and a useful placeholder elsewhere', async () => {
    const user = userEvent.setup();
    render(<Router><DocsPage /></Router>);

    await user.click(screen.getByTestId('link-docs-documents'));
    expect(screen.getByRole('heading', { name: 'Documents' })).toBeInTheDocument();
    expect(screen.getAllByText(/pending collaboration/i).length).toBeGreaterThan(0);

    await user.click(screen.getByTestId('link-docs-capa'));
    expect(screen.getAllByText(/pending review 2/i).length).toBeGreaterThan(0);

    await user.click(screen.getByTestId('link-docs-risk'));
    expect(screen.getByText(/in the meantime/i)).toBeInTheDocument();
  });
});

describe('Security page data path', () => {
  it('walks the four practices in data-flow order', async () => {
    const user = userEvent.setup();
    render(<Router><SecurityPage /></Router>);

    expect(screen.getByRole('heading', { name: /pii redaction before indexing/i })).toBeInTheDocument();
    await user.click(screen.getByTestId('security-practice-self-hosted-inference'));
    expect(screen.getByRole('heading', { name: /self-hosted inference/i })).toBeInTheDocument();
  });
});
