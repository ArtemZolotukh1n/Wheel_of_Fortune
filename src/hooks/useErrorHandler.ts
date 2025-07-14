import { useState, useCallback } from 'react';

export interface AppError {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
  dismissible: boolean;
  autoHide?: boolean;
  duration?: number;
}

export const useErrorHandler = () => {
  const [errors, setErrors] = useState<AppError[]>([]);

  const addError = useCallback(
    (
      message: string,
      type: AppError['type'] = 'error',
      options: {
        dismissible?: boolean;
        autoHide?: boolean;
        duration?: number;
      } = {},
    ) => {
      const error: AppError = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        message,
        type,
        timestamp: new Date(),
        dismissible: options.dismissible ?? true,
        autoHide: options.autoHide ?? (type === 'success' || type === 'info'),
        duration:
          options.duration ??
          (type === 'success' ? 3000 : type === 'info' ? 4000 : 0),
      };

      setErrors((prev) => [...prev, error]);

      // Auto-hide if specified
      if (error.autoHide && error.duration && error.duration > 0) {
        setTimeout(() => {
          dismissError(error.id);
        }, error.duration);
      }

      return error.id;
    },
    [],
  );

  const dismissError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((error) => error.id !== id));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const addSuccess = useCallback(
    (message: string, options?: { duration?: number }) => {
      return addError(message, 'success', { autoHide: true, ...options });
    },
    [addError],
  );

  const addWarning = useCallback(
    (message: string, options?: { dismissible?: boolean }) => {
      return addError(message, 'warning', options);
    },
    [addError],
  );

  const addInfo = useCallback(
    (message: string, options?: { duration?: number }) => {
      return addError(message, 'info', { autoHide: true, ...options });
    },
    [addError],
  );

  return {
    errors,
    addError,
    addSuccess,
    addWarning,
    addInfo,
    dismissError,
    clearAllErrors,
  };
};
