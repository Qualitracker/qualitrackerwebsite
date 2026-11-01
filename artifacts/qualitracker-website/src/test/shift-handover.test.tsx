import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ShiftHandover } from '@/components/product/shift-handover';

describe('ShiftHandover', () => {
  it('loses notes on paper and keeps all of them digitally', async () => {
    const user = userEvent.setup();
    render(<ShiftHandover />);

    await user.click(screen.getByTestId('button-handover'));
    expect(screen.getByText(/2 of 4 notes arrived/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /with qualitracker/i }));
    expect(screen.queryByText(/notes arrived/i)).not.toBeInTheDocument();

    await user.click(screen.getByTestId('button-handover'));
    expect(screen.getByText(/all 4 notes arrived/i)).toBeInTheDocument();
  });
});
