import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartDrawerProvider } from '../components/cart/CartDrawerContext.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <CartDrawerProvider>{children}</CartDrawerProvider>
  </QueryClientProvider>
);
