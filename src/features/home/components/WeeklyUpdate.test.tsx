import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { WeeklyUpdate } from './WeeklyUpdate';
import { homeWeeklyUpdate } from '../../../data/home-weekly-update';

describe('WeeklyUpdate', () => {
  it('renders the heading', () => {
    render(<WeeklyUpdate />);

    expect(
      screen.getByRole('heading', { level: 2, name: homeWeeklyUpdate.heading }),
    ).toBeInTheDocument();
  });

  it('renders the two fixed images with descriptive alt text', () => {
    render(<WeeklyUpdate />);

    const foamImage = screen.getByAltText(/foam sheet RC plane/i);
    expect(foamImage).toBeInTheDocument();
    expect(foamImage.getAttribute('alt')).not.toBe('');

    const workbenchImage = screen.getByAltText(/dave's workbench/i);
    expect(workbenchImage).toBeInTheDocument();
    expect(workbenchImage.getAttribute('alt')).not.toBe('');
  });

  it('renders the body text inside a focusable scrollable region', () => {
    render(<WeeklyUpdate />);

    const region = screen.getByRole('region', { name: homeWeeklyUpdate.heading });
    expect(region).toHaveAttribute('tabIndex', '0');

    homeWeeklyUpdate.body.forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });
  });
});
