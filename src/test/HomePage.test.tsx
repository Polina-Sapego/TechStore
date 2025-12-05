import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartDrawerProvider } from '../components/cart/CartDrawerContext.tsx';
import HomePage from '../components/homePage';
import data from '../../worker-mock-server/data/products.json';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      <CartDrawerProvider>
        {ui}
      </CartDrawerProvider>
    </QueryClientProvider>,
    </MemoryRouter>,
  );
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
  it('продукты отображаются в порядке, установленном по умолчанию', async () => {
    renderWithProviders(<HomePage />);

    await waitFor(() => expect(screen.queryByText(/Loading.../i)).toBeNull());

    const productNames = screen.getAllByTestId('product-title').map(el => el.textContent);
    expect(productNames).toEqual(data.products.map(p => p.title));
  });

  it('Сортировать прайс по возрастанию', async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => expect(screen.queryByText(/Loading.../i)).toBeNull());

    const select = screen.getByLabelText(/sort by price/i);
    await userEvent.selectOptions(select, 'asc');

    await waitFor(() => {
      const prices = screen.getAllByTestId('product-price').map(el => Number(el.textContent));
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    });
  });

  it('Сортировать прайс по убыванию', async () => {
    renderWithProviders(<HomePage />);
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
