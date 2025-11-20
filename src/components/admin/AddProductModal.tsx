import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { Product } from '../homePage/productCard';
import ProductFormFields from './ProductFormFields';
import { useImageUpload } from './useImageUpload';

type ProductFormData = Omit<Product, 'id' | 'rating'>;

interface AddProductModalProps {
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>) => Promise<void>;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onSubmit }) => {
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
      title: '',
      price: 0,
      image: '',
      category: 'accessories',
      inStock: true,
    },
  });

  const imagePreview = watch('image');
  const { handleImageChange } = useImageUpload({ setValue });
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
      reset();
    };
  }, [onClose, reset]);

  const onSubmitForm = async (data: ProductFormData) => {
    try {
      await onSubmit({ ...data, rating: 0 });
      reset();
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  return (
    <>
      <div className="modal-overlay add-product-overlay" onClick={onClose}
           data-testid="modal-overlay" />
      <div
        className="modal-container add-product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
      >
        <header className="modal-header add-product-header">
          <h2 id="modal-title" className="modal-title add-product-title">Add New Product</h2>
          <button
            ref={closeBtnRef}
            className="modal-close add-product-close"
            aria-label="Close modal"
            onClick={onClose}
          >
            ✕
          </button>
        </header>
        <form className="modal-form add-product-form" onSubmit={handleSubmit(onSubmitForm)}>
          <ProductFormFields
            register={register}
            control={control}
            errors={errors}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            isEditMode={false}
          />
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProductModal;
