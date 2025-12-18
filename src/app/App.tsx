import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.tsx';
import HomePage from '../components/homePage';
import Admin from '../components/admin';
import Authorization from '../components/authorization';
import CartDrawer from '../components/cart/CartDrawer.tsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { initCartSync } from '../api/initCartSync.ts';
import { useEffect } from 'react';
import { apiFetch } from '../api/apiFetch.ts';
import { useAuthStore } from '../store/user/store.ts';
import Cookies from 'js-cookie';

async function restoreAuth() {
  const token = Cookies.get('token');
  if (!token) return false;

  const res = await apiFetch('/api/me');
  if (res.ok && res.data) {
    useAuthStore.getState().setUser(res.data.user);
    return true;
  } else {
    Cookies.remove('token');
    return false;
  }
}

export default function App() {
  useEffect(() => {
    (async () => {
      initCartSync();
      const isAuth = await restoreAuth();

      void isAuth;
    })();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/authorization" element={<Authorization />} />
        <Route path="/signup" element={<Authorization />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
      <CartDrawer />
      <Toaster position="top-right" richColors />
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </BrowserRouter>
  );
}
