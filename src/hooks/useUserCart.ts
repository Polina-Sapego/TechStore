import { useEffect } from 'react';
import { useAuthStore } from '../store/user/store.ts';
import { useCartStore } from '../store/cart/store.ts';

export const useUserCart = () => {
  const user = useAuthStore((s) => s.user);
  const setCart = useCartStore((s) => s.setCart);

  useEffect(() => {
    if (!user) return;

    const saved = localStorage.getItem(`cart-storage-${user.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setCart(parsed.product || []);
    } else {
      setCart([]);
    }
  }, [user?.id, setCart]);
};
