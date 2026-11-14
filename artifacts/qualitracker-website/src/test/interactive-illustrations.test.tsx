import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QualityIntelligenceGraph } from '@/components/product/quality-intelligence-graph';
import { RagPipelineScroll } from '@/components/product/rag-pipeline-scroll';

describe('interactive product illustrations', () => {
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
});
