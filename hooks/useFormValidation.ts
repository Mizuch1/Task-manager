import { useState, useCallback } from 'react';

interface ValidationRules {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message?: string;
  };
}

interface FormErrors {
  [key: string]: string;
}

export const useFormValidation = (validationRules: ValidationRules) => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = useCallback((name: string, value: string) => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && (!value || value.trim() === '')) {
      return rules.message || 'Ce champ est requis';
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      return rules.message || `Minimum ${rules.minLength} caractères requis`;
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      return rules.message || `Maximum ${rules.maxLength} caractères autorisés`;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      return rules.message || 'Format invalide';
    }

    return '';
  }, [validationRules]);

  const validateForm = useCallback((formData: { [key: string]: string }) => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const error = validateField(key, formData[key] || '');
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules, validateField]);

  const getFieldError = useCallback((name: string) => {
    return errors[name] || '';
  }, [errors]);

  return {
    errors,
    validateField,
    validateForm,
    getFieldError,
    isValid: Object.keys(errors).length === 0
  };
};
