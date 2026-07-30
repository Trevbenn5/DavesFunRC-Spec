import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { RouterProvider } from '../../app/router';
import { ThreeDDesignsPage } from './ThreeDDesignsPage';

function renderPage() {
  return render(
    <RouterProvider>
      <ThreeDDesignsPage />
    </RouterProvider>,
  );
}

describe('ThreeDDesignsPage', () => {
  it('renders the page heading', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: '3D Designs' })).toBeInTheDocument();
  });

  it('renders the introduction as three separate paragraphs, in order', () => {
    renderPage();

    const paragraphs = screen.getAllByText(/./, { selector: 'p' });

    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0]).toHaveTextContent(/^Welcome! Here you'll find links/);
    expect(paragraphs[1]).toHaveTextContent(/^Many of the designs are free to download/);
    expect(paragraphs[2]).toHaveTextContent(/^I hope you enjoy building them/);
  });

  it('no longer shows the placeholder copy', () => {
    renderPage();

    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });

  it('renders the printer photo with descriptive alt text', () => {
    renderPage();

    expect(
      screen.getByAltText(/3D printer mid-print, replacing what used to be a hand-cut foam build/),
    ).toBeInTheDocument();
  });

  it('links out to Cults3D and Ko-fi', () => {
    renderPage();

    const cultsLink = screen.getByRole('link', { name: /view my designs on cults3d/i });
    expect(cultsLink).toHaveAttribute(
      'href',
      'https://cults3d.com/en/users/trevbenn/3d-models',
    );
    expect(cultsLink).toHaveAttribute('target', '_blank');

    const koFiLink = screen.getByRole('link', { name: /support me on ko-fi/i });
    expect(koFiLink).toHaveAttribute('href', 'https://ko-fi.com/davesfunrc');
    expect(koFiLink).toHaveAttribute('target', '_blank');
  });
});
