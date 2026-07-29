import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { RouterProvider } from '../../app/router';
import { VideosPage } from './VideosPage';

describe('VideosPage', () => {
  it('renders the page heading', () => {
    render(
      <RouterProvider>
        <VideosPage />
      </RouterProvider>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Videos' })).toBeInTheDocument();
  });
});
