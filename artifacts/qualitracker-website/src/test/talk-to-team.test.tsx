import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'wouter';

import TalkToTeamPage from '@/pages/talk-to-team-page';

describe('Talk to the team routes', () => {
  it('picking a route shows who usually handles it and fills the form select', async () => {
    const user = userEvent.setup();
    render(<Router><TalkToTeamPage /></Router>);

    await user.click(screen.getByTestId('route-technical-integration'));

    expect(screen.getByTestId('route-detail')).toHaveTextContent(/usually handled by · technology/i);
    expect(screen.getByTestId('select-talk-category')).toHaveValue('Technical integration');
  });
});
