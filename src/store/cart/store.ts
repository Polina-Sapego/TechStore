import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type CartItem = {
  id: number;
  title: string;
  price: number;
  qty: number;
  image?: string;
};

type CartMessage =
  | {
  type: 'cart:update';
  payload: CartItem[];
  sessionId: string;
}
  | {
  type: 'cart:sync';
  payload: CartItem[];
  sessionId: string;
};

interface ICartStore {
  product: CartItem[];
  addProduct: (product: CartItem) => void;
  removeProduct: (id: number) => void;
  clearCart: () => void;
  setCart: (products: CartItem[]) => void;
  connectWebSocket: () => void;
  ws?: WebSocket | undefined;
  sessionId: string;
}

function safeSend(ws: WebSocket | undefined, data: CartMessage) {
  if (!ws) return;
  const msg = JSON.stringify(data);

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(msg);
  } else {
    ws.addEventListener('open', () => {
      try {
        ws.send(msg);
      } catch (e) { /* ignore */
      }
    }, { once: true });
  }
}

const WS_URL = (globalThis as unknown as {
  VITE_WS_URL?: string
}).VITE_WS_URL || 'ws://localhost:3000';

export const useCartStore = create<ICartStore>()(
  persist(
    (set, get) => ({
      product: [],
      sessionId: uuidv4(),

      addProduct: (newProduct) => {
        set((state) => {
          const existing = state.product.find((it) => it.id === newProduct.id);
          let updated: CartItem[];

          if (existing) {
            updated = state.product.map((it) =>
              it.id === newProduct.id
                ? { ...it, qty: it.qty + (newProduct.qty ?? 1) }
                : it,
            );
          } else {
            updated = [...state.product, { ...newProduct, qty: newProduct.qty ?? 1 }];
          }

          const ws = get().ws;
          console.log('sending cart:update, sessionId=', get().sessionId, 'payload=', updated);
          safeSend(ws, { type: 'cart:update', payload: updated, sessionId: get().sessionId });

          return { product: updated };
        });
      },

      removeProduct: (id) =>
        set((state) => {
          const updated = state.product.filter((it) => it.id !== id);
          const ws = get().ws;
          console.log('sending cart:update, sessionId=', get().sessionId, 'payload=', updated);
          safeSend(ws, { type: 'cart:update', payload: updated, sessionId: get().sessionId });
          return { product: updated };
        }),

      clearCart: () => {
        const ws = get().ws;
        safeSend(ws, { type: 'cart:update', payload: [], sessionId: get().sessionId });
        set({ product: [] });
      },

      setCart: (products: CartItem[]) => set({ product: products }),

      connectWebSocket: () => {
        const existing = get().ws;

        if (existing && (existing.readyState === WebSocket.OPEN || existing.readyState === WebSocket.CONNECTING)) {
          console.log('WebSocket already active (OPEN or CONNECTING), skipping reconnect');
          return;
        }

        console.log('connectWebSocket() — creating new WebSocket at', WS_URL);
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          console.log('Connected to WebSocket server');
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'cart:sync') {
              if (msg.sessionId === get().sessionId) {
                console.log('Ignoring self cart:sync');
                return;
              }
              console.log('Syncing cart from other tab:', msg.payload);
              set({ product: msg.payload });
            }
          } catch (err) {
            console.error('WebSocket parse error:', err);
          }
        };

        ws.onerror = (err) => {
          console.error('WebSocket error', err);
        };

        ws.onclose = (ev) => {
          console.warn('WebSocket closed', ev);
          set({ ws: undefined });
          setTimeout(() => get().connectWebSocket(), 3000);
        };

        set({ ws });
      },
    }),
    {
      name: 'cart-storage-guest',
      partialize: (state) => ({ product: state.product }),
    }
  )
);
