import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useAuthStore } from '../store/user/store.ts';

export function useAuthInit() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      setUser(null);
      return;
    }
  }, [setUser]);
}
