import { useState } from 'react';
import { validateForm } from './ValidateForm';

export const useFormValidation = (initialState?: any) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange =
    (field: string) =>
    (
        eventOrValue:
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
            | string
            | number
            | any[] 
    ) => {
        const value =
            typeof eventOrValue === "string" || typeof eventOrValue === "number"
            ? eventOrValue 
            : Array.isArray(eventOrValue)
            ? eventOrValue
            : eventOrValue?.target?.value; 

        setFormData((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };


  // Đặc biệt cho Select
  const handleSelectChange = (field: string) => (event: React.ChangeEvent<{ value: unknown }>) => {
    const { value } = event.target;
    setFormData((prev:any) => ({
      ...prev,
      [field]: value,
    }));
  };
  const setFieldValue = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' }); // Xóa lỗi khi giá trị thay đổi
  };

  const validate = (validationRules: any[],  labels: Record<string, string>) => {
    const newErrors = validateForm(validationRules, labels);
    setErrors(newErrors);
    return newErrors;
  };

  return { formData, errors, handleChange, validate, setFieldValue, handleSelectChange };
};
