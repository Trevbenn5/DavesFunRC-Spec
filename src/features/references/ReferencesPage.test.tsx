import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { RouterProvider } from '../../app/router';
import { ReferencesPage } from './ReferencesPage';
import type { ReferenceCategory } from '../../data/references';

const { mockCategories } = vi.hoisted(() => ({ mockCategories: [] as ReferenceCategory[] }));

vi.mock('../../data/references', () => ({
  get referenceCategories() {
    return mockCategories;
  },
}));

function setCategories(categories: ReferenceCategory[]) {
  mockCategories.length = 0;
  mockCategories.push(...categories);
}

function renderPage() {
  return render(
    <RouterProvider>
      <ReferencesPage />
    </RouterProvider>,
  );
}

describe('ReferencesPage', () => {
  it('renders the page heading and intro', () => {
    setCategories([]);

    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'References' })).toBeInTheDocument();
    expect(screen.getByText(/curated list of sites/i)).toBeInTheDocument();
  });

  it('renders one section per category with its links', () => {
    setCategories([
      {
        category: 'Useful Sites',
        links: [
          { title: 'RCGroups', url: 'https://www.rcgroups.com', note: 'Large community forum.' },
        ],
      },
      {
        category: 'Flying Clubs',
        links: [{ title: 'MAAA', url: 'https://www.maaa.asn.au' }],
      },
    ]);

    renderPage();

    expect(screen.getByRole('heading', { level: 2, name: 'Useful Sites' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Flying Clubs' })).toBeInTheDocument();

    const rcGroupsLink = screen.getByRole('link', { name: 'RCGroups' });
    expect(rcGroupsLink).toHaveAttribute('href', 'https://www.rcgroups.com');
    expect(rcGroupsLink).toHaveAttribute('target', '_blank');
    expect(rcGroupsLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('Large community forum.')).toBeInTheDocument();

    const maaaLink = screen.getByRole('link', { name: 'MAAA' });
    expect(maaaLink).toHaveAttribute('href', 'https://www.maaa.asn.au');
  });

  it('does not render a note when a link has none', () => {
    setCategories([
      { category: 'Useful Sites', links: [{ title: 'RCGroups', url: 'https://www.rcgroups.com' }] },
    ]);

    renderPage();

    const link = screen.getByRole('link', { name: 'RCGroups' });
    expect(link.parentElement?.querySelector('p')).not.toBeInTheDocument();
  });

  it('shows an empty state with a link back to Home when there are no categories', () => {
    setCategories([]);

    renderPage();

    expect(screen.getByText('No references have been added yet — check back soon.')).toBeInTheDocument();
    const backLink = screen.getByRole('link', { name: 'Back to Home' });
    expect(backLink).toHaveAttribute('href', '/');
  });
});
