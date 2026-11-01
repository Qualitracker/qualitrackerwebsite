import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ModuleMap } from '@/components/product/module-map';

describe('ModuleMap', () => {
  it('places modules in their stage lanes and says nothing is live yet', () => {
    render(<ModuleMap />);
    expect(screen.getByText(/nothing is live yet/i)).toBeInTheDocument();
    expect(screen.getByTestId('row-capability-document-sop-control')).toBeInTheDocument();
  });

  it('shows the selected module with its stage, and keeps QualiBOT out of the beta', async () => {
    const user = userEvent.setup();
    render(<ModuleMap />);

    await user.click(screen.getByTestId('row-capability-ai-assistant-qualibot-'));

    expect(screen.getByText(/not part of the november beta/i)).toBeInTheDocument();
    expect(screen.getByTestId('status-badge-in-development')).toBeInTheDocument();
  });
});
