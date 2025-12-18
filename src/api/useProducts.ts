import { useQuery } from "@tanstack/react-query";
import { apiFetch } from './apiFetch.ts';
import type { Product } from '../components/homePage/productCard.tsx';

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await apiFetch<Product[]>("/products");
      if (!res.ok) throw new Error(res.message);
      return res.data!;
    },
  });
