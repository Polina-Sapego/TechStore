import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from '../homePage/index.tsx';
import data from '../../../worker-mock-server/data/products.json';
import '@testing-library/jest-dom';

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data.products),
    })
  ) as unknown as typeof fetch;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('HomePage sorting', () => {
  it('renders products in default order initially', async () => {
    renderWithClient(<HomePage />);

    await waitFor(() => expect(screen.queryByText(/Loading.../i)).toBeNull());

    const productNames = screen.getAllByTestId('product-title').map(el => el.textContent);
    expect(productNames).toEqual(data.products.map(p => p.title));
  });

  it('sorts products by price ascending', async () => {
    renderWithClient(<HomePage />);
    await waitFor(() => expect(screen.queryByText(/Loading.../i)).toBeNull());

    const select = screen.getByLabelText(/sort by price/i);
    await userEvent.selectOptions(select, 'asc');

    await waitFor(() => {
      const prices = screen.getAllByTestId('product-price').map(el => Number(el.textContent));
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    });
  });

  it('sorts products by price descending', async () => {
    renderWithClient(<HomePage />);
    await waitFor(() => expect(screen.queryByText(/Loading.../i)).toBeNull());

    const select = screen.getByLabelText(/sort by price/i);
    await userEvent.selectOptions(select, 'desc');

    await waitFor(() => {
      const prices = screen.getAllByTestId('product-price').map(el => Number(el.textContent));
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sorted);
    });
  });
});
