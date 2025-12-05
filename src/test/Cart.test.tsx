import '@testing-library/jest-dom';
import { MockWebSocket } from '../../__mocks__/websocket.ts';
import type { CartItem } from '../store/cart/store.ts';
import { useCartStore } from '../store/cart/store.ts';

(globalThis as any).WebSocket = MockWebSocket;

const TEST_PRODUCTS = {
  headphones: { id: 4, title: 'Headphones', price: 100, qty: 1 } as CartItem,
  phone: { id: 5, title: 'Phone', price: 900, qty: 1 } as CartItem,
  keyboard: { id: 6, title: 'Keyboard', price: 80, qty: 1 } as CartItem,
};

function resetStoreState() {
  const state = useCartStore.getState();

  if (state.ws && typeof state.ws.close === 'function') {
    try {
      (state.ws as any).close(false);
    } catch (error) {
      console.warn('Failed to close WebSocket:', error);
    }
  }

  useCartStore.setState({
    ws: undefined,
    product: [],
  });
}

beforeEach(() => {
  MockWebSocket.instances = [];
  localStorage.clear();
  resetStoreState();
});

describe('Cart integration', () => {
  it('синхронизирует состояние между вкладками', () => {
    const store = useCartStore.getState();
    store.connectWebSocket();
    const ws = MockWebSocket.instances[0];

    expect(ws).toBeDefined();

    ws.receive({
      type: 'cart:sync',
      payload: [TEST_PRODUCTS.headphones],
      sessionId: 'other-session',
    });

    const updatedState = useCartStore.getState();
    expect(updatedState.product).toHaveLength(1);
    expect(updatedState.product[0]).toMatchObject({
      id: TEST_PRODUCTS.headphones.id,
      title: TEST_PRODUCTS.headphones.title,
      price: TEST_PRODUCTS.headphones.price,
      qty: TEST_PRODUCTS.headphones.qty,
    });
  });

  it('игнорирует cart:sync, если sessionId совпадает (нет петли)', () => {
    const store = useCartStore.getState();
    store.connectWebSocket();
    const ws = MockWebSocket.instances[0];
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
    });
    const initialProductCount = store.product.length;

    ws.receive({
      type: 'cart:sync',
      payload: [TEST_PRODUCTS.phone],
      sessionId: store.sessionId,
    });

    const ignoredCall = consoleSpy.mock.calls.some((call) =>
      call[0]?.toString().includes('Ignoring self cart:sync'),
    );
    expect(ignoredCall).toBe(true);
    const updatedState = useCartStore.getState();
    expect(updatedState.product).toHaveLength(initialProductCount);
    consoleSpy.mockRestore();
  });

  it('правильно отправляет cart:update при добавлении товара', () => {
    const store = useCartStore.getState();
    store.connectWebSocket();
    const ws = MockWebSocket.instances[0];

    store.addProduct(TEST_PRODUCTS.keyboard);

    const lastMessageIndex = ws.sentMessages.length - 1;
    const lastMessage = JSON.parse(ws.sentMessages[lastMessageIndex]!);

    expect(lastMessage).toMatchObject({
      type: 'cart:update',
      sessionId: store.sessionId,
    });
    expect(lastMessage.payload).toHaveLength(1);
    expect(lastMessage.payload[0]).toMatchObject({
      id: TEST_PRODUCTS.keyboard.id,
      title: TEST_PRODUCTS.keyboard.title,
      price: TEST_PRODUCTS.keyboard.price,
    });
  });

  it('правильно отправляет cart:update при удалении товара', () => {
    const store = useCartStore.getState();
    store.connectWebSocket();
    const ws = MockWebSocket.instances[0];

    store.addProduct(TEST_PRODUCTS.keyboard);
    ws.sentMessages = [];

    store.removeProduct(TEST_PRODUCTS.keyboard.id);

    const lastMessageIndex = ws.sentMessages.length - 1;
    const lastMessage = JSON.parse(ws.sentMessages[lastMessageIndex]!);

    expect(lastMessage).toMatchObject({
      type: 'cart:update',
      sessionId: store.sessionId,
    });
    expect(lastMessage.payload).toHaveLength(0);
  });

  it('обрабатывает некорректные сообщения WebSocket без ошибок', () => {
    const store = useCartStore.getState();
    store.connectWebSocket();
    const ws = MockWebSocket.instances[0];
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
    });

    expect(() => {
      ws.receive({ type: 'unknown-type' });
    }).not.toThrow();

    expect(() => {
      ws.receive(null as any);
    }).not.toThrow();

    consoleErrorSpy.mockRestore();
  });
});
