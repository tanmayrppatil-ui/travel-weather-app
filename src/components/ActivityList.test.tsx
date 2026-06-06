import { screen } from '@testing-library/react';
import { ActivityList } from '@/components/ActivityList';
import { pleasantDays } from '@/test/fixtures';
import { renderWithProviders } from '@/test/test-utils';

describe('ActivityList', () => {
  it('shows loading skeletons', () => {
    const { container } = renderWithProviders(
      <ActivityList daily={undefined} isLoading />,
    );
    expect(container.querySelectorAll('.animate-pulse').length).toBe(4);
  });

  it('renders four ranked activities', () => {
    renderWithProviders(
      <ActivityList daily={pleasantDays} isLoading={false} />,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByText('Outdoor sightseeing')).toBeInTheDocument();
  });
});
