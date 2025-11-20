import { useQuery } from "@tanstack/react-query";

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/products");
      if (!res.ok) throw new Error("Failed to load products");
      return res.json();
    }
  });
