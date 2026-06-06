import { screen } from '@testing-library/react';
import { ForecastPanel } from '@/components/ForecastPanel';
import { londonCity, mockForecast } from '@/test/fixtures';
import { renderWithProviders } from '@/test/test-utils';

describe('ForecastPanel', () => {
  it('shows loading skeletons', () => {
    const { container } = renderWithProviders(
      <ForecastPanel
        city={londonCity}
        forecast={undefined}
        isLoading
        isError={false}
        error={null}
        onRetry={jest.fn()}
      />,
    );
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders forecast', () => {
    renderWithProviders(
      <ForecastPanel
        city={londonCity}
        forecast={mockForecast}
        isLoading={false}
        isError={false}
        error={null}
        onRetry={jest.fn()}
      />,
    );
    expect(screen.getByText(/current conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/7-day outlook/i)).toBeInTheDocument();
  });

  it('shows error with retry', () => {
    const onRetry = jest.fn();
    renderWithProviders(
      <ForecastPanel
        city={londonCity}
        forecast={undefined}
        isLoading={false}
        isError
        error={new Error('Network failed')}
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(/network failed/i);
    screen.getByRole('button', { name: /try again/i }).click();
    expect(onRetry).toHaveBeenCalled();
  });
});
