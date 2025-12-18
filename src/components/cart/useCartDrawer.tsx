import { useContext } from 'react';
import CartDrawerContext from './CartDrawerContext';

export const useCartDrawer = () => {
  const ctx = useContext(CartDrawerContext);
  if (!ctx) throw new Error("useCartDrawer must be used within CartDrawerProvider");
  return ctx;
};
