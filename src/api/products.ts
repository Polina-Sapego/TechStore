import { type Product } from '../components/homePage/productCard';
import { apiFetch } from './apiFetch.ts';

export const fetchProducts = async (
  active: string,
  sortOrder: 'asc' | 'desc' | null,
) => {
  const params = new URLSearchParams();
  if (active !== 'all') params.append('category', active);
  if (sortOrder) params.append('sort', sortOrder);

  const res = await apiFetch<Product[]>(
    `/products?${params}`,
  );

  if (!res.ok) throw new Error(res.message);
  return res.data!;
};

export type ProductFormData = Omit<Product, 'id'>;

export const addProduct = async (product: ProductFormData) => {
  const res = await apiFetch<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(product),
    showToast: true,
  });

  if (!res.ok) throw new Error(res.message);
  return res.data!;
};

export const updateProduct = async (id: number, product: ProductFormData) => {
  const res = await apiFetch<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
    showToast: true,
  });

  if (!res.ok) throw new Error(res.message);
  return res.data!;
};

export const deleteProduct = async (id: number) => {
  const res = await apiFetch<void>(`/products/${id}`, {
    method: 'DELETE',
    showToast: true,
  });

  if (!res.ok) throw new Error(res.message);
};
