import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './components/homePage';
import '../styles/index.sass';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import CartDrawer from './components/cart/CartDrawer.tsx';
import { CartDrawerProvider } from './components/cart/CartDrawerContext.tsx';

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
      <HomePage />
      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
      <CartDrawer />
      </CartDrawerProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
