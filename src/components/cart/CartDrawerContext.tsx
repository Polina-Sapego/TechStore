import React, { createContext, useState } from 'react';

type ContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const CartDrawerContext = createContext<ContextType | undefined>(undefined);

export const CartDrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const open = () => setOpen(true);
  const close = () => setOpen(false);
  const toggle = () => setOpen(v => !v);

  return (
    <CartDrawerContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </CartDrawerContext.Provider>
  );
};

export default CartDrawerContext;
