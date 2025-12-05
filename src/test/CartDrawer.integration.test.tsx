import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useCartStore } from '../store/cart/store.ts';
import { CartDrawerProvider } from '../components/cart/CartDrawerContext.tsx';
import CartDrawer from '../components/cart/CartDrawer.tsx';
import CartButton from '../components/cart/CartButton.tsx';
import { MockWebSocket } from '../../__mocks__/websocket.ts';

(globalThis as any).WebSocket = MockWebSocket;

function renderWithProviders(ui: React.ReactNode) {
  return render(<CartDrawerProvider>{ui}</CartDrawerProvider>);
}

beforeEach(() => {
  MockWebSocket.instances = [];
  localStorage.clear();

  const cur = useCartStore.getState();
  const originalConnect = cur.connectWebSocket;
  useCartStore.setState({
    connectWebSocket: () => {
    },
  });

  try {
    if (cur.ws && typeof cur.ws.close === 'function') {
      if (cur.ws) (cur.ws as any).close(false);
    }
  } catch (e) { /* empty */
  }

  useCartStore.setState({ connectWebSocket: originalConnect });

  useCartStore.setState({
    ws: undefined,
    product: [],
  });

});

beforeEach(() => {
  MockWebSocket.instances = [];
});

describe("CartDrawer integration", () => {
  it("отображает добавленный товар после открытия корзины", async () => {
    const user = userEvent.setup();

    const { addProduct } = useCartStore.getState();
    addProduct({
      id: 1,
      title: "Test Product",
      price: 15,
      qty: 1,
      image: "test-image.png",
    });

    renderWithProviders(
      <>
        <CartButton />
        <CartDrawer />
      </>
    );

    const cartButton = screen.getByRole("button", { name: /open cart/i });
    await user.click(cartButton);

    const drawer = await screen.findByRole("basket");
    expect(drawer).toBeInTheDocument();

    const productTitle = await screen.findByTestId("product-title");
    expect(productTitle).toHaveTextContent("Test Product");

    const summary = await screen.findByTestId("cart-summary");
    expect(summary).toHaveTextContent("$15.00");
  });

  it('удаляет товар и пересчитывает сумму', async () => {
    const user = userEvent.setup();
    const store = useCartStore.getState();
    store.connectWebSocket();
    store.addProduct({
      id: 2,
      title: 'Laptop',
      price: 1000,
      qty: 1,
      image: 'laptop.png',
    });

    renderWithProviders(
      <>
        <CartButton />
        <CartDrawer />
      </>,
    );

    const cartButton = screen.getByRole('button', { name: /open cart/i });
    await user.click(cartButton);

    const removeButtons = await screen.findAllByRole('button', { name: /remove/i });
    await user.click(removeButtons[0]);

    expect(screen.queryByTestId('product-title')).not.toBeInTheDocument();

    const summary = await screen.findByTestId('cart-summary');
    expect(summary).toHaveTextContent('$0.00');
  });

  it('не дублирует товар при повторном добавлении', async () => {
    const storeApi = useCartStore;

    storeApi.getState().connectWebSocket();
    const ws = MockWebSocket.instances[0];
    ws.onopen?.();

    storeApi.getState().addProduct({ id: 3, title: 'Mouse', price: 50, qty: 1 });
    storeApi.getState().addProduct({ id: 3, title: 'Mouse', price: 50, qty: 1 });

    await waitFor(() => {
      expect(useCartStore.getState().product).toHaveLength(1);
      expect(useCartStore.getState().product[0].qty).toBe(2);
    });
  });
});
