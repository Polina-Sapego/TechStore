import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useAuthStore } from '../store/user/store.ts';
import { useUserCart } from './useUserCart.ts';

export function useAuthInit() {
  useUserCart();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      setUser(null);
      return;
    }

    const checkAuth = async () => {
      const res = await fetch('http://localhost:3000/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return;
      }

      Cookies.remove('token');
      setUser(null);
    };

    void checkAuth();
  }, [setUser]);
}
