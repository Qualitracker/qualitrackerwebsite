import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ChatWidget } from '@/components/site/chat-widget';

describe('ChatWidget (QualiBOT site embed)', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('renders nothing when VITE_QUALIBOT_URL is unset', () => {
    vi.stubEnv('VITE_QUALIBOT_URL', '');
    const { container } = render(<ChatWidget />);
    expect(container).toBeEmptyDOMElement();
  });

  it('opens a lazy-mounted embed iframe for the configured tenant', async () => {
    vi.stubEnv('VITE_QUALIBOT_URL', 'https://api-x.africa-south1.run.app/');
    const user = userEvent.setup();
    render(<ChatWidget />);

    expect(screen.queryByTestId('qualibot-frame')).not.toBeInTheDocument();
    const launcher = screen.getByTestId('qualibot-launcher');
    expect(launcher).toHaveAttribute('aria-expanded', 'false');

    await user.click(launcher);

    expect(launcher).toHaveAttribute('aria-expanded', 'true');
    const frame = screen.getByTestId('qualibot-frame');
    expect(frame).toHaveAttribute(
      'src',
      'https://api-x.africa-south1.run.app/embed/qualitracker/',
    );
    expect(frame).toHaveAttribute('title', 'QualiBOT assistant');
  });

  it('closes on Escape and returns focus to the launcher', async () => {
    vi.stubEnv('VITE_QUALIBOT_URL', 'https://api-x.africa-south1.run.app');
    const user = userEvent.setup();
    render(<ChatWidget />);

    const launcher = screen.getByTestId('qualibot-launcher');
    await user.click(launcher);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(launcher).toHaveFocus();
  });
});
