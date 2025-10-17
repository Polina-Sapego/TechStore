import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import HomePage from '../homePage/index.tsx';
import { products } from '../homePage/productsMoc.ts';

describe('HomePage sorting', () => {
  it('renders products in default order initially', () => {
    render(<HomePage />);
    const productNames = screen.getAllByTestId('product-title').map(el => el.textContent);

    expect(productNames).toEqual(products.map(p => p.title));
  });

  it('sorts products by price ascending', async () => {
    render(<HomePage />);
    const select = screen.getByLabelText(/sort by price/i);

    await userEvent.selectOptions(select, 'asc');

    const prices = screen.getAllByTestId('product-price').map(el => Number(el.textContent));
    const sorted = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sorted);
  });

  it('sorts products by price descending', async () => {
    render(<HomePage />);
    const select = screen.getByLabelText(/sort by price/i);

    await userEvent.selectOptions(select, 'desc');

    const prices = screen.getAllByTestId('product-price').map(el => Number(el.textContent));
    const sorted = [...prices].sort((a, b) => b - a);

    expect(prices).toEqual(sorted);
  });
});
