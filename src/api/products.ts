import { type Product } from '../components/homePage/productCard';

export const fetchProducts = async (
  active: string,
  sortOrder: 'asc' | 'desc' | null,
): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (active !== 'all') params.append('category', active);
  if (sortOrder) params.append('sort', sortOrder);

  const res = await fetch(`http://localhost:3000/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};
