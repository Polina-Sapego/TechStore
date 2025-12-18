import { CartItem } from '@store/cart/types';

interface Cart {
  items: CartItem[];
}

const carts: Record<string, Cart> = {};

export function getCart(id: string): Cart {
  if (!carts[id]) {
    carts[id] = { items: [] };
  }
  return carts[id];
}

export function updateCart(id: string, items: CartItem[]) {
  if (!carts[id]) carts[id] = { items: [] };
  carts[id].items = items;
}
