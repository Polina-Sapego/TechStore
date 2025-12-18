import { create } from 'zustand';
import type { StateStorage } from 'zustand/middleware';
import { createJSONStorage, persist } from 'zustand/middleware';
import { toast } from 'sonner';

import { CartItem, CartMessage, createSessionId, ICartStore } from './types';
import { safeSend, WS_URL } from './ws';
import { getCartStorageScope, getUserCartChannel } from './cartId.ts';
import { useAuthStore } from '../user/store.ts';

function scopedKey(base: string) {
  return `${base}:${getCartStorageScope()}`;
}

const scopedStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(scopedKey(name)),
  setItem: (name, value) => localStorage.setItem(scopedKey(name), value),
  removeItem: (name) => localStorage.removeItem(scopedKey(name)),
};

export const useCartStore = create<ICartStore>()(
  persist(
    (set, get) => {
      const sessionId = createSessionId();

      const initialState: ICartStore = {
        product: [],
        sessionId,
        hasHydrated: false,
        ws: undefined,

        setHasHydrated: (value) => set({ hasHydrated: value }),

        addProduct: (newProduct) => {
          const user = useAuthStore.getState().user;
          if (!user) {
            toast.error('Please log in to add products to cart');
            return;
          }
          set((state) => {
            const existing = state.product.find((p) => p.id === newProduct.id);
            let updated: CartItem[];

            if (existing) {
              updated = state.product.map((p) =>
                p.id === newProduct.id
                  ? { ...p, qty: p.qty + (newProduct.qty ?? 1) }
                  : p,
              );
            } else {
              updated = [...state.product, { ...newProduct, qty: newProduct.qty ?? 1 }];
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
            const user = useAuthStore.getState().user;
            if (!user) {
              toast.error('Please log in to manage cart');
              return state;
            }
            const updated = state.product.filter((p) => p.id !== id);

            safeSend(get().ws, {
              type: 'cart:update',
              payload: updated,
              sessionId: get().sessionId,
            });

            return { product: updated };
          }),

        clearCart: () => {
          const user = useAuthStore.getState().user;
          if (!user) {
            toast.error('Please log in to manage cart');
            return;
          }
          safeSend(get().ws, {
            type: 'cart:update',
            payload: [],
            sessionId: get().sessionId,
          });

          set({ product: [] });
        },

        setCart: (products: CartItem[]) => {
          set({ product: products });
        },

        connectWebSocket: () => {
          const channel = getUserCartChannel();
          if (!channel) return;

          const { ws } = get();
          if (ws) ws.close();

          const newWs = new WebSocket(`${WS_URL}?cartId=${encodeURIComponent(channel)}`);
          set({ ws: newWs });

          newWs.onopen = () => {
            safeSend(get().ws, {
              type: 'cart:update',
              payload: get().product,
              sessionId: get().sessionId,
            });
          };

          newWs.onmessage = (event) => {
            try {
              const msg: CartMessage = JSON.parse(event.data);
              if (msg.type !== 'cart:sync') return;

              if (msg.sessionId === get().sessionId) {
                return;
              }

              set({ product: msg.payload });
            } catch (e) {
              console.error('[Cart] WS message parse error', e);
            }
          };
        },
        };

      return initialState;
    },
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => scopedStorage),
      partialize: (state: ICartStore) => ({ product: state.product }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
