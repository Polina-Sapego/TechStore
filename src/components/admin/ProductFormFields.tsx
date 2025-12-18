import React from 'react';
import { type Control, Controller, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { Product } from '../homePage/productCard';
import { formProductFields, getFieldError } from './formFields';

type ProductFormData = Omit<Product, 'id' | 'rating'>;

interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormData>;
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  imagePreview?: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditMode?: boolean;
}

const ProductFormFields: React.FC<ProductFormFieldsProps> = ({
  register,
  control,
  errors,
  imagePreview,
  onImageChange,
  isEditMode = false,
}) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor={formProductFields.title.fieldName}>
          {formProductFields.title.label} *
        </label>
        <input
          type="text"
          id={formProductFields.title.fieldName}
          {...register(formProductFields.title.fieldName, {
            required: formProductFields.title.requiredText,
          })}
          placeholder={formProductFields.title.placeholder}
        />
        {getFieldError(errors, formProductFields.title.fieldName) && (
          <span style={{ color: 'red', fontSize: '0.8rem' }}>
            {getFieldError(errors, formProductFields.title.fieldName)}
          </span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor={formProductFields.price.fieldName}>
          {formProductFields.price.label} *
        </label>
        <input
          type="number"
          id={formProductFields.price.fieldName}
          {...register(formProductFields.price.fieldName, {
            required: formProductFields.price.requiredText,
            min: formProductFields.price.min,
            valueAsNumber: true,
          })}
          min="0"
          step="0.01"
          placeholder={formProductFields.price.placeholder}
        />
        {getFieldError(errors, formProductFields.price.fieldName) && (
          <span style={{ color: 'red', fontSize: '0.8rem' }}>
            {getFieldError(errors, formProductFields.price.fieldName)}
          </span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor={formProductFields.image.fieldName}>
          {formProductFields.image.label} {!isEditMode && '*'}
        </label>
        <input
          type="file"
          id={formProductFields.image.fieldName}
          accept="image/*"
          onChange={onImageChange}
          required={!isEditMode}
        />
        {imagePreview && (
          <div className="image-preview">
            <img className="image-preview-cart" src={imagePreview} alt="Preview" />
          </div>
        )}
        {getFieldError(errors, formProductFields.image.fieldName) && (
          <span style={{ color: 'red', fontSize: '0.8rem' }}>
            {getFieldError(errors, formProductFields.image.fieldName)}
          </span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor={formProductFields.category.fieldName}>
          {formProductFields.category.label} *
        </label>
        <Controller
          name={formProductFields.category.fieldName}
          control={control}
          rules={{ required: formProductFields.category.requiredText }}
          render={({ field }) => (
            <select className="form-group-select" id={formProductFields.category.fieldName} {...field}>
              {formProductFields.category.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
        {getFieldError(errors, formProductFields.category.fieldName) && (
          <span style={{ color: 'red', fontSize: '0.8rem' }}>
            {getFieldError(errors, formProductFields.category.fieldName)}
          </span>
        )}
      </div>
      <div className="form-group checkbox-group">
        <Controller
          name={formProductFields.inStock.fieldName}
          control={control}
          render={({ field: { value, onChange } }) => (
            <label className="checkbox-text" htmlFor={formProductFields.inStock.fieldName}>
              <input
                type="checkbox"
                id={formProductFields.inStock.fieldName}
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
              />
              {formProductFields.inStock.label}
            </label>
          )}
        />
      </div>
    </>
  );
};

export default ProductFormFields;
