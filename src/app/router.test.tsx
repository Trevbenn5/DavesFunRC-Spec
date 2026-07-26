import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { RouterProvider, useRouter } from './router';

const trackPageView = vi.hoisted(() => vi.fn());
vi.mock('../services/analytics.service', () => ({ trackPageView }));

function NavigateButton({ to }: { to: string }) {
  const { navigate } = useRouter();
  return (
    <button type="button" onClick={() => navigate(to)}>
      Go to {to}
    </button>
  );
}

describe('RouterProvider page-view tracking', () => {
  it('tracks the initial path on mount', () => {
    window.history.replaceState(null, '', '/about');
    trackPageView.mockClear();

    render(
      <RouterProvider>
        <div>content</div>
      </RouterProvider>,
    );

    expect(trackPageView).toHaveBeenCalledWith('/about');
  });

  it('tracks the new path when navigate() is called', () => {
    trackPageView.mockClear();

    render(
      <RouterProvider>
        <NavigateButton to="/videos" />
      </RouterProvider>,
    );
    trackPageView.mockClear();

    fireEvent.click(screen.getByRole('button', { name: 'Go to /videos' }));

    expect(trackPageView).toHaveBeenCalledWith('/videos');
  });

  it('tracks the resulting path on a popstate navigation', () => {
    trackPageView.mockClear();

    render(
      <RouterProvider>
        <div>content</div>
      </RouterProvider>,
    );
    trackPageView.mockClear();

    window.history.pushState(null, '', '/suggestions');
    fireEvent.popState(window);

    expect(trackPageView).toHaveBeenCalledWith('/suggestions');
  });

  it('tracks an unmatched path the same way (404 case)', () => {
    window.history.replaceState(null, '', '/does-not-exist');
    trackPageView.mockClear();

    render(
      <RouterProvider>
        <div>content</div>
      </RouterProvider>,
    );

    expect(trackPageView).toHaveBeenCalledWith('/does-not-exist');
  });
});
