import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as openMeteo from '@/api/openMeteo';
import { CitySearch } from '@/components/CitySearch';
import { londonCity } from '@/test/fixtures';
import { renderWithProviders } from '@/test/test-utils';

describe('CitySearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows hint when fewer than 2 characters', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderWithProviders(
      <CitySearch selectedCity={null} onSelectCity={jest.fn()} />,
    );

    await user.type(screen.getByRole('combobox'), 'L');
    expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
  });

  it('shows city suggestions after debounced search', async () => {
    jest.spyOn(openMeteo, 'searchCities').mockResolvedValue([londonCity]);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithProviders(
      <CitySearch selectedCity={null} onSelectCity={jest.fn()} />,
    );

    await user.type(screen.getByRole('combobox'), 'Lon');
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    expect(screen.getByText(/London/i)).toBeInTheDocument();
  });

  it('calls onSelectCity when a suggestion is clicked', async () => {
    jest.spyOn(openMeteo, 'searchCities').mockResolvedValue([londonCity]);
    const onSelectCity = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithProviders(
      <CitySearch selectedCity={null} onSelectCity={onSelectCity} />,
    );

    await user.type(screen.getByRole('combobox'), 'Lon');
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => screen.getByRole('option'));
    await user.click(screen.getByRole('option'));

    expect(onSelectCity).toHaveBeenCalledWith(londonCity);
  });

  it('does not show no results when refocusing a selected city', async () => {
    jest.spyOn(openMeteo, 'searchCities').mockResolvedValue([]);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithProviders(
      <CitySearch selectedCity={londonCity} onSelectCity={jest.fn()} />,
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('London, England, United Kingdom');

    await user.click(input);
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.queryByText(/no cities found/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clears selection when the user edits the committed city label', async () => {
    const onSelectCity = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithProviders(
      <CitySearch selectedCity={londonCity} onSelectCity={onSelectCity} />,
    );

    await user.type(screen.getByRole('combobox'), 'x');
    expect(onSelectCity).toHaveBeenCalledWith(null);
  });
});
