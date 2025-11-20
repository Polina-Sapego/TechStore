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

export type ProductFormData = Omit<Product, 'id'>;

export const addProduct = async (product: ProductFormData): Promise<Product> => {
  const res = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to add product');
  return res.json();
};

export const updateProduct = async (
  id: number,
  product: ProductFormData,
): Promise<Product> => {
  const res = await fetch(`http://localhost:3000/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
  const res = await fetch(`http://localhost:3000/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product');
};