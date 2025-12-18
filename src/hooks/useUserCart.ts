import { useEffect } from 'react';
import { useAuthStore } from '../store/user/store.ts';
import { useCartStore } from '../store/cart/useCartStore.ts';

export const useUserCart = () => {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  useEffect(() => {
    void user;
    void hasHydrated;
  }, [user?.id, hasHydrated]);
};
