import type { KeyboardEvent } from 'react';

export function navigateTabs(event: KeyboardEvent<HTMLElement>) {
  const tab = (event.target as HTMLElement).closest<HTMLButtonElement>('button[role="tab"]');
  if (!tab || tab.closest('[role="tablist"]') !== event.currentTarget) return;

  const vertical = event.currentTarget.getAttribute('aria-orientation') === 'vertical';
  const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button[role="tab"]:enabled'));
  const index = tabs.indexOf(tab);
  if (index < 0) return;

  let next: number;
  switch (event.key) {
    case vertical ? 'ArrowUp' : 'ArrowLeft':
      next = (index + tabs.length - 1) % tabs.length;
      break;
    case vertical ? 'ArrowDown' : 'ArrowRight':
      next = (index + 1) % tabs.length;
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = tabs.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  tabs[next].focus();
  if (tabs[next].getAttribute('aria-selected') !== 'true') tabs[next].click();
}
