import { useCallback } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import type { Product } from '../homePage/productCard';

type ProductFormData = Omit<Product, 'id' | 'rating'>;

interface UseImageUploadProps {
  setValue: UseFormSetValue<ProductFormData>;
  existingImage?: string;
}

export const useImageUpload = ({ setValue, existingImage }: UseImageUploadProps) => {
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setValue('image', base64String, { shouldValidate: true });
        };
        reader.onerror = () => {
        };
        reader.readAsDataURL(file);
      } else if (existingImage) {
        setValue('image', existingImage, { shouldValidate: false });
      }
    },
    [setValue, existingImage],
  );

  return { handleImageChange };
};
