import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  CartItem,
  ICartStore,
  createSessionId,
  CartMessage,
} from './types';

import { WS_URL, safeSend } from './ws';

export const useCartStore = create<ICartStore>()(
  persist(
    (set, get) => ({
      product: [],
      sessionId: createSessionId(),

      addProduct: (newProduct) => {
        set((state) => {
          const existing = state.product.find((p) => p.id === newProduct.id);
          let updated: CartItem[];

          if (existing) {
            updated = state.product.map((p) =>
              p.id === newProduct.id
                ? { ...p, qty: p.qty + (newProduct.qty ?? 1) }
                : p
            );
          } else {
            updated = [
              ...state.product,
              { ...newProduct, qty: newProduct.qty ?? 1 },
            ];
          }

          safeSend(get().ws, {
            type: 'cart:update',
            payload: updated,
            sessionId: get().sessionId,
          });

          return { product: updated };
        });
      },

      removeProduct: (id) =>
        set((state) => {
          const updated = state.product.filter((p) => p.id !== id);

          safeSend(get().ws, {
            type: 'cart:update',
            payload: updated,
            sessionId: get().sessionId,
          });

          return { product: updated };
        }),

      clearCart: () => {
        safeSend(get().ws, {
          type: 'cart:update',
          payload: [],
          sessionId: get().sessionId,
        });

        set({ product: [] });
      },

      setCart: (products: CartItem[]) => set({ product: products }),

      connectWebSocket: () => {
        const existing = get().ws;

        if (
          existing &&
          (existing.readyState === WebSocket.OPEN ||
            existing.readyState === WebSocket.CONNECTING)
        ) {
          console.log('WebSocket already active — skipping reconnect');
          return;
        }

        console.log('Creating new WebSocket at', WS_URL);

        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
          try {
            const msg: CartMessage = JSON.parse(event.data);

            if (msg.type === 'cart:sync') {
              if (msg.sessionId === get().sessionId) {
                console.log('Ignoring own sync message');
                return;
              }

              console.log('Sync from other tab:', msg.payload);
              set({ product: msg.payload });
            }
          } catch (err) {
            console.error('WS parse error:', err);
          }
        };

        ws.onerror = (err) => console.error('WebSocket error', err);

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
