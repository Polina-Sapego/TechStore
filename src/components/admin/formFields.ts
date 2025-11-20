import type { FieldErrors, FieldValues } from 'react-hook-form';

export const formProductFields = {
  title: {
    fieldName: 'title' as const,
    label: 'Title',
    requiredText: 'Title is required',
    placeholder: 'Enter product title',
  },
  price: {
    fieldName: 'price' as const,
    label: 'Price',
    requiredText: 'Price is required',
    placeholder: '0.00',
    min: { value: 0, message: 'Price must be positive' },
  },
  image: {
    fieldName: 'image' as const,
    label: 'Image',
    requiredText: 'Image is required',
  },
  category: {
    fieldName: 'category' as const,
    label: 'Category',
    requiredText: 'Category is required',
    options: [
      { value: 'accessories', label: 'Accessories' },
      { value: 'laptops', label: 'Laptops' },
      { value: 'phones', label: 'Phones' },
    ],
  },
  inStock: {
    fieldName: 'inStock' as const,
    label: 'In Stock',
  },
};

export const getFieldError = <T extends FieldValues>(
  errors: FieldErrors<T>,
  fieldName: string,
): string | undefined => {
  const error = errors[fieldName as keyof typeof errors];
  return error?.message as string | undefined;
};
