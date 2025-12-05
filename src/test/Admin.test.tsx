import fetchMock from 'jest-fetch-mock';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Admin from '../components/admin';
import HomePage from '../components/homePage';
import { useCartStore } from '../store/cart/store.ts';
import { CartDrawerProvider } from '../components/cart/CartDrawerContext.tsx';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../store/cart/store.ts', () => ({
  useCartStore: jest.fn(),
}));

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      <CartDrawerProvider>{ui}</CartDrawerProvider>
    </QueryClientProvider>,
    </MemoryRouter>
  );
};

beforeEach(() => {
  fetchMock.resetMocks();

  (useCartStore as unknown as jest.Mock).mockImplementation((selector) =>
    selector({
      ws: undefined,
      connectWebSocket: jest.fn(),
      addProduct: jest.fn(),
      removeProduct: jest.fn(),
      clearCart: jest.fn(),
      sessionId: 'test-session',
      product: [],
    }),
  );
});

afterEach(() => {
  document.body.innerHTML = '';
});

test('optimistic update откат при ошибки(Admin)', async () => {
  fetchMock.mockResponseOnce(JSON.stringify([]));
  fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });
  renderWithClient(<Admin />);

  const addButton = await screen.findByText('Add New Product');
  await userEvent.click(addButton);
  const modal = await screen.findByRole('dialog');
  await userEvent.type(await within(modal).findByLabelText(/title/i), 'New product');
  await userEvent.type(await within(modal).findByLabelText(/price/i), '100');
  const file = new File(['dummy content'], 'photo.png', { type: 'image/png' });
  const imageInput = within(modal).getByLabelText(/image/i) as HTMLInputElement;
  await userEvent.upload(imageInput, file);
  await userEvent.selectOptions(within(modal).getByLabelText(/category/i), 'phones');
  await userEvent.click(within(modal).getByText(/add product/i));

  expect(await screen.findByRole('button', { name: /new product/i })).toBeInTheDocument();

  await waitFor(() => expect(screen.queryByText('New product')).not.toBeInTheDocument());
});

test('продукт успешно создан → появляется в каталоге (Admin → HomePage)', async () => {
  fetchMock.mockResponseOnce(JSON.stringify([]));

  fetchMock.mockResponseOnce(JSON.stringify({
    id: 999,
    title: 'iPhone X',
    price: 999,
    category: 'phones',
    image: null,
    inStock: true,
  }), { status: 201 });

  const adminRender = renderWithClient(<Admin />);
  const addButton = await screen.findByText('Add New Product');
  await userEvent.click(addButton);
  const modal = await screen.findByRole('dialog');
  await userEvent.type(await within(modal).findByLabelText(/title/i), 'iPhone X');
  await userEvent.type(await within(modal).findByLabelText(/price/i), '999');
  const imageInput = within(modal).getByLabelText(/image/i) as HTMLInputElement;
  imageInput.required = false;
  const formEl = modal.querySelector('form') as HTMLFormElement | null;
  if (!formEl) throw new Error('form element not found inside modal');

  fireEvent.submit(formEl);

  await waitFor(() => {
    if (fetchMock.mock.calls.length < 2) {
      throw new Error('waiting for POST call');
    }
  });

  adminRender.unmount();

  fetchMock.mockResponseOnce(JSON.stringify([{
    id: 999,
    title: 'iPhone X',
    price: 999,
    category: 'phones',
    image: null,
    inStock: true,
  }]));

  renderWithClient(<HomePage />);

  expect(await screen.findByText('iPhone X')).toBeInTheDocument();
});
