import { v4 as uuidv4 } from 'uuid';

export type CartItem = {
  id: number;
  title: string;
  price: number;
  qty: number;
  image?: string;
};

export type CartMessage =
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

export interface ICartStore {
  product: CartItem[];
  addProduct: (product: CartItem) => void;
  removeProduct: (id: number) => void;
  clearCart: () => void;
  setCart: (products: CartItem[]) => void;
  connectWebSocket: () => void;
  ws?: WebSocket | undefined;
  sessionId: string;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const createSessionId = () => uuidv4();
