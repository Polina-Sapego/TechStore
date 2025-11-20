import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './components/homePage';
import '../assets/styles/index.sass';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import CartDrawer from './components/cart/CartDrawer.tsx';
import { CartDrawerProvider } from './components/cart/CartDrawerContext.tsx';
import Admin from './components/admin';
import MainLayout from './layouts/MainLayout.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartDrawerProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
          <CartDrawer />
          {process.env.NODE_ENV !== 'production' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </BrowserRouter>
      </CartDrawerProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
