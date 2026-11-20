import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QualityIntelligenceGraph } from '@/components/product/quality-intelligence-graph';
import { RagPipelineScroll } from '@/components/product/rag-pipeline-scroll';
import { ProductTheatre } from '@/components/product/product-theatre';
import { AskQualiTrackerDemo } from '@/components/product/ask-qualitracker-demo';

describe('interactive product illustrations', () => {
  // Value: protects=custom questions are preserved and cannot receive unrelated audit answers;
  // fails_when=Send replays the selected preset; why_new=the locale test sends a preset;
  // seam=none; no_claim=the response is a local demo, not a live retrieval check.
  it('keeps a submitted custom question and declines to answer it from the sample audit', async () => {
    const user = userEvent.setup();
    const question = 'Can you compare this lab with another lab?';
    render(<AskQualiTrackerDemo />);

    const input = screen.getByRole('textbox', { name: 'Ask QualiBOT a question' });
    await user.clear(input);
    await user.type(input, question);
    await user.click(screen.getByRole('button', { name: 'Send question' }));

    expect(await screen.findByText(/couldn't find a relevant record/i)).toBeInTheDocument();
    expect(screen.getByText(question)).toBeInTheDocument();
    expect(screen.queryByText('CAPA-014')).not.toBeInTheDocument();
  });

  it('lets touch and keyboard users lock a quality-graph node and inspect its relationships', async () => {
    const user = userEvent.setup();
    render(<QualityIntelligenceGraph />);

    const capaControl = screen.getByTestId('graph-control-capa');
    await user.click(capaControl);

    expect(capaControl).toHaveAttribute('aria-pressed', 'true');
    expect(within(screen.getByTestId('graph-detail')).getByText('CAPA')).toBeInTheDocument();
    expect(screen.getByTestId('graph-detail')).toHaveTextContent(/corrective action assigned/i);
    expect(screen.getByTestId('graph-detail')).toHaveTextContent(/verification/i);

    screen.getByTestId('graph-node-standard').focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByTestId('graph-node-document')).toHaveFocus();
  });

  it('lets visitors move directly through the retrieval pipeline', async () => {
    const user = userEvent.setup();
    render(<RagPipelineScroll />);

    await user.click(screen.getByTestId('pipeline-step-4'));
    expect(screen.getByTestId('pipeline-progress')).toHaveTextContent('Step 4/7');
    expect(screen.getByTestId('pipeline-step-4')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('answer-row-4')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('answer-row-5')).toHaveAttribute('data-active', 'false');

    await user.click(screen.getByRole('button', { name: 'Next stage' }));
    expect(screen.getByTestId('pipeline-progress')).toHaveTextContent('Step 5/7');
    expect(screen.getByTestId('answer-row-5')).toHaveAttribute('data-active', 'true');
  });

  it('frames product UI without replacing or blocking its controls', async () => {
    const user = userEvent.setup();
    render(
      <ProductTheatre
        label="Product surface"
        status="Interactive"
        caption="Workspace"
        detail="Source linked"
        markers={['Dashboard', 'Documents']}
      >
        <button type="button">Open document</button>
      </ProductTheatre>,
    );

    const control = screen.getByRole('button', { name: 'Open document' });
    await user.click(control);

    expect(control).toBeEnabled();
    expect(document.querySelector('[data-theatre="application"]')).toContainElement(control);
    expect(screen.getByText('Product surface')).toBeInTheDocument();
  });
});
