import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: number;
  title: string;
  price: number;
  qty: number;
  image?: string;
};

interface ICartStore {
  product: CartItem[];
  addProduct: (product: CartItem) => void;
  removeProduct: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<ICartStore>()(
  persist(
    (set) => ({
      product: [],

      addProduct: (newProduct) =>
        set((state) => {
          const existing = state.product.find((it) => it.id === newProduct.id);
          if (existing) {
            return {
              product: state.product.map((it) =>
                it.id === newProduct.id
                  ? { ...it, qty: it.qty + (newProduct.qty ?? 1) }
                  : it
              ),
            };
          }
          return { product: [...state.product, { ...newProduct, qty: newProduct.qty ?? 1 }] };
        }),

      removeProduct: (id) =>
        set((state) => ({
          product: state.product.filter((it) => it.id !== id),
        })),

      clearCart: () => set({ product: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
