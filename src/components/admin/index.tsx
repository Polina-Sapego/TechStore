import React, { useCallback, useMemo } from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useProducts } from '@api/useProducts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Product } from '../homePage/productCard';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import { addProduct, deleteProduct, type ProductFormData, updateProduct } from '@api/products';
import AdminSkeleton from '../skeletons/AdminSkeleton.tsx';

const Admin: React.FC = () => {
  const { data: products, isLoading, isError } = useProducts();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const queryClient = useQueryClient();

  const addProductMutation = useMutation({
    mutationFn: (newProduct: ProductFormData) => addProduct(newProduct),

    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

      const productQueries = queryClient.getQueryCache().findAll({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'products',
      });

      const previousMap: Record<string, Product[] | undefined> = {};
      for (const q of productQueries) {
        previousMap[JSON.stringify(q.queryKey)] = q.state.data as Product[] | undefined;
      }

      const optimisticProduct: Product = {
        ...newProduct,
        id: Math.random(),
      };

      for (const q of productQueries) {
        const key = q.queryKey as readonly unknown[];
        queryClient.setQueryData<Product[]>(key, (old = []) => [...old, optimisticProduct]);
      }

      return { previousMap, optimisticProduct };
    },

    onError: (_error, _vars, ctx) => {
      if (!ctx?.previousMap) return;

      for (const keyStr of Object.keys(ctx.previousMap)) {
        const key = JSON.parse(keyStr) as readonly unknown[];
        queryClient.setQueryData<Product[]>(key, ctx.previousMap[keyStr] ?? []);
      }
    },

    onSuccess: (createdProduct, _vars, ctx) => {

      const productQueries = queryClient.getQueryCache().findAll({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'products',
      });

      for (const q of productQueries) {
        const key = q.queryKey as readonly unknown[];
        queryClient.setQueryData<Product[]>(key, (old = []) =>
          old.map((p) =>
            p.id === ctx?.optimisticProduct.id ? createdProduct : p,
          ),
        );
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductFormData }) => updateProduct(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const handleAddProduct = async (productData: ProductFormData) => {
    try {
      await addProductMutation.mutateAsync(productData);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async (productData: ProductFormData, productId: number) => {
    try {
      await updateProductMutation.mutateAsync({ id: productId, data: productData });
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteProduct = useCallback(async (productId: number) => {
    await deleteProductMutation.mutateAsync(productId);
  }, [deleteProductMutation]);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableSorting: false,
      },
      {
        id: 'image',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="admin-product-images">
            <img className="admin-product-image" src={row.original.image} loading="lazy"
                 alt={row.original.title} />
          </div>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        enableSorting: true,
        cell: ({ row, getValue }) => (
          <button
            onClick={() => handleEditProduct(row.original)}
            style={{
              background: 'none',
              border: 'none',
              color: '#000',
              cursor: 'pointer',
              textDecoration: 'none',
              padding: 0,
              font: 'inherit',
              textAlign: 'left',
              width: '100%',
            }}
          >
            {getValue<string>()}
          </button>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        enableSorting: true,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        enableSorting: true,
        cell: ({ getValue }) => `$${getValue<number>()}`,
      },
      {
        accessorKey: 'inStock',
        header: 'In Stock',
        enableSorting: true,
        cell: ({ getValue }) => (getValue<boolean>() ? 'Yes' : 'No'),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="admin-actions">
            <button
              className="delete-btn"
              onClick={() => handleDeleteProduct(row.original.id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleEditProduct, handleDeleteProduct],
  );

  const table = useReactTable({
    data: products || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (isLoading) return <AdminSkeleton />;
  if (isError) return <p>Error loading products</p>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Products Management</h1>

      <div className="admin-panel">
        <h3 className="admin-panel-title">Admin panel</h3>
        <button className="admin-add-product" onClick={handleOpenAddModal}>
          Add New Product
        </button>
      </div>

      {isAddModalOpen && (
        <AddProductModal
          onClose={handleCloseAddModal}
          onSubmit={handleAddProduct}
        />
      )}

      {isEditModalOpen && editingProduct && (
        <EditProductModal
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateProduct}
          product={editingProduct}
        />
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    cursor: header.column.getCanSort() ? 'pointer' : 'default',
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                  className="admin-product-header"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span>
                          {{
                            asc: ' ↑',
                            desc: ' ↓',
                          }[header.column.getIsSorted() as string] ?? ' ⇅'}
                        </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
          </thead>

          <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr className="admin-product-items" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="admin-product-item">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
