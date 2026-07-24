import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { Button } from './Button';
import { RouterProvider } from '../../app/router';

describe('Button', () => {
  it('renders as a button and handles clicks', () => {
    const onClick = vi.fn();
    render(
      <RouterProvider>
        <Button onClick={onClick}>Save</Button>
      </RouterProvider>,
    );

    screen.getByRole('button', { name: 'Save' }).click();

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders internal hrefs as links and navigates via the router', () => {
    render(
      <RouterProvider>
        <Button href="/videos">Browse videos</Button>
      </RouterProvider>,
    );

    const link = screen.getByRole('link', { name: 'Browse videos' });
    expect(link).toHaveAttribute('href', '/videos');
  });

  it('opens external hrefs in a new tab', () => {
    render(
      <RouterProvider>
        <Button href="https://example.com">External</Button>
      </RouterProvider>,
    );

    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
      'target',
      '_blank',
    );
  });
});
