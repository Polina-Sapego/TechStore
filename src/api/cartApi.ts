import type { CartItem } from '../store/cart/types';
import { apiFetch } from './apiFetch.ts';

export async function getCart(): Promise<CartItem[]> {
  const res = await apiFetch<CartItem[]>('/api/cart');

  if (!res.ok || !res.data) {
    return [];
  }

  return res.data;
}
