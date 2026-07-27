import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { HomePage } from './HomePage';
import { RouterProvider } from '../../app/router';
import { homeWeeklyUpdate } from '../../data/home-weekly-update';

describe('HomePage', () => {
  it('renders the hero heading', () => {
    render(
      <RouterProvider>
        <HomePage />
      </RouterProvider>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: "G'day, welcome to DavesFunRC" }),
    ).toBeInTheDocument();
  });

  it('renders the weekly update alongside the hero', () => {
    render(
      <RouterProvider>
        <HomePage />
      </RouterProvider>,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: homeWeeklyUpdate.heading }),
    ).toBeInTheDocument();
  });

  it('still renders the existing highlights', () => {
    render(
      <RouterProvider>
        <HomePage />
      </RouterProvider>,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Watch' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Read' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Build' })).toBeInTheDocument();
  });
});
