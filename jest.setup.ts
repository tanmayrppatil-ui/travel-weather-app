import '@testing-library/jest-dom';

global.fetch = jest.fn() as typeof fetch;

// Then in each test that uses fetch:
beforeEach(() => {
  (global.fetch as jest.Mock).mockReset();
});
