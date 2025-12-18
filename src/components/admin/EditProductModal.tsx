import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { Product } from '../homePage/productCard';
import ProductFormFields from './ProductFormFields';
import { useImageUpload } from './useImageUpload';

type ProductFormData = Omit<Product, 'id' | 'rating'>;

interface EditProductModalProps {
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>, productId: number) => Promise<void>;
  product: Product;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ onClose, onSubmit, product }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      title: product.title,
      price: product.price,
      image: product.image || '',
      category: product.category,
      inStock: product.inStock,
    },
  });

  const imagePreview = watch('image');
  const { handleImageChange } = useImageUpload({ setValue, existingImage: product.image });
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    reset({
      title: product.title,
      price: product.price,
      image: product.image || '',
      category: product.category,
      inStock: product.inStock,
    });
  }, [product, reset]);

  const onSubmitForm = async (data: ProductFormData) => {
    try {
      await onSubmit({ ...data, rating: product.rating }, product.id);
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <>
      <div className="modal-overlay edit-product-overlay" onClick={onClose}
           data-testid="modal-overlay" />
      <div
        className="modal-container edit-product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
      >
        <header className="modal-header edit-product-header">
          <h2 id="modal-title" className="modal-title edit-product-title">Edit Product</h2>
          <button
            ref={closeBtnRef}
            className="modal-close edit-product-close"
            aria-label="Close modal"
            onClick={onClose}
          >
            ✕
          </button>
        </header>
        <form className="modal-form edit-product-form" onSubmit={handleSubmit(onSubmitForm)}>
          <ProductFormFields
            register={register}
            control={control}
            errors={errors}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            isEditMode={true}
          />
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProductModal;
